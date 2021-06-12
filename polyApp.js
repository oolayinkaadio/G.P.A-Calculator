// Select the needed HTML elements

const totalUnits = document.querySelector('.total_units--output');
const totalUnitsPoints = document.querySelector('.total_units_points--output');
const gradePointAverage = document.querySelector('.gpa--output');
const cumulativeGradePointAverage = document.querySelector('.cgpa--output');

const courseList = document.querySelector('.course-list')

const polytechnicGrades = Array.from(document.querySelectorAll('.polytechnic-grade'));
const polytechnicGradesValue = Array.from(document.querySelectorAll('.polytechnic-grade-value'));

const getValues = function(args) {
    let val;
    val = args.map(value =>  value.innerText || value.value || value.textContent)
    return val;
};

const getPolytechnicGrade = getValues(polytechnicGrades);
const getPolytechnicGradeValue = getValues(polytechnicGradesValue);

const polytechnicGradeTable = document.querySelector('.polytechnic--table');


// combining both grade and grade point together and saving them into an object:
const createGradingObject = function(arg1, arg2) {
    let grade = {};
    for (let i = 0; i < arg1.length; i++) {
        grade[arg1[i]] = arg2[i]
    }
    return grade;
}

const polyGrades = createGradingObject(getPolytechnicGrade, getPolytechnicGradeValue);

// CALCULATING TOTAL POINT FOR EACH COURSE
const calculateTotalPoint = function(unit, grade, gradingObject) {
    let result;
    if(gradingObject[grade] != undefined) {
        let gradePoint = gradingObject[grade];
        result = unit * gradePoint;
    }
    return result;
};


// FUNCTION FOR VALIDATING EACH COURSES AND CREATING A COURSE OBJECT:
function createCourse(code, unit, grade) {
    let course = {};
    let unitInteger = parseInt(unit);
    if(code.length === 0  && unit.length === 0 && grade.length === 0) {
        showAlert('Please enter a valid course details', 'error')
        return;
    };
   
    const capitalizeGrade = grade.toUpperCase();
    // Validating grade
    if(polyGrades[capitalizeGrade] === undefined) {
        showAlert('Please enter a valid course grade', 'error')
        return;
    }
   
    // Validating course unit
    if(isNaN(unitInteger) === true) {
        showAlert('Please enter a valid course unit', 'error')
        return;
    }
    
    if ( typeof code === 'string' && typeof unitInteger  === 'number' && typeof grade === 'string') {
        const capitalizeGrade = grade.toUpperCase();
        course.courseCode = code;
        course.courseUnit = unitInteger;
        course.courseGrade = capitalizeGrade;
        return course;
    }
    
}


// FUNCTION FOR ADDING A NEW COURSE TO THE COURSE LIST
const addCourseToList = function(course) {
    if(!course) return;
    let { courseCode } = course; 
    let { courseUnit } = course; 
    let { courseGrade } = course; 
    // Getting the value of Total point for each course
    const totalPoint = calculateTotalPoint(courseUnit, courseGrade, polyGrades)
  
    // Create a table row element
    const row = document.createElement("tr");
    // Insert cols
    row.innerHTML = `
    <td class="course-code">${courseCode}</td>
    <td class="course-unit">${courseUnit}</td>
    <td>${courseGrade}</td>
    <td class="total-course-unit">${totalPoint}</td>
    <td><span class="delete">X</span></td>
    `;
  
    // Add the new course to the list of courses
    courseList.appendChild(row);

      // Successful Alert Message
      showAlert('Course successfully added', 'success');

      // Clear the input field
      document.querySelector('#course-code').value = "";
      document.querySelector('#course-unit').value = "";
      document.querySelector('#course-grade-point').value = "";

        // Deleting each course on click::
    // I had to do delete this way because the querySelectorAll method is not tracking
    // the new rows being inserted in the page after page load
    Array.from(document.querySelectorAll('.delete')).forEach(btn => {
        // Array.from(document.getElementsByTagName('span')).forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                btn.parentElement.parentElement.remove();
                showAlert('Course deleted successfully', 'success')
                }
    )});
  };
  

  // Delete a course  from the list of courses:
// const deleteBtns = Array.from(document.querySelectorAll('.delete'));

// deleteBtns.forEach(btn => {
//     btn.addEventListener('click', function(event) {
//         event.preventDefault();

//         console.log(btn.parentElement)
//         console.log(btn.parentElement)
//         btn.parentElement.parentElement.remove();
//         showAlert('Course deleted successfully', 'success')
//          }
// )});


// To sum up all the values in an array:
const summation = function(arr) {
    let output = 0;
    for(let i = 0; i < arr.length; i++) {
        output += parseInt(arr[i])
    }
    return output;
}

// Showing Alert Messages
const showAlert = function(message, className) {
    const newDiv = document.createElement("div");
    newDiv.className = `alert ${className}`;
    newDiv.appendChild(document.createTextNode(message));
    const parentElement = document.querySelector(".content");
    const nextElement = document.querySelector(".grading--content");
    parentElement.insertBefore(newDiv, nextElement);
   
    // Timeout 3s
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, 3000);
  };


// Adding Course to List of Courses:
const submitBtn = document.querySelector('.submit--course');
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const courseCodeInput = document.querySelector('#course-code').value;
    const courseUnitInput = document.querySelector('#course-unit').value;
    const courseGradePointInput = document.querySelector('#course-grade-point').value;

    const course = createCourse(courseCodeInput, courseUnitInput, courseGradePointInput);
    addCourseToList(course);
});

// Dispalying all calculated Values all output
function calculator() {
     // Check if course list is not empty or 0:
     if(courseList.rows.length === 0) {
        return showAlert('Please provide a valid course details', 'error');
    }
    // Total Course Unit:
    const courseUnitArray = Array.from(document.querySelectorAll('.course-unit'));
    const courseUnitArrayValues = getValues(courseUnitArray);
    const totalCourseUnitResult = summation(courseUnitArrayValues);

    // Total Course Unit Point
    const totalCourseUnitPointArray = Array.from(document.querySelectorAll('.total-course-unit'));
    const totalCourseUnitArrayValues = getValues(totalCourseUnitPointArray);
    const totalCourseUnitPointResult = summation(totalCourseUnitArrayValues);

    // Grade Point Average
    const gpa = (totalCourseUnitPointResult/totalCourseUnitResult).toFixed(2);
    // Cumulative Grade Point Average
    const cgpa = gpa;

    // Display Total Units
    totalUnits.innerText = totalCourseUnitResult;

    // Display Total Units Points
    totalUnitsPoints.innerText = totalCourseUnitPointResult;

    // Display GPA
    gradePointAverage.innerText = gpa;

    // Display CGPA
    cumulativeGradePointAverage.innerText = cgpa;
}



const calculateCGPA = document.querySelector('.calculate--cgpa');
calculateCGPA.addEventListener('click', calculator)


