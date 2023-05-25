const fs = require("fs");
const path = require("path");
const validUrl = require("valid-url");
const isNumber = require("@stdlib/number-ctor");
const moment = require("moment");
const exp = require("constants");

// variables
// const dataPath = path.join(__dirname, "../data/courses.json");
const dataPath = path.join(__dirname, "../data/courses.json");

//helper methods
const readFile = (
  callback,
  returnJson = false,
  filePath = dataPath,
  encoding = "utf8"
) => {
  fs.readFile(filePath, encoding, (err, data) => {
    if (err) {
      console.log(err);
    }
    callback(returnJson ? JSON.parse(data) : data);
  });
};

//write to file.
const writeFile = (
  fileData,
  callback,
  filePath = dataPath,
  encoding = "utf8"
) => {
  fs.writeFile(filePath, fileData, encoding, (err) => {
    if (err) {
      console.log(err);
    }

    callback();
  });
};

//Check if the date is valid.
function validateDate(dateString) {
  return moment(dateString, "DD-MM-YYYY", true).isValid();
}

//return true if the string contains special characters.
function containsSpecialChars(str) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
}

//export
module.exports = {
  // get all the courses
  getCourses: function (req, res) {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        /* the file is empty */
        if (data.length == 0) {
          res.status(200).send("The file is empty!");
          return;
        }
        res.send(JSON.parse(data));
      }
    });
  },

  //Create course
  CreateCourse: function (req, res) {
    // Get the course data from the request body
    const newCourse = req.body;

    // Check if the request body contains all 7 required fields
    const expectedFields = [
      "id",
      "name",
      "lecturer",
      "start_date",
      "end_date",
      "prerequisite_course",
      "students",
    ];
    const requestBodyFields = Object.keys(newCourse);

    if (
      requestBodyFields.length !== expectedFields.length ||
      !expectedFields.every((field) => requestBodyFields.includes(field))
    ) {
      res
        .status(400)
        .send("Error: Invalid input. The course must have 7 fields.");

      return;
    }

    //Some extremely cases in the students list like grade, url valid id...
    for (const studentId in newCourse.students) {
      if (newCourse.students.hasOwnProperty(studentId)) {
        const student = newCourse.students[studentId];
        if (
          containsSpecialChars(student.id) ||
          !validUrl.isUri(student.picture) ||
          !isNumber(student.grade) ||
          student.grade >= 101 ||
          student.grade <= -1
        ) {
          return res
            .status(400)
            .send("Error: One of your students have an invalid property");
        }
      }
    }

    if (
      !validateDate(req.body.start_date) ||
      !validateDate(req.body.end_date)
    ) {
      return res
        .status(400)
        .send("Error: Invalid date format. Please give valid date");
    }

    // Check if the start date is before the end date
    if (
      moment(newCourse.start_date, "DD/MM/YYYY").isAfter(
        moment(newCourse.end_date, "DD/MM/YYYY")
      )
    ) {
      res
        .status(400)
        .send(
          "Error: Invalid date range. The start date must be before the end date."
        );

      return;
    }

    if (containsSpecialChars(newCourse.id)) {
      res.status(400).send("Error: Invalid id.");
      return;
    }
    // Read the existing courses from the JSON file
    readFile((data) => {
      // Check if course already exists
      if (data[newCourse.id]) {
        res.status(400).send("Error: Course already exists.");
        return;
      }

      // Add the new course to the data object
      data[newCourse.id] = newCourse;
      // Write the updated data back to the JSON file
      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send("New course added.");
      });
    }, true);
  },

  //Get course
  getCourse: function (req, res) {
    // Get the course ID from the request parameters
    const courseId = req.params.courseID;

    // Read the existing courses from the JSON file
    readFile((data) => {
      // Check if this course with the specified ID is already exists
      if (!data[courseId]) {
        res.status(404).send("Error: Course not found.");
        return;
      }

      const course = data[courseId];

      // Send the course as a response
      res.status(200).json(course);
    }, true);
  },

  //delete a course
  deleteCourse: function (req, res) {
    // Get the course ID from the URL parameters
    const courseID = req.params.courseID;

    // Read the courses from the JSON file
    readFile((data) => {
      // Check if the course is already exists
      if (!data[courseID]) {
        res.status(404).send("Error:This cours ID was not found.");
        return;
      }

      delete data[courseID]; //Delete the course from the data object

      // Write the updated data back to the JSON file
      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send("Course deleted successfully.");
      });
    }, true);
  },

  //Delete a student
  deleteStudentFromCourse: function (req, res) {
    const courseID = req.params.courseID;
    const studentID = req.params.studentID;

    readFile((data) => {
      if (!courseID || !studentID) {
        return res
          .status(400)
          .send(
            `Course with ID ${courseID} or Student with ${studentID} not found`
          );
      }
      const course = data[courseID];
      if (!course) {
        return res.status(404).send(`The Course ID: ${courseID} was not found`);
      }

      if (!course.students || !course.students[studentID]) {
        return res
          .status(400)
          .send(`The Student ID: ${studentID} was not found`);
      }

      // Delete the student from the course
      delete course.students[studentID];

      writeFile(JSON.stringify(data, null, 2), () => {
        res
          .status(200)
          .send(`Student with ID ${studentID} deleted from course ${courseID}`);
      });
    }, true);
  },

  //Update course
  updateCourse: function (req, res) {
    //If the user will try to change the ID of the course or any other field of the student it will no really change.
    readFile((data) => {
      // Update the course
      const courseId = req.params.courseID;
      if (!courseId) {
        return res.status(400).send("Course ID is required");
      }

      if (!data[courseId]) {
        return res.status(400).send(`Course with ID: ${courseId} not found`);
      }

      const existingCourse = data[courseId];
      const updatedCourse = req.body;

      //check if the fields exists
      if (
        !updatedCourse ||
        !updatedCourse["id"] ||
        !updatedCourse["name"] ||
        !updatedCourse["lecturer"] ||
        !updatedCourse["start_date"] ||
        !updatedCourse["end_date"] ||
        !updatedCourse["prerequisite_course"] ||
        !existingCourse["students"]
      ) {
        return res
          .status(400)
          .send(
            `Your course with ID ${courseId} have some missing information`
          );
      }

      //check date
      if (
        !validateDate(updatedCourse["start_date"]) ||
        !validateDate(updatedCourse["end_date"])
      ) {
        return res
          .status(400)
          .send("Error: Invalid date format. Please provide a valid date.");
      }

      // Check if the start date is before the end date
      if (
        moment(updatedCourse["start_date"], "DD-MM-YYYY").isAfter(
          moment(updatedCourse["end_date"], "DD-MM-YYYY")
        )
      ) {
        return res
          .status(400)
          .send(
            "Error: Invalid date range. The start date must be before the end date."
          );
      }

      //update the data
      if (updatedCourse["name"]) {
        // Update the desired fields
        existingCourse["name"] = updatedCourse["name"];
      }
      if (updatedCourse["lecturer"]) {
        existingCourse["lecturer"] = updatedCourse["lecturer"];
      }
      if (updatedCourse["start_date"]) {
        existingCourse["start_date"] = updatedCourse["start_date"];
      }
      if (updatedCourse["end_date"]) {
        existingCourse["end_date"] = updatedCourse["end_date"];
      }
      if (updatedCourse["prerequisite_course"]) {
        existingCourse["prerequisite_course"] =
          updatedCourse["prerequisite_course"];
      }

      data[courseId] = existingCourse;

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(`Course with ID ${courseId} updated`);
      });
    }, true);
  },

  //Add student to course
  AddStudentToCourse: function (req, res) {
    const courseId = req.params.courseID; // Extract the course ID from the URL parameter
    const studentDetails = req.body.id;
    console.log(studentDetails);
    readFile((data) => {
      // Check if course exists
      const course = data[courseId];
      if (!course) {
        return res.status(400).send("The requested course does not exist!");
      }
      if (
        !req.body.id ||
        !req.body.firstname ||
        !req.body.surname ||
        !req.body.picture ||
        !req.body.grade
      ) {
        return res.status(400).send("One of the student fields is missing!");
      }

      // Check if student already exists in the course
      const studentId = req.body.id;

      if (course.students && course.students[studentId]) {
        return res
          .status(400)
          .send("The student already exists in that course!");
      }

      const courseURL = req.body.picture;
      console.log(courseURL);
      if (!validUrl.isWebUri(courseURL)) {
        return res.status(400).send("The URL is not in the specified format");
      }

      const grade = Number(req.body.grade);
      console.log(grade);

      if (!isNumber(grade) || grade < 0 || grade > 100) {
        return res
          .status(400)
          .send("The grade is not a valid number between 0 and 100");
      }

      // Add the student to the course
      course.students = course.students || {};
      course.students[studentId] = req.body;

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(`User ID: ${studentId} updated`);
      });
    }, true);
  },
};
