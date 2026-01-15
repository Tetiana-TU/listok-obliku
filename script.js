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

// --------------------------
// Допоміжні функції
// --------------------------

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
    const visitsCell = row.querySelector(".col-3");

    if (!dateCell) return;

    dailyData.push({
      date: dateCell.textContent.trim(),
      visits: visitsCell ? visitsCell.textContent.trim() : "1",
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
tbody.addEventListener("input", (e) => {
  const lastRow = tbody.lastElementChild;

  if (
    e.target.closest("tr") === lastRow &&
    e.target.classList.contains("col-3") &&
    e.target.textContent.trim() !== ""
  ) {
    saveAllRows();
    addNewRow();
  } else {
    saveAllRows();
  }
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
      if (visitsCell) visitsCell.textContent = data.visits || "1";
      tbody.appendChild(newRow);
    });
  }

  updateRowNumbers();
  makeCellsEditable();
  updateAllSums();
}

// --------------------------
// Кнопка "Відкрити зведений лист"
// --------------------------
document.getElementById("openSummary").addEventListener("click", () => {
  window.open("summary.html", "_blank");
});

// --------------------------
// Запуск
// --------------------------
loadRows();
