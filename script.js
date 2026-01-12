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

const groups = ["_", "ДГ", "Ш", "С", "В", "Р", "ДПК", "Д"];

function focusNextCell(currentCell) {
  const allCells = Array.from(
    tbody.querySelectorAll("td[contenteditable='true'], td.selectable")
  );
  const index = allCells.indexOf(currentCell);
  if (index >= 0 && index < allCells.length - 1) {
    allCells[index + 1].focus();
  }
}

// function focusPrevCell(currentCell) {
//   const allCells = Array.from(
//     tbody.querySelectorAll("td[contenteditable='true']")
//   );
//   const index = allCells.indexOf(currentCell);
//   if (index > 0) {
//     allCells[index - 1].focus();
//   }
// }

tbody.addEventListener("keydown", (e) => {
  const target = e.target;
  if (target.tagName.toLowerCase() !== "td") return;

  if (e.key === "Enter") {
    e.preventDefault();
    const allCells = Array.from(
      tbody.querySelectorAll("td[contenteditable='true'], td.selectable")
    );
    const index = allCells.indexOf(target);
    if (index > 0) {
      allCells[index - 1].focus();
    }
    switch (e.key) {
      case "Enter":
        e.preventDefault();

        // Перша колонка — нумерація
        if (target.classList.contains("col-1")) {
          target.textContent = "1";
          focusNextCell(target);
          return;
        }

        // Друга колонка — час
        if (target.classList.contains("col-2")) {
          const now = new Date();
          target.textContent =
            String(now.getHours()).padStart(2, "0") +
            ":" +
            String(now.getMinutes()).padStart(2, "0");
          focusNextCell(target);
          return;
        }

        // Якщо наступна колонка — 8-а, створюємо select автоматично
        const nextCell = (() => {
          const all = Array.from(
            tbody.querySelectorAll("td[contenteditable='true'], td.selectable")
          );
          const idx = all.indexOf(target);
          return idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
        })();

        if (nextCell && nextCell.classList.contains("col-8")) {
          e.preventDefault();
          createGroupSelect(nextCell); // функція створення select
        }

        focusNextCell(target);
        break;

      case "ArrowRight":
        e.preventDefault();
        focusNextCell(target);
        break;

      case "ArrowLeft":
        e.preventDefault();
        focusPrevCell(target);
        break;
    }
  }
});

// --- Функція створення select для 8-ї колонки ---
function createGroupSelect(td) {
  if (td.querySelector("select")) return; // якщо вже є

  td.classList.add("selectable");
  const select = document.createElement("select");
  select.style.width = "100%";

  groups.forEach((q) => {
    const option = document.createElement("option");
    option.value = q;
    option.textContent = q;
    select.appendChild(option);
  });

  select.value = td.textContent.trim() || groups[0];

  td.textContent = "";
  td.appendChild(select);
  select.focus();
  select.size = groups.length; // щоб список відразу був видимий як dropdown

  select.addEventListener("change", () => {
    td.textContent = select.value;
  });

  select.addEventListener("blur", () => {
    td.textContent = select.value;
  });

  select.addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" ||
      event.key === "ArrowRight" ||
      event.key === "Tab"
    ) {
      event.preventDefault();
      td.textContent = select.value || "";
      focusNextCell(td);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      td.textContent = select.value || "";
      focusPrevCell(td);
    }
  });
}

// const diagnoses = ["Карієс", "Пульпіт", "Періодонтит", "Профогляд"];

// const anesthesiaTypes = [
//   "Без знеболювання",
//   "Аплікаційне",
//   "Інфільтраційне",
//   "Провідникове",
// ];
