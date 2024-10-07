let studBranchHtml = document.getElementById('studBranch');
let studCourseHtml = document.getElementById('studCourse');
let studYearHtml = document.getElementById('studYear');

for (option of studBranchHtml.options) {
    const value = option.value;
    const branchValue = studentInfo.studBranch;
    if (value === branchValue) {
        option.selected = true;
    }
}

for (option of studCourseHtml.options) {
    const value = option.value;
    const courseValue = studentInfo.studCourse;
    if (value === courseValue) {
        option.selected = true; 
    } 
}

for (option of studYearHtml.options) {
    const value = option.value;
    const yearValue = studentInfo.studYear;
    if (value === yearValue) {
        option.selected = true;
    }
} 
