document.getElementById("monthSelect").addEventListener("change", filterTable);

function filterTable() {
  const selectedMonth = document.getElementById("monthSelect").value;
  const rows = document.querySelectorAll("#tableBody tr");

  rows.forEach((row) => {
    const dateText = row.cells[1].innerText.trim(); // "01.05.2024"
    const parts = dateText.split(".");

    // Перетворюємо рядок "05" на число 5, щоб воно точно співпало з вашим index + 1
    const rowMonth = parseInt(parts[1], 10);
    console.log(dateText);
    if (selectedMonth === "all" || rowMonth.toString() === selectedMonth) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
