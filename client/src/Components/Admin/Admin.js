import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import Select from "react-select";
import { GET_ALL_CATHEDRAS } from "../Cathedra/queries";
import { Form, Button, Card } from "react-bootstrap";
import { CreateNotification } from "../Alert";
import { Workbook } from "exceljs";
import { DELETE_ALL_DATA, SET_CLASSES } from "./mutations.js";

function SubmitData({ id_cathedra, file, sheetIndex }) {
  const [SetClasses, { loading, error }] = useMutation(SET_CLASSES, {
    refetchQueries: [],
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  return (
    <Button
      className="col-12"
      onClick={() => {
        if (!id_cathedra || !file) {
          return CreateNotification({
            succesful: false,
            message: "Заповніть дані у формi!",
          });
        }
        readFile(file, sheetIndex).then((data) => {
          console.log(JSON.parse(data));
          const variables = { variables: { data, id_cathedra } };
          /* SetClasses(variables).then((res) => {
            CreateNotification(res.data.SetClasses);
          });*/
        });
      }}
    >
      Завантажити дані
    </Button>
  );
}

async function readFile(file, sheetIndex) {
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
          parseData(dataRows).then((data) => {
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

function compareClasses(prev, current) {
  if (
    prev[2] === current[2] &&
    prev[3] === current[3] &&
    prev[4] === current[4]
  )
    return true;
  else return false;
}

function getColumKey(row) {
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
          if (row[j] === "Загальна кількість годин за видом занять")
            columnKey[j] = "numberClasses";
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
          if (row[j] === "Лекції") columnKey[j] = "numberClasses";
          break;
        case 11:
          if (row[j] === "Практичні") columnKey[j] = "numberClasses";
          break;
        case 12:
          if (row[j] === "Лабораторні") columnKey[j] = "numberClasses";
          break;
      }
    }
  }
  return columnKey;
}

function getKey(columnKey, value) {
  for (let key in columnKey) {
    if (columnKey[key] === value) return key;
  }
  return null;
}
async function parseData(sheet) {
  let Data = {};
  let classes = [];
  let columnKey = {};
  let counter = 1;
  let firstRow = false; //Что бы пропускать первую строку с счётчиком
  for (let i = 0; i < sheet.length; i++) {
    // Проход по строкам
    let lesson = {};

    if (sheet[i][1] === "№\nз/п") {
      columnKey = getColumKey(sheet[i]);
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
      const checkLesson = compareClasses(sheet[i - 1], sheet[i]);
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
                if (sheet[i][j] === "лекції") lesson[key] = 1;
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
        classes.push(lesson);
      } else {
        // если пред строка равна текущей
        let prev = classes[classes.length - 1];
        let teach = sheet[i][getKey(columnKey, "teachers")];
        prev.teachers.push(teach);
        let auds = [];
        auds.push(String(sheet[i][getKey(columnKey, "audiences")]));
        auds.push(String(prev.audiences));
        prev.audiences = auds;
        classes[classes.length - 1] = prev;
      }
    }
  }
  Data["classes"] = classes;
  return JSON.stringify(Data);
}

function SelectCathedra({ setCathedra }) {
  const { error, loading, data } = useQuery(GET_ALL_CATHEDRAS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllCathedras.forEach((item) => {
    options.push({ label: item.name, value: Number(item.id) });
  });
  return (
    <Select
      className="col-12 my-2"
      isClearable
      options={options}
      placeholder="Кафедра"
      onChange={(e) => {
        setCathedra(e ? Number(e.value) : null);
      }}
    />
  );
}

function DeleteAllData() {
  const [DeleteAllData, { loading, error }] = useMutation(DELETE_ALL_DATA, {
    refetchQueries: [],
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <Button
      onClick={() => {
        DeleteAllData().then((res) => {
          CreateNotification(res.data.DeleteAllData);
        });
      }}
    >
      DELETE DATA
    </Button>
  );
}
class Admin extends React.Component {
  state = {
    file: "",
    id_cathedra: null,
    sheets: [],
    sheetIndex: null,
    onDelete: false,
  };

  setFile(file) {
    this.setState({ file });

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const buffer = reader.result;
      const workBook = new Workbook();
      workBook.xlsx
        .load(buffer)
        .then((workbook) => {
          let sheets = [];
          workbook.worksheets.forEach((sh) => {
            sheets.push(sh.name);
          });
          this.setState({ sheets, sheetIndex: 0 });
        })
        .catch((err) => {
          CreateNotification({
            successful: false,
            message: "Помилка завантаження даних!",
          });
        });
    };
  }

  setCathedra = (id_cathedra) => {
    this.setState({ id_cathedra });
  };

  render() {
    return (
      <>
        <div className="d-flex justify-content-center  ">
          <DeleteAllData></DeleteAllData>
        </div>
        <div className="d-flex justify-content-center  ">
          <Card className="my-2">
            <Card.Header className="text-center">
              Відомість заручень
            </Card.Header>
            <Card.Body>
              <Form.Group controlId="formFileLg" className=" bg-light mb-3">
                <Form.Control
                  type="file"
                  size="md"
                  onChange={(e) => {
                    this.setFile(e.target.files[0]);
                  }}
                />
                <SelectCathedra setCathedra={this.setCathedra}></SelectCathedra>
                <Form.Select
                  onChange={(e) => {
                    this.setState({ sheetIndex: e.target.value });
                  }}
                >
                  {this.state.sheets.map((sh, index) => {
                    return (
                      <option key={index} value={index}>
                        {sh}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
              <Card.Footer>
                <SubmitData
                  id_cathedra={this.state.id_cathedra}
                  file={this.state.file}
                  sheetIndex={this.state.sheetIndex}
                ></SubmitData>
              </Card.Footer>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }
}

export default Admin;
