import { CreateNotification } from "../Alert";
import { Workbook } from "exceljs";
import XLSX from "xlsx-color";
import ParseData from "./ParseData";

export default async function ReadFile(file, sheetIndex) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  let promise = new Promise((resolve, reject) => {
    try {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        let workBook = XLSX.read(data, { type: "array" });
        let workSheet = workBook.Sheets[workBook.SheetNames[sheetIndex]];
        ParseData(workSheet).then((data) => {
          resolve(data);
        });
      };
    } catch (err) {
      CreateNotification({
        successful: false,
        message: "Помилка завантаження даних!",
      });
    }
  });
  return await promise;
}
