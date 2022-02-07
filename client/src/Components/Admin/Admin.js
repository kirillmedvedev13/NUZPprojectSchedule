import React from "react";
import * as XLSX from "xlsx";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_ALL_CATHEDRAS } from "../Cathedra/queries";
import { Form, Button, Card } from "react-bootstrap";
import { CreateNotification } from "../Alert";

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
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      const bufferStr = e.target.result;
      const workBook = XLSX.read(bufferStr, {
        type: rABS ? "binary" : "array",
      });
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      const dataCSV = XLSX.utils.sheet_to_csv(workSheet, { header: 1 });
      const dataJSON = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      console.log("Data>>>" + dataCSV);
      //console.log("DataJSon>>>" + dataJSON);
      this.parseData(dataCSV);
      //console.log(this.convertToJson(dataCSV));
    };
    reader.readAsBinaryString(file);
  }
  setCathedra = (id_cathedra) => {
    console.log(id_cathedra);
    this.setState({ id_cathedra });
  };
  parseData(csv) {
    let lines = csv.split("\n");
    //console.log(lines);
    let arrLines = lines.map((line) => {
      return line.split(/[,|+|_]/);
    });
    console.log(arrLines);
    let DATA = {};
    DATA.id_cathedra = this.state.id_cathedra;
  }

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
