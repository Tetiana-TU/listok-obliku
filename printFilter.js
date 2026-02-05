document.addEventListener("DOMContentLoaded", () => {
  const printBtn = document.getElementById("printBtn");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  // 1️⃣ Відновлюємо дати з localStorage
  const savedStart = localStorage.getItem("summaryStartDate");
  const savedEnd = localStorage.getItem("summaryEndDate");

  if (savedStart) startDateInput.value = savedStart;
  if (savedEnd) endDateInput.value = savedEnd;

  // Відразу будуємо таблицю з збереженим періодом
  buildSummary(savedStart, savedEnd);

  // 2️⃣ Зберігаємо дати при зміні
  [startDateInput, endDateInput].forEach((input) => {
    input.addEventListener("change", () => {
      localStorage.setItem("summaryStartDate", startDateInput.value);
      localStorage.setItem("summaryEndDate", endDateInput.value);

      // Перероблюємо таблицю для нового періоду
      buildSummary(startDateInput.value, endDateInput.value);
    });
  });

  // 3️⃣ Обробка кнопки друку
  printBtn.addEventListener("click", () => {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate || !endDate) {
      alert("Виберіть обидві дати!");
      return;
    }

    // Генеруємо таблицю для вибраного періоду
    buildSummary(startDate, endDate);

    // Викликаємо друк
    window.print();
  });
});
