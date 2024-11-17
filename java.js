const studentList = [];

function getLessonForToday() {
  const schedule = {
    1: "Matematika",
    2: "ES-IT",      
    3: "Geometry",    
    4: "ES-IT",       
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

    deleteIcon.onclick = () => {
      console.log("Deleting student:", student.name); 
  
      studentList.splice(index, 1);
  
      localStorage.setItem("studentList", JSON.stringify(studentList));
  
      list.removeChild(li);
  
      updateStudentList(); 
    };
  
    li.append(infoContainer, moreLink, deleteIcon);
    list.appendChild(li);
  });
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
  const chatId = "7372115173";

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
      alert("Telegramga Jonatildi!");
      studentList.length = 0;
      updateStudentList();
    })
    .catch((error) => {
      console.error("Error sending message:", error.response?.data || error.message);
      alert("Telegramga Jonatishda hatolik!");
    });
}
