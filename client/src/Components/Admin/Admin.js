import React from "react";
import { Form, Card, Carousel, Row } from "react-bootstrap";
import ButtonRunEA from "./ButtonRunEA";
import { ButtonDeleteAllData } from "./ButtonDeleteAllData";
import { CreateNotification } from "../Alert";
import SelectCathedra from "./SelectCathedra";
import FormEA from "./FormEA";
import XLSX from "xlsx-color";
import FormDataLoad from "./FormDataLoad";
import FormScheduleData from "./FormScheduleData";
import FormGeneralValues from "./FormGeneralValues";

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      id_cathedra: null,
      sheets: [],
      sheetIndex: null,
      onDelete: false,
      info: {
        max_pair: null,
        max_day: null,
        fintess_value: null,
        general_values: {
          penaltyGrWin: null,
          penaltyTeachWin: null,
          penaltyLateSc: null,
          penaltyEqSc: null,
          penaltySameTimesSc: null,
          penaltySameRecSc: null,
        },
        evolution_values: {
          population_size: null,
          max_generations: null,
          p_crossover: null,
          p_mutation: null,
          p_genes: null,
          p_elitism: null,
        },
      },
    };

    this.setFile = this.setFile.bind(this);
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

  handleChangeSomeValues = (objectName, name, value) => {
    this.setState((PrevState) => ({
      ...PrevState,
      info: {
        ...PrevState.info,
        [objectName]: Object.assign(
          { ...PrevState.info[objectName] },
          { [name]: value }
        ),
      },
    }));
    console.log(this.state);
  };
  handleChangeInfo = (name, value) => {
    this.setState((PrevState) => ({
      info: Object.assign({ ...PrevState.info }, { [name]: value }),
    }));
  };
  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
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
                    handleChangeSomeValues={this.handleChangeSomeValues}
                    info={this.state.info}
                  ></FormEA>
                </Card.Body>
                <Card.Footer>
                  <Form.Group as={Row} className="my-2 mx-2">
                    <SelectCathedra
                      handleChangeState={this.handleChangeState}
                      id_cathedra={this.state.id_cathedra}
                    ></SelectCathedra>
                  </Form.Group>
                  <Form.Group as={Row} className="my-2 mx-2">
                    <ButtonRunEA
                      id_cathedra={this.state.id_cathedra}
                    ></ButtonRunEA>
                  </Form.Group>
                </Card.Footer>
              </Card>
            </div>
          </Carousel.Item>
          <Carousel.Item className="mb-5">
            <FormGeneralValues
              handleChangeSomeValues={this.handleChangeSomeValues}
              info={this.state.info}
            ></FormGeneralValues>
          </Carousel.Item>

          <Carousel.Item className="mb-5">
            <FormScheduleData
              handleChangeInfo={this.handleChangeInfo}
              info={this.state.info}
            ></FormScheduleData>
          </Carousel.Item>
          <Carousel.Item className="mb-5">
            <FormDataLoad
              setFile={this.setFile}
              file={this.state.file}
              sheetIndex={this.state.sheetIndex}
              id_cathedra={this.state.id_cathedra}
              sheets={this.state.sheets}
              handleChangeState={this.handleChangeState}
            ></FormDataLoad>
          </Carousel.Item>
          <Carousel.Item className="mb-5">
            <div className="d-flex justify-content-center">
              <Card className="my-2 w-50">
                <Card.Header className="text-center">
                  Видалення даних
                </Card.Header>
                <Card.Body>
                  <Form.Group as={Row} className=" mx-2">
                    <SelectCathedra
                      id_cathedra={this.state.id_cathedra}
                      handleChangeState={this.handleChangeState}
                    ></SelectCathedra>
                  </Form.Group>
                </Card.Body>
                <Card.Footer>
                  <Form.Group as={Row} className="my-2 mx-4">
                    <ButtonDeleteAllData
                      id_cathedra={this.state.id_cathedra}
                    ></ButtonDeleteAllData>
                  </Form.Group>
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
