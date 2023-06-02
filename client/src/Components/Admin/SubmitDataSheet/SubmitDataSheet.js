import { Form, Card } from "react-bootstrap";
import ButtonSubmitDataSheet from "./ButtonSubmitDataSheet";
import SelectCathedra from "../SelectCathedra";
import React from "react";
import ButtonGetTemplate from "./ButtonGetTemplate";
import XLSX from "xlsx-color";
import { CreateNotification } from "../../Alert.js";

export default class SubmitDataSheet extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      file: "",
      id_cathedra: null,
      sheets: [],
      sheetIndex: null,
    };
    this.setFile = this.setFile.bind(this);
  }
  componentDidMount() {
    document.title = this.props.title;
  }

  setFile(file) {
    try {
      this.setState({ file });
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        let workBook = XLSX.read(data, { type: "array" });
        let sheets = [];
        workBook.SheetNames.forEach((name) => {
          sheets.push(name);
        });
        this.setState({ sheets, sheetIndex: 0 });
      };
    } catch (err) {
      CreateNotification({
        successful: false,
        message: `Помилка завантаження даних! ${err}`,
      });
    }
  }

  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };

  render() {
    return (
      <>
        <div className="col-md-6 offset-md-3">
          <Card className="my-2">
            <Card.Header className="text-center">
              Відомість доручень
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
                <SelectCathedra
                  id_cathedra={this.state.id_cathedra}
                  handleChangeState={this.handleChangeState}
                ></SelectCathedra>
                <Form.Select
                  onChange={(e) => {
                    this.handleChangeState("sheetIndex", e.target.value);
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
            </Card.Body>
            <Card.Footer>
              <ButtonGetTemplate></ButtonGetTemplate>
              <ButtonSubmitDataSheet
                id_cathedra={this.state.id_cathedra}
                file={this.state.file}
                sheetIndex={this.state.sheetIndex}
              ></ButtonSubmitDataSheet>
            </Card.Footer>
          </Card>
        </div>
      </>
    );
  }
}
