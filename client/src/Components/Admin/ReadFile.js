import { CreateNotification } from "../Alert";
import { Workbook } from "exceljs";
import ParseData from "./ParseData";

export default async function ReadFile(file, sheetIndex) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  let promise = new Promise((resolve, reject) => {
    reader.onload = () => {
      const buffer = reader.result;
      const workBook = new Workbook();
      workBook.xlsx
        .load(buffer)
        .then((workbook) => {
          let sheet = workbook.worksheets[sheetIndex];
          let dataRows = [];
          sheet.eachRow((row, rowIndex) => {
            dataRows.push(row.values);
          });
          ParseData(dataRows).then((data) => {
            resolve(data);
          });
        })
        .catch((err) => {
          CreateNotification({
            successful: false,
            message: "Помилка завантаження даних!",
          });
        });
    };
  });
  return await promise;
}
