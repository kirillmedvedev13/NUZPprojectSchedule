import { utils, writeFile } from "xlsx-color";
export default function GetExcelFIle(refTable, nameTable) {
  let workSheet = utils.table_to_sheet(refTable.current, { cellStyles: true });
  workSheet["!cols"] = [{ width: 10, wch: 10 }, { width: 5 }];
  for (let cell in workSheet) {
    if (cell === "!ref" || workSheet[cell].length) continue;
    workSheet[cell].s = {
      font: {
        name: "Times New Roman",
      },
      alignment: {
        vertical: "center",
        horizontal: "center",
        wrapText: true,
      },
    };
    if (cell.match(/^.1$/)) {
      workSheet[cell].s["font"]["sz"] = 16;
      workSheet[cell].s["font"]["bold"] = true;
    } else {
      workSheet[cell].s["font"]["sz"] = 14;
    }
  }
  console.log(workSheet);
  let workBook = utils.book_new();
  utils.book_append_sheet(workBook, workSheet, nameTable);
  writeFile(workBook, `${nameTable}.xlsx`, { cellStyles: true });
}
