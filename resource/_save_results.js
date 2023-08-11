import ExcelJS from "exceljs";
import path, { join } from "path";
import fs from "fs";

async function Run() {
  let pathToResults = path.resolve("./RESULTS");
  let pathToExcel = path.resolve("./Tests.xlsx");

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(pathToExcel);

  let worksheet = workbook.getWorksheet(4);
  let calls = ['J', 'K', 'L', 'M'];

  let contentDir = fs.readdirSync(pathToResults);
  contentDir.forEach((file) => {
    let data = fs.readFileSync(join(pathToResults, "\\",file))
    data = JSON.parse(data);

    let digits = file.match(/\d+/g);
    let i = +digits[0];
    i = i + Math.ceil(i/3);

    worksheet.getCell(`${calls[0]}${i}`).value = data.result[0][0] / 1000;
    worksheet.getCell(`${calls[2]}${i}`).value = data.result[0][1];

    worksheet.getCell(`${calls[1]}${i}`).value = data.result[data.result.length-1][0] / 1000;
    worksheet.getCell(`${calls[3]}${i}`).value = data.result[data.result.length-1][1];
  });

  await workbook.xlsx.writeFile(pathToExcel);
  console.log("Excel file edited!");
}

try {
  await Run();
} catch (err) {
  console.log(err);
}
