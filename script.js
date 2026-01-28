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

function saveAllRows() {
  const rows = tbody.querySelectorAll("tr");
  const data = [];

  rows.forEach((row) => {
    const rowData = {};

    row.querySelectorAll("td").forEach((td) => {
      const col = td.dataset.col;
      if (!col) return;

      const select = td.querySelector("select");
      rowData[col] = select ? select.value : td.textContent.trim();
    });

    data.push(rowData);
  });

  localStorage.setItem("dailyData", JSON.stringify(data));
}

// Додає новий рядок на основі першого рядка-шаблону
function addNewRow() {
  const rows = tbody.querySelectorAll("tr");
  const lastRow = rows[rows.length - 1];
  if (!lastRow) return;

  const newRow = lastRow.cloneNode(true);

  newRow.querySelectorAll("td").forEach((td) => {
    const col = td.dataset.col;
    const select = td.querySelector("select");

    // 👉 ЦІ КОЛОНКИ ЗБЕРІГАЮТЬ ЗНАЧЕННЯ
    if (["5", "7", "11"].includes(col)) {
      return;
    }

    // ❌ решта — очищаємо
    if (select) {
      select.selectedIndex = 0;
    } else {
      td.textContent = "";
    }
  });

  // дата — нова
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

const procedurePoints = {
  первинний_огляд: 0.5,
  невідкладна_допомога: 1,
  зняття_пломби: 1,
  P_вітально_хірургічно: 1,
  Pt: 1,
  депульповано_зубів: 1,
  PlC: 1,
  PlAm: 1,
  PlCC: 1,
  PlLC: 1,
  зняття_напластувань: 1,
  медикаментозне_лікування_пародонту: 1,
  кюретаж: 1,
  клаптева_операція: 1,
  шинування_зубів: 1,
  лікування_слизової_рота: 1,
  видалення_зуба_карієс: 1,
  видалення_зуба_ортодонт: 1,
  видалення_зуба_фізіол: 1,
  операція_гострі_запальні_процеси: 1,
  операція_пухлини: 1,
  операція_імплантати: 1,
  операція_інші: 1,
  рентген: 1,
  гігієна: 1,
  навчання_догляду: 1,
  професійна_гігієна: 1,
  ремінералізуюча_терапія: 1,
  герметизація_фісур: 1,
};

// Бали за знеболювання (11 колонка)
const anesthesiaPoints = {
  value1: 0, // Без знеболювання
  value2: 0.5, // Місцеве
  value3: 1, // Загальне
};
function updateSum(row) {
  const procedures = [
    row.querySelector(".col-10-1 select")?.value,
    row.querySelector(".col-10-2 select")?.value,
    row.querySelector(".col-10-3 select")?.value,
  ];

  let procedureSum = procedures.reduce(
    (acc, val) => acc + (procedurePoints[val] || 0),
    0,
  );
  const anesthesiaValue = row.querySelector(".col-11 select")?.value;
  let anesthesiaSum = anesthesiaPoints[anesthesiaValue] || 0;

  // загальна сума в колонку 14
  const sumCell = row.querySelector(".col-14");
  if (sumCell) sumCell.textContent = procedureSum + anesthesiaSum || "";
}
tbody.addEventListener("change", (e) => {
  if (
    e.target.matches(
      ".col-10-1 select, .col-10-2 select, .col-10-3 select, .col-11 select",
    )
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
  const data = JSON.parse(localStorage.getItem("dailyData")) || [];

  // беремо шаблон ДО очищення
  const templateRow = tbody.querySelector("tr");
  if (!templateRow) return;

  tbody.innerHTML = "";

  if (data.length === 0) {
    const row = templateRow.cloneNode(true);
    row.querySelector(".col-2").textContent = getCurrentDate();
    tbody.appendChild(row);
  } else {
    data.forEach((rowData) => {
      const newRow = templateRow.cloneNode(true);

      newRow.querySelectorAll("td").forEach((td) => {
        const col = td.dataset.col;
        if (!col || rowData[col] === undefined) return;

        const select = td.querySelector("select");
        if (select) {
          select.value = rowData[col];
        } else {
          td.textContent = rowData[col];
        }
      });

      tbody.appendChild(newRow);
      updateSum(newRow);
    });
  }

  updateRowNumbers();
  makeCellsEditable();
}

tbody.addEventListener("input", saveAllRows);

document.getElementById("openSummary").addEventListener("click", () => {
  window.open("summary.html", "_blank");
});

loadRows();

document.getElementById("printPage").addEventListener("click", () => {
  window.print();
});
