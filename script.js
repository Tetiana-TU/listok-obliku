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

function setDateTime(td) {
  const now = new Date();

  const date =
    now.getDate().toString().padStart(2, "0") +
    "." +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    "." +
    now.getFullYear();

  const time =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  td.innerHTML = `${date}<br>${time}`;
}

function setRowNumber(row) {
  row.querySelector(".col-1").textContent = tbody.querySelectorAll("tr").length;
}

function addNewRow() {
  const tr = document.createElement("tr");
  tr.className = "input-row";

  for (let i = 1; i <= 14; i++) {
    const td = document.createElement("td");
    td.contentEditable = true;
    td.className = `col-${i}`;
    td.dataset.col = i;
    tr.appendChild(td);
  }

  tbody.appendChild(tr);
  setRowNumber(tr);
  setTime(tr.querySelector(".col-2"));
  tr.querySelector(".col-3").focus();
}

// ---------- init ----------
const firstRow = tbody.querySelector("tr");
setRowNumber(firstRow);
setDateTime(firstRow.querySelector(".col-2"));

const selectElement = document.getElementById("my-list");

// Додаємо нові елементи
const newOption1 = document.createElement("option");
newOption1.value = "new_value";
selectElement.appendChild(newOption1);

const pointsMap = {
  Pl: 1,
  "ф.к.": 1,
  рентген: 1,
};

// Функція підрахунку сум у колонці 14
function updateSum(row) {
  const values = [
    row.querySelector(".col-10-1 select")?.value,
    row.querySelector(".col-10-2 select")?.value,
    row.querySelector(".col-10-3 select")?.value,
  ];

  const sum = values.reduce((acc, val) => {
    return acc + (pointsMap[val] || 0);
  }, 0);

  row.querySelector(".col-14").textContent = sum || "";
}

// Обробник для select у підколонках 10
["col-10-1", "col-10-2", "col-10-3"].forEach((colClass) => {
  tbody.addEventListener("change", (e) => {
    if (
      !e.target.matches(".col-10-1 select, .col-10-2 select, .col-10-3 select")
    ) {
      return;
    }

    const row = e.target.closest("tr");
    updateSum(row);
  });
});
