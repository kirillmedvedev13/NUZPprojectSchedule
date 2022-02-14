import React from "react";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_ALL_CATHEDRAS } from "../Cathedra/queries";
import { Form, Button, Card } from "react-bootstrap";
import { CreateNotification } from "../Alert";
import { Workbook } from "exceljs";

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

class Admin extends React.Component {
  state = {
    file: "",
    id_cathedra: null,
  };

  filePathSet(file) {
    console.log(file);
    this.setState({ file });
  }

  readFile() {
    const file = this.state.file;
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const buffer = reader.result;
      const workBook = new Workbook();
      workBook.xlsx
        .load(buffer)
        .then((workbook) => {
          //console.log(workbook, "workbook instance");
          let sheet = workbook.worksheets[0];
          let dataRows = [];
          sheet.eachRow((row, rowIndex) => {
            console.log(row.values);
            dataRows.push(row.values);
          });
          // this.parseData(dataRows);
        })
        .catch((err) => {
          CreateNotification({
            successful: false,
            message: "Помилка завантаження даних!",
          });
          console.log(err);
        });
    };
  }
  compareClasses(prev, current) {}
  parseData(sheet) {
    let Data = {};
    let classes = [];
    console.log(sheet);
    Data["semester"] = sheet[4][1].richText[1].text;
    let prevData = null;
    for (let i = 8; i < sheet.length - 4; i++) {
      let object = sheet[i];
      let lesson = {};
      let j = 0;

      if (
        object[2] !== "Виробнича практика" &&
        object[2] !== "Нормоконтроль" &&
        Number(object[1])
      ) {
        let check = prevData ? this.compareClasses(prevData, object) : false;
        while (j <= 12) {
          let key;
          switch (j) {
            case 2:
              key = "discipline";
              break;
            case 3:
              key = "groups";
              break;
            case 4:
              key = "type_class";
              break;
            case 5:
              key = object[j] ? "audience" : null;
              break;
            case 6:
              key = object[j] ? "audiences" : null;
              break;
            case 8:
              key = "teacher";
              break;
            case 10:
              key = object[j] ? "numberClasses" : null;
              break;
            case 12:
              key = object[j] ? "numberClasses" : null;
              break;
          }
          if (key) {
            if (key === "groups") {
              let groups = object[j].split("-")[1];
              lesson[key] = groups.split(/[,|+]/);
            } else if (key === "audiences") {
              let aud = String(object[j]);
              lesson[key] = aud.indexOf(".") ? aud.split(".") : aud;
            } else lesson[key] = object[j];
          }
        }

        j++;
      }

      prevData = lesson;

      if (Object.keys(lesson).length !== 0) classes.push(lesson);
    }

    Data["classes"] = classes;
    Data["cathedra"] = this.state.id_cathedra;
    console.log(Data);
  }
  setCathedra = (id_cathedra) => {
    this.setState({ id_cathedra });
  };

  render() {
    return (
      <div className="d-flex justify-content-center  ">
        <Card className="my-2">
          <Card.Header className="text-center">Відомість заручень</Card.Header>
          <Card.Body>
            <Form.Group controlId="formFileLg" className=" bg-light mb-3">
              <Form.Control
                type="file"
                size="md"
                onChange={(e) => {
                  this.filePathSet(e.target.files[0]);
                }}
              />
              <SelectCathedra setCathedra={this.setCathedra}></SelectCathedra>
            </Form.Group>
            <Card.Footer>
              <Button
                className="col-12"
                onClick={() => {
                  if (!this.state.id_cathedra || !this.state.file) {
                    return CreateNotification({
                      succesful: false,
                      message: "Заповніть дані в таблиці!",
                    });
                  }
                  this.readFile();
                }}
              >
                Завантажити дані
              </Button>
            </Card.Footer>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Admin;
