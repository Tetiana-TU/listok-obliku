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
      pulpitis: 0,
      periodontitis: 0,
    };
  }

  summaryByDate[row.date].visits++;

  if (row.diagnosis === "K04.0") {
    summaryByDate[row.date].pulpitis++;
  }
  if (row.diagnosis === "K04.4") {
    summaryByDate[row.date].periodontitis++;
  }
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
