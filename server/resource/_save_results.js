import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

async function Run() {
  let array_results = ["EA", "IM", "SA", "TS"];
  for (let i = 0; i < array_results.length; i++) {
    array_results[i] = path.resolve(`./_results_${array_results[i]}/`);
  }
  let pathToExcel = path.resolve("./Tests.xlsx");

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(pathToExcel);

  for (let i = 0; i < array_results.length; i++) {
    let worksheet = workbook.getWorksheet(i + 1);
    let calls = [];
    switch (i) {
      case 0:
        calls = ["N", "O", "P", "Q"];
        break;
      case 1:
        calls = ["R", "S", "T", "U"];
        break;
      case 2:
        calls = ["I", "J", "K", "L"];
        break;
      case 3:
        calls = ["J", "K", "L", "M"];
        break;
    }

    let contentDir = fs.readdirSync(array_results[i]);
    contentDir.forEach((file) => {
      let data = fs.readFileSync(path.resolve(array_results[i] + "/" + file));
      data = JSON.parse(data);

      let digits = file.match(/\d+/g);
      let number = +digits[0];
      number = number + Math.ceil(number / 3);

      worksheet.getCell(`${calls[0]}${number}`).value =
        data.result[0][0] / 1000;
      worksheet.getCell(`${calls[2]}${number}`).value = data.result[0][1];

      worksheet.getCell(`${calls[1]}${number}`).value =
        data.result[data.result.length - 1][0] / 1000;
      worksheet.getCell(`${calls[3]}${number}`).value =
        data.result[data.result.length - 1][1];
    });
  }
  await workbook.xlsx.writeFile(pathToExcel);
  console.log("Excel file edited!");
}

try {
  await Run();
} catch (err) {
  console.log(err);
}
