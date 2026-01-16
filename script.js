document.addEventListener("DOMContentLoaded", () => {
  const monthSelect = document.getElementById("monthSelect");
  const yearSelect = document.getElementById("yearSelect");

  const months = [
    "січень",
    "лютий",
    "березень",
    "квітень",
    "травень",
    "червень",
    "липень",
    "серпень",
    "вересень",
    "жовтень",
    "листопад",
    "грудень",
  ];

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Заповнення місяців
  months.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index + 1;
    option.textContent = month;
    if (index === currentMonth) option.selected = true;
    monthSelect.appendChild(option);
  });

  // Заповнення років (±10 років)
  for (let year = currentYear - 10; year <= currentYear + 10; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    if (year === currentYear) option.selected = true;
    yearSelect.appendChild(option);
  }
});
const doctorSelect = document.getElementById("doctorSelect");
// Список лікарів
const doctors = [
  "Дмитриєнко Віталій Вячеславович",
  "Петренко Петро Петрович",
  "Сидоренко Сидір Сидорович",
  "Ковальчук Олена Миколаївна",
];

// Заповнення select
doctors.forEach((doc) => {
  const option = document.createElement("option");
  option.value = doc;
  option.textContent = doc;
  doctorSelect.appendChild(option);
});

// === Завантаження з localStorage ===
const savedDoctor = localStorage.getItem("selectedDoctor");
if (savedDoctor) {
  doctorSelect.value = savedDoctor;
}

// === Збереження при зміні ===
doctorSelect.addEventListener("change", () => {
  localStorage.setItem("selectedDoctor", doctorSelect.value);
});

const tbody = document.getElementById("tableBody");

function getCurrentDate() {
  const now = new Date();
  return (
    `${now.getDate().toString().padStart(2, "0")}.` +
    `${(now.getMonth() + 1).toString().padStart(2, "0")}.` +
    `${now.getFullYear()}`
  );
}

// Оновлює нумерацію рядків
function updateRowNumbers() {
  tbody.querySelectorAll("tr").forEach((row, i) => {
    const numCell = row.querySelector(".col-1");
    if (numCell) numCell.textContent = i + 1;
  });
}

// Зберігає всі рядки у localStorage
function saveAllRows() {
  const rows = tbody.querySelectorAll("tr");
  const dailyData = [];

  rows.forEach((row) => {
    const dateCell = row.querySelector(".col-2");
    const visitsCell = row.querySelector(".col-3"); // 3 колонка для прізвищ

    if (!dateCell) return;

    const col9Select = row.querySelector(".col-9 select");

    dailyData.push({
      date: dateCell.textContent.trim(),
      visits: visitsCell ? visitsCell.textContent.trim() : "",
      diagnosis: col9Select ? col9Select.value : "",
    });
  });

  localStorage.setItem("dailyData", JSON.stringify(dailyData));
}

// Додає новий рядок на основі першого рядка-шаблону
function addNewRow() {
  const templateRow = tbody.querySelector("tr");
  if (!templateRow) return;

  const newRow = templateRow.cloneNode(true);

  newRow.querySelectorAll("td").forEach((td) => {
    if (!td.classList.contains("col-2") && !td.querySelector("select")) {
      td.textContent = "";
    }
    if (td.querySelector("select")) td.querySelector("select").value = "";
  });

  // Встановлюємо дату
  const dateCell = newRow.querySelector(".col-2");
  if (dateCell) dateCell.textContent = getCurrentDate();

  tbody.appendChild(newRow);
  updateRowNumbers();
  makeCellsEditable();
}

// Робимо всі td редагованими (крім select)
function makeCellsEditable() {
  tbody.querySelectorAll("td").forEach((td) => {
    if (!td.querySelector("select")) td.setAttribute("contenteditable", "true");
  });
}

// --------------------------
// Події
// --------------------------
// Мапа балів для select
const pointsMap = {
  Pl: 1,
  "ф.к.": 1,
  рентген: 1,
};
function updateSum(row) {
  const values = [
    row.querySelector(".col-10-1 select")?.value,
    row.querySelector(".col-10-2 select")?.value,
    row.querySelector(".col-10-3 select")?.value,
  ];

  const sum = values.reduce((acc, val) => acc + (pointsMap[val] || 0), 0);

  const sumCell = row.querySelector(".col-14");
  if (sumCell) sumCell.textContent = sum || "";
}
tbody.addEventListener("change", (e) => {
  if (
    e.target.matches(".col-10-1 select, .col-10-2 select, .col-10-3 select")
  ) {
    const row = e.target.closest("tr");
    updateSum(row);
    saveAllRows(); // щоб зберегти вибрані значення
  }
  if (e.target.matches(".col-9 select")) {
    saveAllRows();
  }
});

// Видалення рядка клавішею Delete
tbody.addEventListener("keydown", (e) => {
  if (e.key === "Delete") {
    const row = e.target.closest("tr");
    if (row) {
      row.remove();
      updateRowNumbers();
      saveAllRows();
    }
  }
});

// Додавання нового рядка при заповненні колонки "Відвідування" (col-3)
tbody.addEventListener("keyup", (e) => {
  const cell = e.target;
  const lastRow = tbody.lastElementChild;

  if (
    cell.classList.contains("col-3") &&
    cell.textContent.trim() !== "" &&
    cell.closest("tr") === lastRow
  ) {
    addNewRow();
  }

  saveAllRows();
});

// --------------------------
// Ініціалізація
// --------------------------

function loadRows() {
  const dailyData = JSON.parse(localStorage.getItem("dailyData")) || [];
  const templateRow = tbody.querySelector("tr");

  // Якщо немає даних – залишаємо шаблонний рядок
  if (!templateRow) return;
  tbody.innerHTML = "";

  if (dailyData.length === 0) {
    templateRow.querySelector(".col-2").textContent = getCurrentDate();
    tbody.appendChild(templateRow);
  } else {
    dailyData.forEach((data) => {
      const newRow = templateRow.cloneNode(true);

      newRow.querySelector(".col-2").textContent = data.date;

      const visitsCell = newRow.querySelector(".col-3");

      if (visitsCell) visitsCell.textContent = data.visits || "";

      const col9Select = newRow.querySelector(".col-9 select");
      if (col9Select && data.diagnosis) {
        col9Select.value = data.diagnosis;
      }

      tbody.appendChild(newRow);
    });
  }

  updateRowNumbers();
  makeCellsEditable();
  // updateAllSums();
}

document.getElementById("openSummary").addEventListener("click", () => {
  window.open("summary.html", "_blank");
});

loadRows();
