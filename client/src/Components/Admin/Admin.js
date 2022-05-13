import React from "react";
import { Form, Card } from "react-bootstrap";
import { CreateNotification } from "../Alert";
import { Workbook } from "exceljs";
import ButtonRunEA from "./ButtonRunEA";
import { ButtonDeleteAllData } from "./ButtonDeleteAllData";
import ButtonSubmitData from "./ButtonSubmitData";
import SelectCathedra from "./SelectCathedra";
import update from "react-addons-update";
import FormEA from "./FormEA";

class Admin extends React.Component {
  state = {
    file: "",
    id_cathedra: null,
    sheets: [],
    sheetIndex: null,
    onDelete: false,
    info: {
      population_size: 0,
      max_generations: 0,
      p_crossover: 0,
      p_mutation: 0,
      p_genes: 0,
      penaltyGrWin: 0,
      penaltyTeachWin: 0,
      penaltyLateSc: 0,
      penaltyEqSc: 0,
      penaltySameTimesSc: 0,
    },
  };

  handleChangeInfo = (name, value) => {
    this.setState((PrevState) => ({
      info: update(PrevState.info, { $merge: { [name]: value } }),
    }));
  };

  handleSetInfo = (info) => {
    this.setState({ info })
  }

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
                <ButtonSubmitData
                  id_cathedra={this.state.id_cathedra}
                  file={this.state.file}
                  sheetIndex={this.state.sheetIndex}
                ></ButtonSubmitData>
              </Card.Footer>
            </Card.Body>
          </Card>
        </div>
        <div className="d-flex justify-content-center  ">
          <Card className="my-2">
            <Card.Header className="text-center">Видалення даних</Card.Header>
            <Card.Body></Card.Body>
            <Card.Footer>
              <ButtonDeleteAllData></ButtonDeleteAllData>
            </Card.Footer>
          </Card>
        </div>
        <div className="d-flex justify-content-center  ">
          <Card className="my-2">
            <Card.Header className="text-center">
              Складання розкладу за допомогою ГА
            </Card.Header>
            <Card.Body>
              <FormEA handleChangeInfo={this.handleChangeInfo} handleSetInfo={this.handleSetInfo} info={this.state.info}></FormEA>
            </Card.Body>
            <Card.Footer>
              <ButtonRunEA></ButtonRunEA>
            </Card.Footer>
          </Card>
        </div>
      </>
    );
  }
}

export default Admin;
