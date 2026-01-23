import { COL } from "./constants.js"; // твої константи колонок

// DOM елементи
const summaryBody = document.getElementById("summaryBody");
summaryBody.innerHTML = "";

const dailyData = JSON.parse(localStorage.getItem("dailyData")) || [];
console.log(dailyData);
// Подія на кнопку "Відкрити зведений лист"
// openSummaryBtn.addEventListener("click", () => {
//   const rows = tableBody.querySelectorAll(".input-row"); // всі рядки введення
//   const data = [];

//   rows.forEach((row) => {
//     const cells = row.querySelectorAll("td");

//     // Створюємо об'єкт для зберігання даних
//     const rowData = {
//       [COL.DATE]: cells[0].innerText.trim(), // Номер п/п або дату можна ставити сюди
//       [COL.AGE]: Number(cells[3].innerText.trim()) || 0,
//       [COL.VISIT_TYPE]: cells[4].querySelector("select")?.value || "",
//       [COL.IS_RURAL]: cells[6].querySelector("select")?.value || "",
//       [COL.DIAGNOSIS]: cells[8].querySelector("select")?.value || "",
//     };

//     data.push(rowData);
//   });

//   // Зберігаємо у localStorage
//   localStorage.setItem("DailyData", JSON.stringify(data));

//   // Створюємо зведення
//   renderSummary();
// });

// // Функція для створення пустого рядка зведення
// function createEmptySummaryRow() {
//   return {
//     visits: 0,
//     ruralVisits: 0,
//     primaryVisits: 0,
//     primaryRural: 0,
//     childrenVisits: 0,
//     emergency: 0,
//     pulpitis: 0,
//     pulpitisChildren: 0,
//     periodontitis: 0,
//     periodontitisChildren: 0,
//     depulpNoCaries: 0,
//     materials: { cement: 0, amalgam: 0, chemical: 0, light: 0 },
//     anestheticLocal: 0,
//     anestheticGeneral: 0,
//     uop: 0,
//   };
// }

// // Функція для підсумування даних
// function buildSummary(DailyData) {
//   const summaryByDate = {};

//   DailyData.forEach((row) => {
//     const date = row[COL.DATE] || "Без дати"; // якщо дата не введена
//     if (!summaryByDate[date]) {
//       summaryByDate[date] = createEmptySummaryRow();
//     }
//     const s = summaryByDate[date];

//     const diagnosis = row[COL.DIAGNOSIS];
//     const isChild = Number(row[COL.AGE]) < 18;
//     const isRural = row[COL.IS_RURAL] === "с"; // або "c" залежно від select

//     s.visits++;
//     if (isRural) s.ruralVisits++;

//     if (diagnosis === "K04.0") {
//       s.pulpitis++;
//       if (isChild) s.pulpitisChildren++;
//     }

//     if (diagnosis === "K04.4") {
//       s.periodontitis++;
//       if (isChild) s.periodontitisChildren++;
//     }

//     if (row[COL.VISIT_TYPE] === "I") {
//       s.primaryVisits++;
//       if (isRural) s.primaryRural++;
//     }

//     if (diagnosis === "НД") {
//       s.emergency++;
//     }
//   });

//   return summaryByDate;
// }

// // Відображення зведеної таблиці
// // function renderSummary() {
// //   summaryBody.innerHTML = "";

// //   const data = JSON.parse(localStorage.getItem("DailyData")) || [];
// //   const summary = buildSummary(data);

// Object.entries(summary).forEach(([date, s]) => {
//   const tr = document.createElement("tr");

//   tr.innerHTML = `
//       <td>${date}</td>
//       <td></td>
//       <td>${s.visits}</td>
//       <td>${s.ruralVisits}</td>
//       <td>${s.primaryVisits}/${s.primaryRural}</td>
//       <td>${s.childrenVisits || ""}</td>
//       <td>${s.emergency || ""}</td>
//       <td></td>
//       <td></td>
//       <td></td>
//       <td></td>
//       <td>${s.pulpitis}</td>
//       <td>${s.pulpitisChildren}</td>
//       <td>${s.periodontitis}</td>
//       <td>${s.periodontitisChildren}</td>
//       ${"<td></td>".repeat(47)}
//       <td>${s.uop}</td>
//     `;

//   summaryBody.appendChild(tr);
// });

// // Якщо дані вже в localStorage, автоматично показуємо їх при завантаженні
// document.addEventListener("DOMContentLoaded", () => {
//   renderSummary();
// });
