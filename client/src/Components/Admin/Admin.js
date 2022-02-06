import React from "react";
import * as XLSX from "xlsx";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_ALL_CATHEDRAS } from "../Cathedra/queries";
import { Form, Button, Card } from "react-bootstrap";

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

  handleClick(e) {
    this.refs.fileUploader.click();
  }

  filePathset(e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    console.log(file);
    this.setState({ file });

    console.log(this.state.file);
  }

  readFile() {
    var f = this.state.file;
    var name = f.name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      console.log(wb);
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      console.log("Data>>>" + data);
      console.log(this.convertToJson(data));
    };
    reader.readAsBinaryString(f);
  }
  setCathedra = (id_cathedra) => {
    console.log(id_cathedra);
    this.setState({ id_cathedra });
  };
  convertToJson(csv) {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }
    return JSON.stringify(result);
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
                ref="fileUploader"
                onChange={this.filePathset.bind(this)}
              />
              <SelectCathedra setCathedra={this.setCathedra}></SelectCathedra>
            </Form.Group>
            <Card.Footer>
              <Button
                className="col-12"
                onClick={() => {
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
