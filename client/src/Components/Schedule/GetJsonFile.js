import { utils } from "xlsx-color";

export default function GetJsonFile(
  refTable,
  nameTable,
  info,
  wb,
  setWorkBook
) {
  let workSheet = utils.table_to_sheet(refTable.current);
  let jsonData = utils.sheet_to_csv(workSheet);
  console.log(jsonData);
}
