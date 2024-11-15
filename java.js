const studentList = [];

function addStudent() {
  event.preventDefault()
  const nameInput = document.querySelector('input[name="name"]');
  const classInput = document.querySelector('select[name="class"]');
  const reasonInput = document.querySelector('input[name="reason"]');
  const levelInput = document.querySelector('select[name="level"]');
  const teacherInput = document.querySelector('select[name="teacher"]');

  const name = nameInput.value.trim();
  const studentClass = classInput.value;
  const reason = reasonInput.value.trim();
  const teacher = teacherInput.value;
  const level = levelInput.value;

  if (!name || !studentClass || !teacher || !level || !reason) return;

  const isDuplicate = studentList.some(
    (student) =>
      student.name.toLowerCase() === name.toLowerCase() &&
      student.class === studentClass
  );

  if (isDuplicate) {
    alert("Student allaqachon spiskada");
    return;
  }

  const student = { name, class: studentClass, teacher, level, reason };
  studentList.push(student);
  localStorage.setItem('studentList', JSON.stringify(studentList)); 
  updateStudentList();
  clearInputs();
}

function clearInputs() {
  event.preventDefault(); 
  document.querySelector('input[name="name"]').value = "";
  document.querySelector('select[name="class"]').value = "";
  document.querySelector('input[name="reason"]').value = "";
  document.querySelector('select[name="teacher"]').value = "";
  document.querySelector('select[name="level"]').value = "";
}

function updateStudentList() {
const list = document.getElementById("student-list");
list.innerHTML = ""; // Clear the current list

studentList.forEach((student, index) => {
const li = document.createElement("li");
li.classList.add(
"flex",
"items-center",
"justify-between",
"border",
"rounded",
"px-3",
"py-2",
"fade-in"
);

const nameSpan = document.createElement("span");
nameSpan.textContent = student.name;

const moreLink = document.createElement("p");
moreLink.classList.add("cursor-pointer", "text-blue");
moreLink.textContent = "Student info";
moreLink.onclick = () => showStudentDetails(student);

const deleteIcon = document.createElement("i");
deleteIcon.classList.add("fas", "fa-trash-alt", "text-red-500", "cursor-pointer");
deleteIcon.onclick = () => deleteStudent(deleteIcon);


// Delete student when the delete icon is clicked
deleteIcon.onclick = () => {
studentList.splice(index, 1); // Remove student from the array
localStorage.setItem("studentList", JSON.stringify(studentList)); // Update local storage
updateStudentList(); // Refresh the student list
};

li.append(nameSpan, moreLink, deleteIcon);
list.appendChild(li);
});
}


function showStudentDetails(student) {
  alert(
    `Имя: ${student.name}\nКласс: ${student.class}\nSabab: ${student.reason}\nUstoz: ${student.teacher}\nLevel: ${student.level}`
  );  
}

function deleteStudent(element) {
  studentList.splice(index, 1);
  localStorage.setItem('studentList', JSON.stringify(studentList));
  
  updateStudentList();
} 

function sendToTelegram() {
  const token = "7881537270:AAGQkizmVJH4wB0xLx3-6zm3MmMBzmwnB8Y";
  const chatId = "-1002475402801";

  if (studentList.length === 0) {
    alert("Studentlar spiskasi bosh. Jonatishga xich narsa yoq.");
    return;
  }

  let message = "Data: " + new Date().toLocaleString("ru-RU") + "\nOquvchilar soni: " + studentList.length + "\n\n";
studentList.forEach((student, index) => {
  message += `${index + 1}) Ism: {${student.name}}, Sinf: {${student.class}}, Sabab: {${student.reason}}, Ustoz: {${student.teacher}}, Level: {${student.level}}\n\n`;
});
axios
    .post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
    })
    .then(() => {
      alert("Telegramga Jonatildi!");

      studentList.length = 0;
      updateStudentList();
    })
    .catch(() => {
      alert("Telegramga Jonatishda hatolik!");
    });
}