import React from "react";
import { Form, Card, Carousel } from "react-bootstrap";
import ButtonRunEA from "./ButtonRunEA";
import { ButtonDeleteAllData } from "./ButtonDeleteAllData";
import { Workbook } from "exceljs";
import { CreateNotification } from "../Alert";
import SelectCathedra from "./SelectCathedra";
import FormEA from "./FormEA";
import XLSX from "xlsx-color";
import FormDataLoad from "./FormDataLoad";

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
                    handleChangeInfo={this.handleChangeInfo}
                    info={this.state.info}
                  ></FormEA>
                </Card.Body>
                <Card.Footer>
                  <SelectCathedra
                    handleChangeState={this.handleChangeState}
                    id_cathedra={this.state.id_cathedra}
                  ></SelectCathedra>
                  <ButtonRunEA
                    id_cathedra={this.state.id_cathedra}
                  ></ButtonRunEA>
                </Card.Footer>
              </Card>
            </div>
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
                  <SelectCathedra
                    id_cathedra={this.state.id_cathedra}
                    handleChangeState={this.handleChangeState}
                  ></SelectCathedra>
                </Card.Body>
                <Card.Footer>
                  <ButtonDeleteAllData
                    id_cathedra={this.state.id_cathedra}
                  ></ButtonDeleteAllData>
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
