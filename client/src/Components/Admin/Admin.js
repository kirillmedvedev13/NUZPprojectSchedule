import React from "react";
import { Form, Card, Carousel } from "react-bootstrap";
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
      max_pair: null,
      max_day: null,
      fintess_value: null,
      population_size: null,
      max_generations: null,
      p_crossover: null,
      p_mutation: null,
      p_genes: null,
      penaltyGrWin: null,
      penaltyTeachWin: null,
      penaltyLateSc: null,
      penaltyEqSc: null,
      penaltySameTimesSc: null,
      penaltySameRecSc: null,
      p_elitism: null,
    },
  };

  handleChangeInfo = (name, value) => {
    this.setState((PrevState) => ({
      info: update(PrevState.info, { $merge: { [name]: value } }),
    }));
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
        <Carousel variant="dark" interval={null}>
          <Carousel.Item className="mb-5">
            <div className="d-flex justify-content-center  ">
              <Card className="my-2">
                <Card.Header className="text-center">
                  Складання розкладу за допомогою Генетичного Алгоритму
                </Card.Header>
                <Card.Body>
                  <FormEA
                    handleChangeInfo={this.handleChangeInfo}
                    info={this.state.info}
                  ></FormEA>
                </Card.Body>
                <Card.Footer>
                  <ButtonRunEA></ButtonRunEA>
                </Card.Footer>
              </Card>
            </div>
          </Carousel.Item>
          <Carousel.Item className="mb-5">
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
                    <SelectCathedra
                      setCathedra={this.setCathedra}
                    ></SelectCathedra>
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
          </Carousel.Item>
          <Carousel.Item className="mb-5">
            <div className="d-flex justify-content-center  ">
              <Card className="my-2">
                <Card.Header className="text-center">
                  Видалення даних
                </Card.Header>
                <Card.Body></Card.Body>
                <Card.Footer>
                  <ButtonDeleteAllData></ButtonDeleteAllData>
                </Card.Footer>
              </Card>
            </div>
          </Carousel.Item>
        </Carousel>
      </>
    );
  }
}

export default Admin;
