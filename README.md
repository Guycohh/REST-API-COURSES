# REST-API-COURSES
## Courses Service

This exercise is about building a REST service called CoursesService that manages information about courses and the grades of students participating in them. The service stores course lists and the details of students in each course, along with their grades. It allows the system administrator to view the list of courses and the students enrolled in each course, along with their grades.

### Managed Information

The CoursesService handles the following details:

- Course Details: Each course has a unique course ID, course name, lecturer's name, list of students with their grades, list of previous courses, course start date, and course end date.

- Student Details: Each student is identified by a student ID and has a first name, last name, profile picture, and grade in the course.

The information is stored in a JSON file, and an example file structure is provided.

### CRUD Operations

The CoursesService supports the following CRUD (Create, Read, Update, Delete) operations:

1. **CreateCourse (CourseDetails):** This function creates a new course by providing the course details, including the course ID, course name, lecturer's name, list of previous courses, course start date, and course end date. All fields are mandatory.

2. **UpdateCourse (CourseID, CourseDetails):** This function updates the fields of a specific course. You need to provide the CourseID to identify the course to be updated. All fields, except for the course ID and the list of students, can be updated.

3. **AddStudentToCourse (CourseID, StudentDetails):** This function adds a new student to a specific course. Provide the CourseID to identify the course and the StudentDetails, which includes the student ID, first name, last name, profile picture, and grade in the course. The function checks if the student already exists in the list and adds the student if not.

4. **GetCourse (CourseID):** This function retrieves the details of a specific course, including all the stored information about it.

5. **GetCourses():** This function displays the list of all courses.

6. **DeleteStudentFromCourse (CourseID, StudentID):** This function removes a student from the student list of a specific course. Provide the CourseID to identify the course and the StudentID to identify the student to be removed.

7. **DeleteCourse(CourseID):** This function deletes all information related to a specific course. Provide the CourseID to identify the course to be deleted.

The server saves the information in a JSON file based on the provided file structure.

### Client-Side Manipulation using jQuery and AJAX

For the client-side implementation, you'll use jQuery and AJAX to interact with the CoursesService. The `/list` page will display the list of courses in a table or list format. Each course's details, such as the course identifier, course name, lecturer's name, list of students with their grades, prerequisite courses, course start date, and course end date, will be shown.

Next to each course, you'll find buttons for different actions:
1. Deleting the course
2. Editing the course details that can be modified
3. Adding a student to the student list
4. Viewing the list of students, where you can delete individual students

Above and below the list, there will be buttons to open an "Add Course" form. The form can be displayed as a panel above the list or as a separate page. After completing a course or updating its details, the user will be redirected back to the list of courses to see the changes.

To compile the project:
1. Clone the repository to your local machine.
2. Make sure you have Node.js installed.
3. Open the command prompt or terminal and navigate to the

 project directory.
4. Run the command `npm install` to install the required dependencies.
5. Start the server by running `npm start`.
6. Access the application through your web browser at the specified URL (e.g., `http://localhost:3000`).

That's it! You can now interact with the CoursesService through the user interface and perform CRUD operations on courses and student information.
