document.addEventListener("DOMContentLoaded", () => {
  const printBtn = document.getElementById("printBtn");

  printBtn.addEventListener("click", () => {
    const startDateInput = document.getElementById("startDate").value;
    const endDateInput = document.getElementById("endDate").value;

    if (!startDateInput || !endDateInput) {
      alert("Виберіть обидві дати!");
      return;
    }

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    const rows1 = document.querySelectorAll("#summaryBody1 tr");
    const rows2 = document.querySelectorAll("#summaryBody2 tr");

    // Фільтруємо таблиці
    rows1.forEach((tr, index) => {
      const dateStr = tr.cells[0].innerText;
      const [day, month, year] = dateStr.split(".");
      const rowDate = new Date(`${year}-${month}-${day}`);

      const visible = rowDate >= startDate && rowDate <= endDate;
      tr.style.display = visible ? "" : "none";
      if (rows2[index]) rows2[index].style.display = visible ? "" : "none";
    });

    window.print();

    // Повертаємо всі рядки після друку
    rows1.forEach((tr, index) => {
      tr.style.display = "";
      if (rows2[index]) rows2[index].style.display = "";
    });
  });
});
