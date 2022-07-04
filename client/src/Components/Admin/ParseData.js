import { utils } from "xlsx-color";
export default async function ParseData(workSheet) {
  let Data = {};
  let classes = [];
  let arrMergeCells = workSheet["!merges"];
  let colDisc = { l: "B", name: "discipline" };
  let colGroup = { l: "C", name: "groups" };
  let colTypeClass = { l: "D", name: "type_class" };
  let colTimes = { l: "F", name: "times_per_week" };
  let colAud = { l: "I", name: "audiences" };
  let colTeach = { l: "H", name: "teachers" };
  let running = true;
  let flag = false;
  let i = 0;
  let numberRows = 0;
  debugger;
  while (running) {
    if (workSheet[colDisc.l + i])
      if (Number.isInteger(workSheet[colDisc.l + i].v)) {
        flag = true;
        i++;
        continue;
      }
    if (flag) {
      if (workSheet.hasOwnProperty(colDisc.l + i)) {
        numberRows = GetNumberRows(arrMergeCells, colDisc.l + i);
        for (let j = i; j <= i + numberRows; j++) {
          let clas = {};
          clas[colDisc.name] = workSheet[colDisc.l + i].v;
          let groups = workSheet[colGroup.l + j].v
            .split("-")
            .filter((gr) => gr !== "");
          clas[colGroup.name] = groups[1].split(/[,|+|;]/);
          clas["short_name_cathedra"] = groups[0];
          clas[colAud.name] = workSheet[colAud.l + j]
            ? JSON.stringify(workSheet[colAud.l + j].v).split(/[,|.]/)
            : [];
          clas[colTeach.name] = workSheet[colTeach.l + j].v.indexOf("\n")
            ? workSheet[colTeach.l + j].v
                .replace("\n", "")
                .replace(", ", ",")
                .split(/[,]/)
            : [workSheet[colTeach.l + j].v];
          clas[colTypeClass.name] =
            workSheet[colTypeClass.l + j].v === "лекції" ||
            workSheet[colTypeClass.l + j].v === "лк"
              ? 1
              : 2;
          clas[colTimes.name] = +workSheet[colTimes.l + j].v;
          console.log(clas);
          classes.push(clas);
        }
        i += numberRows;
      } else running = false;
    }
    i++;
  }
  Data["classes"] = classes;
  return Data;
}

function GetNumberRows(arrMergeCells, cell) {
  for (let obj of arrMergeCells) {
    if (utils.encode_cell(obj.s) === cell) {
      let cellE = utils.encode_cell(obj.e);
      return cellE.split(cellE[0])[1] - cell.split(cell[0])[1];
    }
  }
  return 0;
}
