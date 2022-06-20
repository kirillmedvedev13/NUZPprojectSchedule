export default async function ParseData(sheet) {
  let Data = {};
  let classes = [];
  let columnKey = {};
  let counter = 1;
  let firstRow = false; //Что бы пропускать первую строку с счётчиком
  for (let i = 0; i < sheet.length; i++) {
    // Проход по строкам
    let lesson = {};

    if (sheet[i][1] === "№\nз/п") {
      columnKey = GetColumKey(sheet[i]);
    }
    let indexRow =
      sheet[i][1] && sheet[i][1].hasOwnProperty("result")
        ? sheet[i][1].result
        : sheet[i][1];
    if (indexRow === counter || indexRow === counter + 1) {
      // Если номер записи равен счётчику
      if (indexRow === counter + 1) {
        counter++;
      }
      if (!firstRow) {
        firstRow = true;
        continue;
      }
      const checkLesson = CompareClasses(sheet[i - 1], sheet[i]);
      if (!checkLesson) {
        // если пред строка не равна текущей
        for (let j = 1; j <= 12; j++) {
          let key = columnKey[j] ? columnKey[j] : null;
          if (
            key === "audiences" &&
            !sheet[i][j] &&
            !lesson.hasOwnProperty("audiences")
          ) {
            lesson[key] = [];
          }
          if (key && sheet[i][j]) {
            switch (key) {
              case "groups":
                let groups = sheet[i][j].split("-");
                lesson[key] = groups[1].split(/[,|+|;]/);
                lesson["short_name_cathedra"] = groups[0];
                break;
              case "audiences":
                let aud = String(sheet[i][j]);
                lesson[key] = aud.indexOf(".") ? aud.split(".") : aud;
                break;
              case "type_class":
                if (sheet[i][j] === "лекції" || sheet[i][j] === "лк")
                  lesson[key] = 1;
                else lesson[key] = 2;
                break;
              case "teachers":
                let temp = [];
                let teach = String(sheet[i][j]);
                teach = teach.indexOf("\n") ? teach.replace("\n", "") : teach;
                temp.push(teach);
                lesson[key] = temp;
                break;
              case "discipline":
                let disc = String(sheet[i][j]);
                lesson[key] = disc.indexOf("\n")
                  ? disc.replace("\n", "")
                  : disc;
                break;
              default:
                lesson[key] = sheet[i][j];
                break;
            }
          }
        }
        /*console.log(
            encodeURIComponent(lesson.short_name_cathedra),
            " ",
            lesson.short_name_cathedra
          );
          console.log(lesson.short_name_cathedra == "КНТ");*/
        classes.push(lesson);
      } else {
        // если пред строка равна текущей
        let prev = classes[classes.length - 1];
        let teach = sheet[i][GetKey(columnKey, "teachers")];
        prev.teachers.push(teach);
        let auds = [];
        auds.push(String(sheet[i][GetKey(columnKey, "audiences")]));
        auds.push(String(prev.audiences));
        prev.audiences = auds;
        classes[classes.length - 1] = prev;
      }
    }
  }
  Data["classes"] = classes;
  return JSON.stringify(Data);
}

function CompareClasses(prev, current) {
  if (
    prev[2] === current[2] &&
    prev[3] === current[3] &&
    prev[4] === current[4]
  )
    return true;
  else return false;
}

function GetColumKey(row) {
  let columnKey = {};
  for (let j = 1; j <= 12; j++) {
    if (row[j]) {
      switch (j) {
        case 2:
          columnKey[j] = "discipline";
          break;
        case 3:
          columnKey[j] = "groups";
          break;
        case 4:
          columnKey[j] = "type_class";

          break;
        case 5:
          if (row[j] === "Кількість годин на тиждень за видом занять")
            columnKey[j] = "times_per_week";
          else columnKey[j] = "audiences";
          break;
        case 6:
          if (
            row[j] ===
            "Пропозиції кафедри щодо № аудиторії для проведення  даного виду навчальних занять"
          )
            columnKey[j] = "audiences";
          break;
        case 8:
          columnKey[j] = "teachers";
          break;
        case 9:
          if (row[j] === "Пропозиції до складання розкладу занять")
            columnKey[j] = "audiences";
          break;
        case 10:
          if (row[j] === "Лекції") columnKey[j] = "times_per_week";
          break;
        case 11:
          if (row[j] === "Практичні") columnKey[j] = "times_per_week";
          break;
        case 12:
          if (row[j] === "Лабораторні") columnKey[j] = "times_per_week";
          break;
        default:
          break;
      }
    }
  }
  return columnKey;
}

function GetKey(columnKey, value) {
  for (let key in columnKey) {
    if (columnKey[key] === value) return key;
  }
  return null;
}
