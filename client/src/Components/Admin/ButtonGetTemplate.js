import { Button } from "react-bootstrap";
import { utils, writeFile } from "xlsx-color";

export default function ButtonGetTemplate() {
  return (
    <div className="my-2  d-flex justify-content-center">
      <Button
        className="col-12"
        onClick={() => {
          GetTemplateFile();
        }}
      >
        Завантажити шаблон відомості
      </Button>
    </div>
  );
}
function GetTemplateFile() {
  let workSheet = GetWorkSheet();
  let workBook = utils.book_new();
  let nameTable = "templateClasses";
  utils.book_append_sheet(workBook, workSheet, nameTable);
  writeFile(workBook, `${nameTable}.xlsx`);
}
function GetWorkSheet() {
  let border = {
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
  };
  return {
    "!ref": "A1:M14",
    I1: {
      t: "s",
      v: "Форма № 44",

      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 10,
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    A2: {
      t: "s",
      v: "МІНІСТЕРСТВО ОСВІТИ І НАУКИ УКРАЇНИ",

      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 14,
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    A4: {
      t: "s",
      v: "Національний університет «Запорізька політехніка»",

      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 24,
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    A6: {
      t: "s",
      v: "ВІДОМІСТЬ",

      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 20,
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    A8: {
      t: "s",
      v: "ДОРУЧЕНЬ НА ___________СЕМЕСТР____________НАВЧАЛЬНИЙ РІК",
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",

          sz: 12,
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    A10: {
      t: "s",
      v: "КАФЕДРА__________________________",
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 14,
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    A11: {
      t: "s",
      v: "Форма навчання ___________________________________________________",

      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          sz: 14,
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    A13: {
      t: "s",
      v: "№\r\nз/п",
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 14,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    B13: {
      t: "s",
      v: "Назва дисципліни",

      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 14,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    C13: {
      t: "s",
      v: "№ груп",
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 14,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    D13: {
      t: "s",
      v: "Вид занять",
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 14,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    E13: {
      t: "s",
      v: "Загальна кількість годин за видом занять",
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 14,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    F13: {
      t: "s",
      v: "Кількість годин на тиждень за видом занять",
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 14,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    G13: {
      t: "s",
      v: "Контроль",
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 14,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    H13: {
      t: "s",
      v: "Прізвище Ім'я \r\nПо батькові викладачів",
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 14,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    I13: {
      t: "s",
      v: "Пропозиції до складання розкладу занять",
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          bold: true,
          sz: 14,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    A14: {
      t: "n",
      v: 1,
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          italic: true,
          sz: 9,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    B14: {
      t: "n",
      v: 2,
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          italic: true,
          sz: 9,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    C14: {
      t: "n",
      v: 3,
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          italic: true,
          sz: 9,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    D14: {
      t: "n",
      v: 4,
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          italic: true,
          sz: 9,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    E14: {
      t: "n",
      v: 5,

      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          italic: true,
          sz: 9,
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
        border: border,
      },
    },
    F14: {
      t: "n",
      v: 6,
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          italic: true,
          sz: 9,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    G14: {
      t: "n",
      v: 7,
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          italic: true,
          sz: 9,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    H14: {
      t: "n",
      v: 8,
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          italic: true,
          sz: 9,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    I14: {
      t: "n",
      v: 9,
      s: {
        patternType: "none",
        font: {
          name: "Times New Roman",
          italic: true,
          sz: 9,
        },
        border: border,
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        },
      },
    },
    "!rows": [
      null,
      {
        hpt: 18.75,
        hpx: 18.75,
      },
      {
        hpt: 7.5,
        hpx: 7.5,
      },
      {
        hpt: 26,
        hpx: 26,
      },
      {
        hpt: 6.75,
        hpx: 6.75,
      },
      {
        hpt: 25.5,
        hpx: 25.5,
      },
      {
        hpt: 8.85,
        hpx: 8.85,
      },
      {
        hpt: 15.75,
        hpx: 15.75,
      },
      {
        hpt: 11.65,
        hpx: 11.65,
      },
      {
        hpt: 18.75,
        hpx: 18.75,
      },
      {
        hpt: 18.75,
        hpx: 18.75,
      },
      {
        hpt: 18.75,
        hpx: 18.75,
      },
      {
        hpt: 133.5,
        hpx: 133.5,
      },
    ],
    "!margins": {
      left: 0.7,
      right: 0.7,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    },
    "!cols": [
      null,
      {
        width: 24.7109375,
        customwidth: "1",
        wpx: 173,
        wch: 24,
        MDW: 7,
      },
      {
        width: 29.42578125,
        customwidth: "1",
        wpx: 206,
        wch: 28.71,
        MDW: 7,
      },
      {
        width: 13.5703125,
        customwidth: "1",
        wpx: 95,
        wch: 12.86,
        MDW: 7,
      },
      {
        width: 39,
        customwidth: "1",
        wpx: 273,
        wch: 38.29,
        MDW: 7,
      },
      {
        width: 20.28515625,
        customwidth: "1",
        wpx: 142,
        wch: 19.57,
        MDW: 7,
      },
      {
        width: 19.140625,
        customwidth: "1",
        wpx: 134,
        wch: 18.43,
        MDW: 7,
      },
      {
        width: 34.28515625,
        customwidth: "1",
        wpx: 240,
        wch: 33.57,
        MDW: 7,
      },
      {
        width: 55.140625,
        customwidth: "1",
        wpx: 386,
        wch: 54.43,
        MDW: 7,
      },
    ],
    "!merges": [
      {
        s: {
          c: 0,
          r: 1,
        },
        e: {
          c: 8,
          r: 1,
        },
      },
      {
        s: {
          c: 0,
          r: 3,
        },
        e: {
          c: 8,
          r: 3,
        },
      },
      {
        s: {
          c: 0,
          r: 5,
        },
        e: {
          c: 8,
          r: 5,
        },
      },
      {
        s: {
          c: 0,
          r: 7,
        },
        e: {
          c: 8,
          r: 7,
        },
      },
      {
        s: {
          c: 0,
          r: 9,
        },
        e: {
          c: 8,
          r: 9,
        },
      },
      {
        s: {
          c: 0,
          r: 10,
        },
        e: {
          c: 8,
          r: 10,
        },
      },
    ],
  };
}
