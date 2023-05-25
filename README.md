# REST-API-COURSES
## Courses Service

In this exercise, you will have to use the Courses service, which includes information about courses and the grades of students participating in them. You must plan to build a REST service called CoursesService that stores course lists in the 'cloud', along with the list of students studying in each course and the grades assigned to them. The service will allow the system administrator to view the list of courses and the list of students with their grades for a particular course.

### Managed Information

The CoursesService will store the following details:

- Course Details: Each course will have the following information:
  - Course ID: A unique identifier for the course (can contain letters A-Z and numbers).
  - Course Name: The name of the course.
  - Lecturer's Name: The name of the lecturer teaching the course.
  - List of Students: The students participating in the course, along with their assigned grades.
  - List of Previous Courses: The list of previous courses related to the current course.
  - Course Start Date: The start date of the course.
  - Course End Date: The end date of the course.

- Student Details: Each student will have the following information:
  - Student ID: A unique identifier for the student.
  - First Name: The first name of the student.
  - Last Name: The last name of the student.
  - Profile Picture: The profile picture of the student.
  - Grade in Course: The grade assigned to the student for the course.

The information will be written to a JSON file. An example file containing the structure is attached to the exercise.

### CRUD Operations

The service will allow the following CRUD (Create, Read, Update, Delete) operations to be performed on the stored objects:

1. **CreateCourse (CourseDetails):** This function receives the course details and creates a new course. The course details include the course ID, course name, lecturer's name, list of previous courses, course start date, and course end date. All fields are mandatory.

2. **UpdateCourse (CourseID, CourseDetails):** This function updates the fields for a specific course. The CourseID parameter identifies the course to be updated. The function will return a message if the course does not exist. All fields, except for the unique course ID and the list of students, can be updated.

3. **AddStudentToCourse (CourseID, StudentDetails):** This function adds a new student to a specific course. The CourseID parameter identifies the course, and the StudentDetails parameter includes the student's ID, first name, last name, profile picture, and grade in the course. The function checks if the student already exists in the list and adds the student if not.

4. **GetCourse (CourseID):** This function retrieves the details of a specific course, including all the information stored about it.

5. **GetCourses():** This function displays the list of all courses.

6. **DeleteStudentFromCourse (CourseID, StudentID):** This function deletes a student from the student list of a specific course. The CourseID parameter identifies the course, and the StudentID parameter identifies the student to be deleted.

7. **DeleteCourse(CourseID):** This function deletes all information related to a specific course. The CourseID parameter identifies the course to be deleted.

The server will save the information in a JSON file with a structure similar to the example file provided.

### Client-Side Manipulation using jQuery and AJAX

The client-side implementation will use jQuery and AJAX to interact with the CoursesService. The `/list` page will display the list of courses in a table or list format. Each course's details will be shown, including the course identifier, course name, lecturer's
