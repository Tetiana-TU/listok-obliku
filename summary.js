import { COL } from "./constants.js"; // константи колонок

document.addEventListener("DOMContentLoaded", () => {
  const summaryBody1 = document.getElementById("summaryBody1");
  const summaryBody2 = document.getElementById("summaryBody2");

  summaryBody1.innerHTML = "";
  summaryBody2.innerHTML = "";

  // зчитуємо дані з localStorage
  const dailyData = JSON.parse(localStorage.getItem("dailyData")) || [];

  //   функція для колонки первинних (тепер арабські числа)
  function parsePrimaryColumn(value) {
    if (!value) return { total: 0, rural: 0 };
    const parts = value.split("/").map((v) => parseInt(v) || 0); // формат "1/0"
    return { total: parts[0] || 0, rural: parts[1] || 0 };
  }

  function isPrimary(value) {
    const { total } = parsePrimaryColumn(value);
    return total === 1;
  }

  const groupedByDate = {};

  // групуємо дані за датою
  dailyData.forEach((row) => {
    const date = row["2"];
    if (!date) return;

    if (!groupedByDate[date]) {
      groupedByDate[date] = {
        date,
        visits: 0,
        rural: 0,
        primaryTotal: 0,
        primaryRural: 0,
        primaryChildren: 0,
        emergency: 0,
        groupSum: 0, // 8 колонка
        caries: 0, // K02
        cariesChildren: 0,
        cariesPermanent: 0,
        cariesPermanentChildren: 0,
        cariesTemporary: 0,
        pulpitis: 0,
        pulpitisChildren: 0,
        pulpitisPermanent: 0,
        pulpitisPermanentChildren: 0,
        pulpitisTemporary: 0,
        periodontitis: 0,
        periodontitisChildren: 0,
        periodontitisPermanent: 0,
        periodontitisPermanentChildren: 0,
        periodontitisTemporary: 0,
        anesthesiaLocal: 0,
        anesthesiaGeneral: 0,
        periodontitis: 0,
        periodontitisChildren: 0,
        PlC: 0, // 23 колонка
        PlAm: 0, // 24 колонка
        PlCC: 0, // 25 колонка
        PlLC: 0, // 26 колонка
        uop: 0,
      };
    }

    groupedByDate[date].visits += 1;

    if (row[7] === "село") {
      groupedByDate[date].rural += 1;
    }

    if (isPrimary(row[5])) {
      groupedByDate[date].primaryTotal += 1;

      if (row[7] === "село") {
        groupedByDate[date].primaryRural += 1;
      }
      if (Number(row[COL.AGE]) < 18) {
        groupedByDate[date].primaryChildren += 1;
      }
    }

    if (row["9"] === "НД") groupedByDate[date].emergency += 1;

    const age = Number(row[COL.AGE]);
    const diagnosis = row[COL.DIAGNOSIS];

    if (diagnosis === "K02_Permanent" || diagnosis === "K02")
      groupedByDate[date].cariesPermanent += 1;
    if (diagnosis === "K02_Permanent") {
      groupedByDate[date].cariesPermanent += 1;
      if (age <= 17) groupedByDate[date].cariesPermanentChildren += 1; // <- це саме 10 колонка
    }
    if (diagnosis === "K02_Temporary") {
      groupedByDate[date].cariesTemporary += 1;
      if (age <= 17) groupedByDate[date].cariesChildren += 1; // для тимчасових зубів
    }

    // ПУЛЬПІТ
    if (
      diagnosis === "K04.0_Permanent" ||
      (diagnosis === "K04.0" && age > 17)
    ) {
      groupedByDate[date].pulpitisPermanent += 1;
      if (age <= 17) groupedByDate[date].pulpitisPermanentChildren += 1;
    }
    if (
      diagnosis === "K04.0_Temporary" ||
      (diagnosis === "K04.0" && age <= 17)
    ) {
      groupedByDate[date].pulpitisTemporary += 1;
    }
    if (diagnosis.includes("K04.0") && age <= 17) {
      groupedByDate[date].pulpitisChildren += 1;
    }

    // ПЕРІОДОНТИТ
    if (
      diagnosis === "K04.4_Permanent" ||
      (diagnosis === "K04.4" && age > 17)
    ) {
      groupedByDate[date].periodontitisPermanent += 1;
      if (age <= 17) groupedByDate[date].periodontitisPermanentChildren += 1;
    }
    if (
      diagnosis === "K04.4_Temporary" ||
      (diagnosis === "K04.4" && age <= 17)
    ) {
      groupedByDate[date].periodontitisTemporary += 1;
    }
    if (diagnosis.includes("K04.4") && age <= 17) {
      groupedByDate[date].periodontitisChildren += 1;
    }

    // ЗНЕБОЛЮВАННЯ
    const anesthesia = row[11];
    if (anesthesia === "value2") groupedByDate[date].anesthesiaLocal += 1;
    if (anesthesia === "value3") groupedByDate[date].anesthesiaGeneral += 1;

    const uop = parseFloat(row["14"]);
    if (!isNaN(uop)) groupedByDate[date].uop += uop;

    const fillingsColumns = ["10-1", "10-2", "10-3"];
    fillingsColumns.forEach((col) => {
      const filling = row[col];
      if (!filling) return;

      if (filling === "PlC") groupedByDate[date].PlC += 1;
      if (filling === "PlAm") groupedByDate[date].PlAm += 1;
      if (filling === "PlCC") groupedByDate[date].PlCC += 1;
      if (filling === "PlLC") groupedByDate[date].PlLC += 1;
    });

    groupedByDate[date].groupSum =
      groupedByDate[date].cariesPermanent +
      groupedByDate[date].cariesTemporary +
      groupedByDate[date].pulpitisPermanent +
      groupedByDate[date].pulpitisTemporary +
      groupedByDate[date].periodontitisPermanent +
      groupedByDate[date].periodontitisTemporary;
  });

  const sortedDays = Object.values(groupedByDate).sort((a, b) => {
    const [da, ma, ya] = a.date.split(".");
    const [db, mb, yb] = b.date.split(".");
    return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
  });

  sortedDays.forEach((day) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${day.date}</td>                             <!--1-->
        <td></td>                                        <!--2-->
        <td>${day.visits}</td>                           <!--3-->
        <td>${day.rural}</td>                            <!--4--> 
        <td>${day.primaryTotal}/${day.primaryRural}</td> <!--5-->
        <td>${day.primaryChildren}</td>                  <!--6--> 
        <td>${day.emergency}</td>                        <!--7--> 
        <td>${day.groupSum}</td>     <!--8 колонка: сума 9,11,12,14,16,17-->
        <td>${day.cariesPermanent}</td>                 <!--9-->
        <td>${day.cariesPermanentChildren}</td>         <!--10-->
        <td>${day.cariesTemporary}</td>                 <!--11-->  
        <td>${day.pulpitisPermanent}</td>
        <td>${day.pulpitisPermanentChildren}</td>
        <td>${day.periodontitisPermanent}</td>
        <td>${day.periodontitisPermanentChildren}</td>
        <td>${day.pulpitisTemporary}</td>
        <td>${day.periodontitisTemporary}</td>
       ${"<td></td>".repeat(5)}
       <td>${day.PlC}</td>
        <td>${day.PlAm}</td>
        <td>${day.PlCC}</td>
        <td>${day.PlLC}</td>
        <td>${day.anesthesiaLocal}/${day.anesthesiaGeneral}</td>
       ${"<td></td>".repeat(9)}
        
      `;
    summaryBody1.appendChild(tr);
  });
  sortedDays.forEach((day) => {
    const tr2 = document.createElement("tr");
    tr2.innerHTML = `
     ${"<td></td>".repeat(25)}
      <td>${day.uop.toFixed(1)}</td>
    `;
    summaryBody2.appendChild(tr2);
  });
});
