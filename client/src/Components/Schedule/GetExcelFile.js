import { utils, writeFile } from "xlsx-color";
export default function GetExcelFIle(
  refTable,
  nameTable,
  info,
  wb,
  setWorkBook
) {
  if (!wb) {
    let workSheet = utils.table_to_sheet(refTable.current);

    let cols = [{ width: 20, wch: 20 }, { width: 5 }];
    [...Array(info.max_day)].forEach((i) => {
      cols.push({ width: 40, wch: 40 });
    });
    workSheet["!cols"] = cols;
    workSheet["!rows"] = [{ hpt: 40, hpx: 40 }];
    let prevCell = null;
    for (let cell of Object.keys(workSheet).sort()) {
      if (cell === "!ref" || workSheet[cell].length) continue;

      if (prevCell) AddBorder(prevCell, cell, workSheet);
      if (workSheet[cell].t === "z") workSheet[cell].t = "s";

      workSheet[cell].s = {
        font: {
          name: "Times New Roman",
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
        border: {
          top: {
            style: "thin",
            color: { rgb: "000" },
          },
          right: {
            style: "thin",
            color: { rgb: "000" },
          },
          left: {
            style: "thin",
            color: { rgb: "000" },
          },
          bottom: {
            style: "thin",
            color: { rgb: "000" },
          },
        },
      };

      if (cell.match(/^.1$/)) {
        workSheet[cell].s["font"]["sz"] = 16;
        workSheet[cell].s["font"]["bold"] = true;
      } else {
        if (workSheet[cell].v !== "")
          workSheet[cell].s["fill"] = GetBgColor(
            workSheet["!merges"],
            cell,
            workSheet[cell].v
          );

        workSheet[cell].s["font"]["sz"] = 14;
      }
      prevCell = cell;
    }
    let workBook = utils.book_new();
    utils.book_append_sheet(workBook, workSheet, nameTable);
    writeFile(workBook, `${nameTable}.xlsx`);
    console.log("Yes");
    setWorkBook(workBook);
  } else writeFile(wb, `${nameTable}.xlsx`);
}

function AddBorder(cell1, cell2, workSheet) {
  let letter1 = cell1[0];
  let letter2 = cell2[0];
  if (letter1 === letter2) {
    let number1 = cell1.split(letter1)[1];
    let number2 = cell2.split(letter1)[1];
    for (let i = +number1 + 1; i < +number2; i++) {
      let cell = letter1 + i;
      if (!workSheet[cell]) {
        workSheet[cell] = {};
        workSheet[cell].t = "s";
        workSheet[cell].v = "";
        workSheet[cell].s = {
          alignment: {
            wrapText: true,
          },
          border: {
            top: {
              style: "thin",
              color: { rgb: "000" },
            },
            right: {
              style: "thin",
              color: { rgb: "000" },
            },
            left: {
              style: "thin",
              color: { rgb: "000" },
            },
            bottom: {
              style: "thin",
              color: { rgb: "000" },
            },
          },
        };
      }
    }
  } else return;
}

function GetBgColor(arrMerges, cell, value) {
  for (let obj of arrMerges) {
    let mergeS = utils.encode_cell(obj.s);
    if (mergeS === cell) {
      let mergeE = utils.encode_cell(obj.e);
      let letter = mergeS[0];
      if (+mergeE.split(letter)[1] - +mergeS.split(letter)[1] === 1) {
        if (Number.isInteger(+value)) {
          return value % 2 === 0
            ? {
                type: "pattern",
                patternType: "solid",
                fgColor: { rgb: "D6D6D6" },
              }
            : {
                type: "pattern",
                patternType: "solid",
                fgColor: { rgb: "FFFFFF" },
              };
        }

        if (value.split(":").length > 1)
          return {
            type: "pattern",
            patternType: "solid",
            fgColor: { rgb: "FFAD8E" },
          };
        else
          return {
            type: "pattern",
            patternType: "solid",
            fgColor: { rgb: "ABFF84" },
          };
      } else
        return {
          type: "pattern",
          patternType: "solid",
          fgColor: { rgb: "E6CDE8" },
        };
    }
  }
  if (cell.split(cell[0])[1] % 2 === 0)
    return {
      type: "pattern",
      patternType: "solid",
      fgColor: { rgb: "FFEC84" },
    };
  else
    return {
      type: "pattern",
      patternType: "solid",
      fgColor: { rgb: "84ECFF" },
    };
}
