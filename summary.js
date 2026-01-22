// підставляємо в таблицю
const summaryBody = document.getElementById("summaryBody");
summaryBody.innerHTML = "";

const dailyData = JSON.parse(localStorage.getItem("dailyData")) || {};

// Зведення по датах
const summaryByDate = {};

dailyData.forEach((row) => {
  const date = row["2"]; // колонка ДАТА
  const diagnosis = row["9"]; // колонка ДІАГНОЗ

  if (!date) return;

  if (!summaryByDate[date]) {
    summaryByDate[date] = {
      visits: 0,
      pulpitis: 0,
      periodontitis: 0,
    };
  }

  // кількість відвідувань = кількість рядків
  summaryByDate[date].visits++;

  if (diagnosis === "K04.0") summaryByDate[date].pulpitis++;
  if (diagnosis === "K04.4") summaryByDate[date].periodontitis++;
});

// Вивід у таблицю
Object.entries(summaryByDate).forEach(([date, data]) => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${date}</td>
    <td></td>
    <td>${data.visits}</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>${data.pulpitis}</td>
    <td></td>
    <td>${data.periodontitis}</td>
    ${"<td></td>".repeat(19)}
  `;

  summaryBody.appendChild(tr);
});
