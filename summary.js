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
  function isValidVisit(row) {
    return row["3"] && row["3"].trim() !== "";
  }
  // групуємо дані за датою
  dailyData.forEach((row) => {
    if (!isValidVisit(row)) return;

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
        periodontitisPermanent: 0,
        periodontitisPermanentChildren: 0,
        periodontitisTemporary: 0,
        P_vitalTotal: 0, // 18 колонка
        P_vitalChildren: 0,
        PtTotal: 0, // 20 колонка
        PtChildren: 0,
        depulped: 0,
        naplast: 0,
        anesthesiaLocal: 0,
        anesthesiaGeneral: 0,
        periodontitis: 0,
        periodontitisChildren: 0,
        PlC: 0, // 23 колонка
        PlAm: 0, // 24 колонка
        PlCC: 0, // 25 колонка
        PlLC: 0, // 26 колонка
        medlikparodont: 0, // 31 колонка
        kuretazh: 0, // 32 колонка
        klapteva: 0, // 33 колонка
        shinuvanya: 0,
        mucosaTreatment: 0,
        mucosaTreatmentChildren: 0,
        column28Sum: 0,
        column28ChildrenSum: 0,
        ToothExtractionCaries: 0,
        ToothExtractionCariesChildren: 0,
        ExtractionParodont: 0,
        ExtractionOrthodonticChildren: 0,
        ExtractionphysiologyChildren: 0,
        OperatioInflammatoryProcesses: 0,
        OperatioTumors: 0,
        OperatioImplants: 0,
        OperatioOthers: 0,
        sanatioPlanova: 0,
        sanatioPlanovaChildren: 0,
        HygieneEducation: 0,
        OralCare: 0,
        ProfessionalOralHygiene: 0,
        RemineralizationTherapy: 0,
        PitAndFissureSealing: 0,
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

    const age = Number(row[COL.AGE]);
    const diagnosis = [row["9-1"], row["9-2"]].filter(Boolean);

    diagnosis.forEach((diagnosis) => {
      if (diagnosis === "K02_Permanent") {
        groupedByDate[date].cariesPermanent += 1;
        if (age <= 17) groupedByDate[date].cariesPermanentChildren += 1;
      }

      if (diagnosis === "K02_Temporary") {
        groupedByDate[date].cariesTemporary += 1;
        if (age <= 17) groupedByDate[date].cariesChildren += 1;
      }
    });

    // ПУЛЬПІТ
    diagnosis.forEach((diagnosis) => {
      if (diagnosis === "K04.0_Permanent") {
        groupedByDate[date].pulpitisPermanent += 1;
        if (age <= 17) groupedByDate[date].pulpitisPermanentChildren += 1;
      }

      if (diagnosis === "K04.0_Temporary") {
        groupedByDate[date].pulpitisTemporary += 1;
      }

      if (diagnosis?.includes("K04.0") && age <= 17) {
        groupedByDate[date].pulpitisChildren += 1;
      }
    });

    // ПЕРІОДОНТИТ
    diagnosis.forEach((diagnosis) => {
      if (diagnosis === "K04.4_Permanent") {
        groupedByDate[date].periodontitisPermanent += 1;
        if (age <= 17) groupedByDate[date].periodontitisPermanentChildren += 1;
      }

      if (diagnosis === "K04.4_Temporary") {
        groupedByDate[date].periodontitisTemporary += 1;
      }

      if (diagnosis?.includes("K04.4") && age <= 17) {
        groupedByDate[date].periodontitisChildren += 1;
      }
    });

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
    const procedureColumns = ["10-1", "10-2", "10-3"];

    procedureColumns.forEach((col) => {
      const procedure = row[col];

      const isChild = age <= 17;
      if (!procedure) return;

      if (procedure === "невідкладна_допомога") {
        groupedByDate[date].emergency += 1;
      }

      // P_вітально_хірургічно
      if (procedure === "P_вітально_хірургічно") {
        groupedByDate[date].P_vitalTotal += 1;
        if (age <= 17) groupedByDate[date].P_vitalChildren += 1;
      }

      // Pt
      if (procedure === "Pt") {
        groupedByDate[date].PtTotal += 1;
        if (age <= 17) groupedByDate[date].PtChildren += 1;
      }
      if (procedure === "депульповано_зубів") {
        groupedByDate[date].depulped += 1;
      }
      if (procedure === "зняття_напластувань") {
        groupedByDate[date].naplast += 1;
      }
      if (procedure === "медикаментозне_лікування_пародонту") {
        groupedByDate[date].medlikparodont += 1;
      }
      if (procedure === "кюретаж") {
        groupedByDate[date].kuretazh += 1;
      }
      if (procedure === "клаптева_операція") {
        groupedByDate[date].klapteva += 1;
      }
      if (procedure === "шинування_зубів") {
        groupedByDate[date].shinuvanya += 1;
      }

      if (procedure === "сановано") {
        groupedByDate[date].sanatioPlanova += 1;
        if (age <= 17) groupedByDate[date].sanatioPlanovaChildren += 1;
      }

      if (procedure === "лікування_слизової_рота") {
        groupedByDate[date].mucosaTreatment += 1;
        if (age <= 17) groupedByDate[date].mucosaTreatmentChildren += 1;
      }

      if (procedure === "видалення_зуба_карієс") {
        groupedByDate[date].ToothExtractionCaries += 1;
        if (age <= 17) groupedByDate[date].ToothExtractionCariesChildren += 1;
      }
      if (procedure === "видалення_зуба_пародонт") {
        groupedByDate[date].ExtractionParodont += 1;
      }
      if (procedure === "видалення_зуба_ортодонт") {
        if (age <= 17) groupedByDate[date].ExtractionOrthodonticChildren += 1;
      }
      if (procedure === "видалення_зуба_фізіол") {
        if (age <= 17) groupedByDate[date].ExtractionphysiologyChildren += 1;
      }

      if (procedure === "операція_гострі_запальні_процеси") {
        groupedByDate[date].OperatioInflammatoryProcesses += 1;
      }

      if (procedure === "операція_пухлини") {
        groupedByDate[date].OperatioTumors += 1;
      }

      if (procedure === "операція_імплантати") {
        groupedByDate[date].OperatioImplants += 1;
      }

      if (procedure === "операція_інші") {
        groupedByDate[date].OperatioOthers += 1;
      }
      if (procedure === "гігієна") {
        groupedByDate[date].HygieneEducation += 1;
      }
      if (procedure === "навчання_догляду") {
        groupedByDate[date].OralCare += 1;
      }
      if (procedure === "професійна_гігієна") {
        groupedByDate[date].ProfessionalOralHygiene += 1;
      }

      if (procedure === "ремінералізуюча_терапія") {
        groupedByDate[date].RemineralizationTherapy += 1;
      }
      if (procedure === "герметизація_фісур") {
        groupedByDate[date].PitAndFissureSealing += 1;
      }

      if (isChild) {
        if (
          procedure === "зняття_напластувань" ||
          procedure === "медикаментозне_лікування_пародонту" ||
          procedure === "кюретаж" ||
          procedure === "клаптева_операція" ||
          procedure === "шинування_зубів" ||
          procedure === "лікування_слизової_рота"
        ) {
          groupedByDate[date].column28ChildrenSum += 1;
        }
      }
    });
    groupedByDate[date].groupSum =
      groupedByDate[date].cariesPermanent +
      groupedByDate[date].cariesTemporary +
      groupedByDate[date].pulpitisPermanent +
      groupedByDate[date].pulpitisTemporary +
      groupedByDate[date].periodontitisPermanent +
      groupedByDate[date].periodontitisTemporary;

    groupedByDate[date].column28Sum =
      groupedByDate[date].naplast +
      groupedByDate[date].medlikparodont +
      groupedByDate[date].kuretazh +
      groupedByDate[date].klapteva +
      groupedByDate[date].shinuvanya +
      groupedByDate[date].mucosaTreatment;
  });

  const sortedDays = Object.values(groupedByDate).sort((a, b) => {
    const [da, ma, ya] = a.date.split(".");
    const [db, mb, yb] = b.date.split(".");
    return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
  });
  const monthTotal = {};

  sortedDays.forEach((day) => {
    Object.keys(day).forEach((key) => {
      if (typeof day[key] === "number") {
        monthTotal[key] = (monthTotal[key] || 0) + day[key];
      }
    });
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
        <td>${day.pulpitisPermanent}</td>               <!--12-->
        <td>${day.pulpitisPermanentChildren}</td>        <!--13--> 
        <td>${day.periodontitisPermanent}</td>           <!--14-->
        <td>${day.periodontitisPermanentChildren}</td>  <!--15-->
        <td>${day.pulpitisTemporary}</td>                <!--16-->
        <td>${day.periodontitisTemporary}</td>           <!--17-->
        <td>${day.P_vitalTotal}</td>                     <!--18-->
        <td>${day.P_vitalChildren}</td>                  <!--19-->
        <td>${day.PtTotal}</td>                          <!--20-->
        <td>${day.PtChildren}</td>                      <!--21-->
        <td>${day.depulped}</td>                           <!--22-->
        <td>${day.PlC}</td>                              <!--23-->
        <td>${day.PlAm}</td>                             <!--24-->
        <td>${day.PlCC}</td>                            <!--25-->
        <td>${day.PlLC}</td>                               <!--26--> 
        <td>${day.anesthesiaLocal}/${day.anesthesiaGeneral}</td> <!--27-->
        <td>${day.column28Sum}</td>                     <!-- 28 колонка -->
        <td>${day.column28ChildrenSum}</td> <!--29 колонка: сума процедур для дітей до 17 років-->
        <td>${day.naplast}</td>                              <!--30--> 
        <td>${day.medlikparodont}</td>                        <!--31-->
        <td>${day.kuretazh}</td>                             <!--32-->
        <td>${day.klapteva}</td>                             <!--33-->
        <td>${day.shinuvanya}</td>                           <!--34-->
        <td>${day.mucosaTreatment}</td>                      <!--35-->
        <td>${day.mucosaTreatmentChildren}</td>             <!--36-->
        `;
    summaryBody1.appendChild(tr);
  });
  console.log("Дані для підсумку:", monthTotal);
  // Рядок "Всього" для summaryBody1
  const totalTr1 = document.createElement("tr");

  totalTr1.style.fontWeight = "bold";
  totalTr1.innerHTML = `
  <td>Всього</td>                                    <!--1: дата-->
  <td></td>                                          <!--2-->
  <td>${monthTotal.visits}</td>                     <!--3-->
  <td>${monthTotal.rural}</td>                       <!--4-->
  <td>${monthTotal.primaryTotal}/${monthTotal.primaryRural}</td> <!--5-->
  <td>${monthTotal.primaryChildren}</td>            <!--6-->
  <td>${monthTotal.emergency}</td>                  <!--7-->
  <td>${monthTotal.groupSum}</td>                   <!--8-->
  <td>${monthTotal.cariesPermanent}</td>            <!--9-->
  <td>${monthTotal.cariesPermanentChildren}</td>    <!--10-->
  <td>${monthTotal.cariesTemporary}</td>            <!--11-->  
  <td>${monthTotal.pulpitisPermanent}</td>          <!--12-->
  <td>${monthTotal.pulpitisPermanentChildren}</td>  <!--13--> 
  <td>${monthTotal.periodontitisPermanent}</td>     <!--14-->
  <td>${monthTotal.periodontitisPermanentChildren}</td> <!--15-->
  <td>${monthTotal.pulpitisTemporary}</td>          <!--16-->
  <td>${monthTotal.periodontitisTemporary}</td>     <!--17-->
  <td>${monthTotal.P_vitalTotal}</td>               <!--18-->
  <td>${monthTotal.P_vitalChildren}</td>            <!--19-->
  <td>${monthTotal.PtTotal}</td>                    <!--20-->
  <td>${monthTotal.PtChildren}</td>                 <!--21-->
  <td>${monthTotal.depulped}</td>                   <!--22-->
  <td>${monthTotal.PlC}</td>                        <!--23-->
  <td>${monthTotal.PlAm}</td>                       <!--24-->
  <td>${monthTotal.PlCC}</td>                       <!--25-->
  <td>${monthTotal.PlLC}</td>                       <!--26--> 
  <td>${monthTotal.anesthesiaLocal}/${monthTotal.anesthesiaGeneral}</td> <!--27-->
  <td>${monthTotal.column28Sum}</td>                <!--28-->
  <td>${monthTotal.column28ChildrenSum}</td>        <!--29-->
  <td>${monthTotal.naplast}</td>                    <!--30--> 
  <td>${monthTotal.medlikparodont}</td>             <!--31-->
  <td>${monthTotal.kuretazh}</td>                   <!--32-->
  <td>${monthTotal.klapteva}</td>                   <!--33-->
  <td>${monthTotal.shinuvanya}</td>                 <!--34-->
  <td>${monthTotal.mucosaTreatment}</td>            <!--35-->
  <td>${monthTotal.mucosaTreatmentChildren}</td>    <!--36-->
`;
  summaryBody1.appendChild(totalTr1);

  sortedDays.forEach((day) => {
    const tr2 = document.createElement("tr");
    tr2.innerHTML = `
    <td></td>                                            <!--37-->
     <td>${day.ToothExtractionCaries}</td>               <!--38-->
     <td>${day.ExtractionParodont}</td>                  <!--39-->
     <td>${day.ToothExtractionCariesChildren}</td>       <!--40-->
     <td>${day.ExtractionOrthodonticChildren}</td>        <!--41-->
     <td></td>                                            <!--42-->
     <td>${day.ExtractionphysiologyChildren}</td>        <!--43-->
      <td></td>                                          <!--44-->
     <td>${day.OperatioInflammatoryProcesses}</td>        <!--45-->
     <td>${day.OperatioTumors}</td>                         </--46-->
     <td>${day.OperatioImplants}</td>                     </--47-->
     <td>${day.OperatioOthers}</td>                       </--48-->
     <td>${day.sanatioPlanova + day.sanatioPlanovaChildren}</td> </--49-->
     <td></td>                                           </--50-->
     <td></td>                                            <!--51-->
     <td></td>                                           <!--52-->
     <td>${day.sanatioPlanova}</td>                       <!--53-->
     <td></td>                                             <!--54-->
     <td></td>                                            <!--55-->
     <td>${day.sanatioPlanovaChildren}</td>               <!--56-->  
     <td>${day.HygieneEducation}</td>                     <!--57-->
     <td>${day.OralCare}</td>                             <!--58-->
     <td>${day.ProfessionalOralHygiene}</td>             <!--59-->
     <td>${day.RemineralizationTherapy}</td>              <!--60-->
     <td>${day.PitAndFissureSealing}</td>                 <!--61-->
      <td>${day.uop.toFixed(1)}</td>                     <!--62-->
    `;
    summaryBody2.appendChild(tr2);
  });
  // Рядок "Всього" для summaryBody2
  const totalTr2 = document.createElement("tr");
  totalTr2.style.fontWeight = "bold";
  totalTr2.innerHTML = `
  <td>Всього</td>                                     <!--37-->
  <td>${monthTotal.ToothExtractionCaries}</td>        <!--38-->
  <td>${monthTotal.ExtractionParodont}</td>           <!--39-->
  <td>${monthTotal.ToothExtractionCariesChildren}</td> <!--40-->
  <td>${monthTotal.ExtractionOrthodonticChildren}</td> <!--41-->
  <td></td>                                           <!--42-->
  <td>${monthTotal.ExtractionphysiologyChildren}</td> <!--43-->
  <td></td>                                           <!--44-->
  <td>${monthTotal.OperatioInflammatoryProcesses}</td> <!--45-->
  <td>${monthTotal.OperatioTumors}</td>               <!--46-->
  <td>${monthTotal.OperatioImplants}</td>             <!--47-->
  <td>${monthTotal.OperatioOthers}</td>               <!--48-->
  <td>${monthTotal.sanatioPlanova + monthTotal.sanatioPlanovaChildren}</td> <!--49-->
  <td></td>                                          <!--50-->
  <td></td>                                          <!--51-->
  <td></td>                                          <!--52-->
  <td>${monthTotal.sanatioPlanova}</td>              <!--53-->
  <td></td>                                           <!--54-->
  <td></td>                                          <!--55-->
  <td>${monthTotal.sanatioPlanovaChildren}</td>     <!--56-->  
  <td>${monthTotal.HygieneEducation}</td>           <!--57-->
  <td>${monthTotal.OralCare}</td>                   <!--58-->
  <td>${monthTotal.ProfessionalOralHygiene}</td>   <!--59-->
  <td>${monthTotal.RemineralizationTherapy}</td>    <!--60-->
  <td>${monthTotal.PitAndFissureSealing}</td>       <!--61-->
  <td>${monthTotal.uop.toFixed(1)}</td>             <!--62-->
`;
  summaryBody2.appendChild(totalTr2);
});
