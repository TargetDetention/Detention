const studentList = [];

function addStudent() {
  event.preventDefault();
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
  localStorage.setItem("studentList", JSON.stringify(studentList));
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
  const studentCount = document.getElementById("student-count"); // Get the student count element
  list.innerHTML = ""; // Clear the current list

  studentList.forEach((student, index) => {
    const li = document.createElement("li");
    li.classList.add(
      "flex",
      "items-center",
      "justify-between",
      "border",
      "rounded-lg",
      "px-4",
      "py-3",
      "bg-white",
      "shadow-md",
      "mb-3",
      "hover:shadow-lg",
      "transition-all",
      "duration-200",
      "ease-in-out"
    );
  
    const infoContainer = document.createElement("div");
    infoContainer.classList.add("flex", "flex-col");
  
    const nameSpan = document.createElement("span");
    nameSpan.textContent = student.name;
    nameSpan.classList.add("font-semibold", "text-gray-800");
  
    const studentClassSpan = document.createElement("span");
    studentClassSpan.textContent = `Class: ${student.class}`;
    studentClassSpan.classList.add("text-sm", "text-gray-600");
  
    const moreLink = document.createElement("p");
    moreLink.classList.add(
      "cursor-pointer",
      "text-blue-500",
      "hover:text-blue-700",
      "text-sm",
      "mt-1"
    );
    moreLink.textContent = "More Info";
    moreLink.onclick = () => showStudentDetails(student);
  
    infoContainer.append(nameSpan, studentClassSpan);
  
    // Create delete icon
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add(
      "fas",
      "fa-trash-alt",
      "text-red-500",
      "hover:text-red-700",
      "cursor-pointer",
      "ml-4"
    );
  
    // Add onclick event to the delete icon
    deleteIcon.onclick = () => {
      console.log("Deleting student:", student.name); // Debugging log
  
      // Remove student from the studentList array
      studentList.splice(index, 1);
  
      // Update localStorage with the new student list
      localStorage.setItem("studentList", JSON.stringify(studentList));
  
      // Remove the list item (li) from the DOM
      list.removeChild(li);
  
      // Update the student list and count
      updateStudentList(); // Refresh the student list
    };
  
    li.append(infoContainer, moreLink, deleteIcon);
    list.appendChild(li);
  });
  

  // Update the student count dynamically
  studentCount.textContent = studentList.length;
}

document.getElementById("student-list").addEventListener("click", function (event) {
  if (event.target && event.target.matches("i.fa-trash-alt")) {
    const index = event.target.dataset.index;
    deleteStudent(index);
  }
});

function showStudentDetails(student) {
  alert(
    `Имя: ${student.name}\nКласс: ${student.class}\nSabab: ${student.reason}\nUstoz: ${student.teacher}\nLevel: ${student.level}`
  );
}

function deleteStudent(index) {
  // Удаляем студента по индексу
  studentList.splice(index, 1);
  localStorage.setItem("studentList", JSON.stringify(studentList)); // Сохраняем обновленный список в localStorage
  updateStudentList(); // Обновляем список студентов на экране
}

function sendToTelegram() {
  const token = "7518523766:AAEbIrHgawrjOBnpl73gPto5urP561woc1s";
  const chatId = "7372115173";

  if (studentList.length === 0) {
    alert("Studentlar spiskasi bosh. Jonatishga xich narsa yoq.");
    return;
  }

  let message =
    `*Дата:* ${new Date().toLocaleString("ru-RU")}\n` +
    `*Detention spiskasida ${studentList.length} ta odam bor.*\n\n`; // O'zgartirilgan qator

  studentList.forEach((student, index) => {
    message +=
      `№${index + 1}\n` +
      `*Ismi:* ${student.name}\n` +
      `*Sinfi:* ${student.class}\n` +
      `*Sababi:* ${student.reason}\n` +
      `*Ustozi:* ${student.teacher}\n` +
      `*Leveli:* ${student.level}\n\n`;
  });

  // При отправке нужно указать parse_mode: "Markdown"
  axios
    .post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown", // Указывает использование Markdown
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
