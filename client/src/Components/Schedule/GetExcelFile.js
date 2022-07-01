import { utils, writeFileXLSX } from "xlsx";
export default function GetExcelFIle(refTable, nameTable) {
  let workSheet = utils.table_to_sheet(refTable.current, { cellStyles: true });
  let workBook = utils.book_new();
  utils.book_append_sheet(workBook, workSheet, nameTable);

  writeFileXLSX(workBook, `${nameTable}.xlsx`, { cellStyles: true });
}
