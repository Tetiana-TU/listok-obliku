// підставляємо в таблицю
const summaryBody = document.getElementById("summaryBody");
summaryBody.innerHTML = "";
const dailyData = JSON.parse(localStorage.getItem("dailyData")) || [];

// Зведення по датах
const summaryByDate = {};

dailyData.forEach((row) => {
  if (!row.date) return;

  if (!summaryByDate[row.date]) {
    summaryByDate[row.date] = {
      visits: 0,
    };
  }

  summaryByDate[row.date].visits += 1;
});

// Вивід у таблицю
Object.entries(summaryByDate).forEach(([date, data]) => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${date}</td>          <!-- (1) Дата -->
    <td></td>                 <!-- (2) Години НЕ рахуються -->
    <td>${data.visits}</td>   <!-- (3) Кількість відвідувань -->
    ${"<td></td>".repeat(30)} <!-- (4–33) -->
  `;

  summaryBody.appendChild(tr);
});
