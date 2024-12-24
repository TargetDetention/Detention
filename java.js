const studentList = [];

function getLessonForToday() {
  const schedule = {
    1: "Matematika",
    2: "Sat Math",      
    3: "Geometry",    
    4: "Sat Math",       
    5: "Matematika",  
  };

  const today = new Date().getDay(); 

  if (today === 6) {
    return "Bugun Shanba, detention yoq";  
  } else if (today === 0) {
    return "Bugun Yakshanba, detention yoq";  
  }

  const lesson = schedule[today] || "Detention kuni emas"; 

  return lesson;
}


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
  const studentCount = document.getElementById("student-count");
  list.innerHTML = "";

  studentList.forEach((student, index) => {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "space-between";
    container.style.alignItems = "center";
    container.style.border = "1px solid #ddd";
    container.style.borderRadius = "8px";
    container.style.padding = "16px";
    container.style.background = "white";
    container.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    container.style.transition = "all 0.2s ease-in-out";
    container.style.marginBottom = "12px";
    container.classList.add("student-container");

    container.addEventListener("mouseover", () => {
      container.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
    });

    container.addEventListener("mouseout", () => {
      container.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    });

    const infoContainer = document.createElement("div");
    infoContainer.style.display = "flex";
    infoContainer.style.flexDirection = "column";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = student.name;
    nameSpan.style.fontWeight = "bold";
    nameSpan.style.color = "#333";

    const studentClassSpan = document.createElement("span");
    studentClassSpan.textContent = `Class: ${student.class}`;
    studentClassSpan.style.color = "#666";
    studentClassSpan.style.fontSize = "14px";

    infoContainer.append(nameSpan, studentClassSpan);

    const moreLink = document.createElement("p");
    moreLink.textContent = "More Info";
    moreLink.style.color = "#007bff";
    moreLink.style.textDecoration = "none";
    moreLink.style.cursor = "pointer";
    moreLink.style.margin = "0 auto"; // Center the link in the container
    moreLink.addEventListener("mouseover", () => {
      moreLink.style.color = "#0056b3";
    });
    moreLink.addEventListener("mouseout", () => {
      moreLink.style.color = "#007bff";
    });
    moreLink.onclick = () => showStudentDetails(student);

    // Create delete button with trash icon
    const deleteButton = document.createElement("button");
    deleteButton.style.background = "none";
    deleteButton.style.border = "none";
    deleteButton.style.cursor = "pointer";

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "./trash-can-regular.svg"; // Replace with the actual path to your trash icon
    deleteIcon.alt = "Delete";
    deleteIcon.style.width = "20px";
    deleteIcon.style.height = "20px";
    deleteIcon.style.filter = "invert(19%) sepia(94%) saturate(7493%) hue-rotate(356deg) brightness(98%) contrast(122%)"; // Red color

    deleteButton.appendChild(deleteIcon);
    deleteButton.onclick = () => {
      deleteStudent(index, container);
    };

    container.append(infoContainer, moreLink, deleteButton);
    list.appendChild(container);
  });
  studentCount.textContent = studentList.length;
}

function deleteStudent(index, container) {
  // Hide the container
  container.style.display = "none";

  // Remove student from the array
  studentList.splice(index, 1);

  // Save updated list to local storage
  localStorage.setItem("studentList", JSON.stringify(studentList));

  // Update student count
  const studentCount = document.getElementById("student-count");
  studentCount.textContent = studentList.length;
}


function deleteStudent(index, container) {
  // Hide the container
  container.style.display = "none";

  // Remove student from the array
  studentList.splice(index, 1);

  // Save updated list to local storage
  localStorage.setItem("studentList", JSON.stringify(studentList));

  // Update student count
  const studentCount = document.getElementById("student-count");
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
  studentList.splice(index, 1);
  localStorage.setItem("studentList", JSON.stringify(studentList)); 
  updateStudentList(); 
}

function sendToTelegram() {
  const token = "7518523766:AAEbIrHgawrjOBnpl73gPto5urP561woc1s";
  const chatId = "-1002368165040";

  if (studentList.length === 0) {
    alert("Studentlar spiskasi bosh. Jonatishga xich narsa yoq.");
    return;
  }

  const lesson = getLessonForToday();

  let message =
    `*Дата:* ${(new Date().toLocaleString("ru-RU"))}\n` +
    `*Dars: ${(lesson)}*\n` +
    `*Detentionga qolganlar ${(studentList.length.toString())} ta.*\n\n`;

  studentList.forEach((student, index) => {
    message +=
      `№${index + 1}\n` +
      `*Ismi:* ${student.name}\n` +
      `*Sinfi:* ${student.class}\n` +
      `*Sababi:* ${student.reason}\n` +
      `*Ustozi:* ${student.teacher}\n` +
      `*Leveli:* ${student.level}\n\n`;
  });

  axios
  .post(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id: chatId,
    text: message,
    parse_mode: "Markdown",
  })
  .then((response) => {
    console.log("Message sent successfully:", response.data);
    Swal.fire({
      title: "Good job!",
      text: "The list has been sent to Telegram!",
      icon: "success",
      confirmButtonText: "Ok",
    });
    studentList.length = 0;  // Clear the list after sending
    updateStudentList();     // Update UI
  })
  .catch((error) => {
    console.error("Error sending message:", error.response?.data || error.message);
    Swal.fire({
      title: "Error!",
      text: "Telegramga Jonatishda hatolik yuz berdi.",
      icon: "error",
      confirmButtonText: "Cancel",
    }).then(() => {
    });
  });
}

// Listen to the "Send to Telegram" button
document.getElementById("send-button").addEventListener("click", sendToTelegram);

// Initialize the student list display
updateStudentList();
