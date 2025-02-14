let studentFrameContainer = document.querySelector("#studentFrameContainer");
let currentDateLabel = document.querySelector("#currentDateLabel");

currentDateLabel.textContent = new Date().toLocaleDateString();

async function FetchStudentData() {
  let response = await fetch("http://localhost:3000/students");
  let students = await response.json();
  return students;
}

async function InitializeStudents() {
  let studentData = await FetchStudentData();
  studentData.forEach((student) => {
    let studentName = student.student_name;
    let studentId = student.student_id;
    let studentAttendance = student.attendance;
    let attendanceStatus =
      studentAttendance == "Absent" ? "absentLabel" : "presentLabel";
    let studentPhoto =
      student.has_photo == "True"
        ? `images/${studentId}.png`
        : `images/person-logo.png`;
    let studentFrameHtml = `
   <div class="studentFrame">
  <a target="_blank" href="second.html">
    <img src="${studentPhoto}" alt="person-logo" width="200" />
  </a>
  <div class="description">
    <p id="studentName">${studentName}</p>
    <p class="${attendanceStatus}">${studentAttendance}</p>
  </div>
</div> `;
    studentFrameContainer.insertAdjacentHTML("afterend", studentFrameHtml);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  InitializeStudents();
});
