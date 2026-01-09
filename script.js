const diagnoses = ["Карієс", "Пульпіт", "Періодонтит", "Профогляд"];

const procedures = {
  Пломба: 800,
  Видалення: 600,
  Чистка: 1200,
  Рентген: 300,
};

const anesthesiaTypes = [
  "Без знеболювання",
  "Аплікаційне",
  "Інфільтраційне",
  "Провідникове",
];

const columnsCount = 8; // кількість активних колонок (без "Сума")

function addRow() {
  const tr = document.createElement("tr");

  tr.innerHTML = `
        <td><input type="date" data-col="0"></td>
        <td><input type="text" data-col="1"></td>
        <td>${createSelect(diagnoses, 2)}</td>
        <td>${createProcedureSelect(3)}</td>
        <td>${createProcedureSelect(4)}</td>
        <td>${createProcedureSelect(5)}</td>
        <td>${createSelect(anesthesiaTypes, 6)}</td>
        <td><input type="number" value="0" data-col="7"></td>
        <td class="sum">0</td>
    `;

  tr.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("keydown", handleKeyNav);
    el.addEventListener("change", () => {
      if (el.tagName === "SELECT") setPrice(el);
      calculateRow(el);
    });
  });

  document.getElementById("tableBody").appendChild(tr);
}

function createSelect(arr, col) {
  let html = `<select data-col="${col}">`;
  html += "<option value=''></option>";
  arr.forEach((v) => (html += `<option value="${v}">${v}</option>`));
  html += "</select>";
  return html;
}

function createProcedureSelect(col) {
  let html = `<select data-col="${col}">`;
  html += "<option value=''></option>";
  for (let p in procedures) {
    html += `<option value="${p}">${p}</option>`;
  }
  html += "</select>";
  return html;
}

function handleKeyNav(e) {
  if (e.key !== "Enter") return;

  e.preventDefault();

  const current = e.target;
  const col = Number(current.dataset.col);
  const row = current.closest("tr");

  let next;

  if (col < columnsCount - 1) {
    next = row.querySelector(`[data-col="${col + 1}"]`);
  } else {
    // кінець рядка → новий рядок
    addRow();
    const rows = document.querySelectorAll("#tableBody tr");
    next = rows[rows.length - 1].querySelector('[data-col="0"]');
  }

  if (next) next.focus();
}

function setPrice(select) {
  if (!procedures[select.value]) return;
  const row = select.closest("tr");
  const priceInput = row.querySelector('[data-col="7"]');
  priceInput.value = procedures[select.value];
}

function calculateRow(el) {
  const row = el.closest("tr");
  const price = Number(row.querySelector('[data-col="7"]').value) || 0;
  row.querySelector(".sum").innerText = price;
  calculateTotals();
}

function calculateTotals() {
  let dayTotal = 0;
  let monthTotal = 0;

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);

  document.querySelectorAll("#tableBody tr").forEach((row) => {
    const date = row.querySelector('[data-col="0"]').value;
    const sum = Number(row.querySelector(".sum").innerText) || 0;

    if (date === today) dayTotal += sum;
    if (date.startsWith(currentMonth)) monthTotal += sum;
  });

  document.getElementById("dayTotal").innerText = dayTotal;
  document.getElementById("monthTotal").innerText = monthTotal;
}

// старт
addRow();
