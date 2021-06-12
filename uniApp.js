// Select the needed HTML elements

const totalUnits = document.querySelector('.total_units--output');
const totalUnitsPoints = document.querySelector('.total_units_points--output');
const gradePointAverage = document.querySelector('.gpa--output');
const cumulativeGradePointAverage = document.querySelector('.cgpa--output');

const courseList = document.querySelector('.course-list')

const universityGrades = Array.from(document.querySelectorAll('.university-grade'));
const universityGradesValue = Array.from(document.querySelectorAll('.university-grade-value'));

const getValues = function(args) {
    let val;
    val = args.map(value =>  value.innerText || value.value || value.textContent)
    return val;
};

const getUniversityGrade = getValues(universityGrades);
const getUniversityGradeValue = getValues(universityGradesValue);

const universityGradeTable = document.querySelector('.university--table');

// Combining both grade and grade point together and saving them into an object:
const createGradingObject = function(arg1, arg2) {
    let grade = {};
    for (let i = 0; i < arg1.length; i++) {
        grade[arg1[i]] = arg2[i]
    }
    return grade;
};

const uniGrades = createGradingObject(getUniversityGrade, getUniversityGradeValue)

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
    if(uniGrades[capitalizeGrade] === undefined) {
        showAlert('Please enter a valid course grade', 'error')
        return;
    }
   
    // Validating course unit
    if(isNaN(unitInteger) === true) {
        showAlert('Please enter a valid course unit', 'error')
        return;
    }
    
    if ( typeof code === 'string' && typeof unitInteger  === 'number' && typeof grade === 'string') {
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
    const totalPoint = calculateTotalPoint(courseUnit, courseGrade, uniGrades)
  
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
// 

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
// let deleteBtns = Array.from(document.getElementsByTagName('span'));

// deleteBtns.forEach(btn => {
//     console.log(deleteBtns)
//     btn.addEventListener('click', function(e) {
//         // event.preventDefault();
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

    let courseCodeInput = document.querySelector('#course-code').value;
    let courseUnitInput = document.querySelector('#course-unit').value;
    let courseGradePointInput = document.querySelector('#course-grade-point').value;

    const course = createCourse(courseCodeInput, courseUnitInput, courseGradePointInput);
    addCourseToList(course);
});


// Displaying all calculated Values all output
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


// calculator()
