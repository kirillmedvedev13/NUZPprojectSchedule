import React from "react";
import { Form, Row, Card, Col } from "react-bootstrap";
import SelectCathedra from "../SelectCathedra.js";
import NaviBarAdmin from "../NaviBarAdmin.js";
import SelectAlgoritm from "./SelectAlgorithm.js";
import { GET_ALL_ALGORITHM } from "../queries";
import { useQuery } from "@apollo/client";
import MultiCharts from "./MultiCharts.js";

import ButtonRunAlgorithm from "./ButtonRunAlgorithm.js";
import ButtonUpdateAlgorithm from "./ButtonUpdateAlgorithm.js";
import ButtonDeleteResults from "./ButtonDeleteResults.js";

function GetBestResults(algorithms) {
  let best_results = [];
  algorithms.forEach((obj) => {
    if (obj.results_algorithms.length) {
      let best_res = JSON.parse(obj.results_algorithms[0].results);
      for (let i = 0; i < obj.results_algorithms.length; i++) {
        let temp = JSON.parse(obj.results_algorithms[i].results);
        if (best_res[best_res.length - 1][1] > temp[temp.length - 1][1])
          best_res = temp;
      }
      best_results.push({
        name: obj.name,
        label: obj.label,
        results: JSON.stringify(best_res),
      });
    }
  });
  return best_results;
}

function ChooseAlgorithm({ state, handleChangeState }) {
  const { loading, error, data, refetch } = useQuery(GET_ALL_ALGORITHM);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let arrAlgorithm = data.GetAllAlgorithm;
  let best_results = GetBestResults(arrAlgorithm);

  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="my-2">
          <Card.Header className="text-center">Вибір алгоритму</Card.Header>
          <Card.Footer>
            <Form.Group as={Row} className="my-2 mx-2">
              <SelectAlgoritm
                handleChangeState={handleChangeState}
                arrAlgorithm={arrAlgorithm}
              ></SelectAlgoritm>
            </Form.Group>
            <Form.Group as={Row} className="my-2 mx-2">
              <ButtonRunAlgorithm
                name={state.nameAlgorithm}
                id_cathedra={state.id_cathedra}
                refetch={refetch}
              ></ButtonRunAlgorithm>
            </Form.Group>
          </Card.Footer>
        </Card>
      </div>

      <AlgorithmForm
        state={state}
        handleChangeState={handleChangeState}
        refetch={refetch}
      ></AlgorithmForm>

      {state.results_algorithms?.length ? (
        <MultiCharts
          results={state.results_algorithms}
          nameAlgorithm={state.nameAlgorithm}
        ></MultiCharts>
      ) : null}
      <MultiCharts
        results={best_results}
        nameAlgorithm={"allResults"}
      ></MultiCharts>
    </>
  );
}

function AlgorithmForm({ state, handleChangeState, refetch }) {
  let { nameAlgorithm, params } = { ...state };
  return (
    <>
      {nameAlgorithm && params.length ? (
        <>
          <div className="d-flex justify-content-center mx-5">
            <Card className="my-2">
              <Card.Header className="text-center">
                {"Складання розклад за допомогою " + state.label}
              </Card.Header>
              <Card.Body>
                {params.map((param) => (
                  <Form.Group as={Row} className="my-2 mx-2">
                    <Form.Label className="col-5">{param.label}</Form.Label>
                    <Col>
                      <Form.Control
                        value={param.value}
                        type={param.type}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        onChange={(e) => {
                          param.value = +e.target.value;
                          handleChangeState("params", params);
                        }}
                      />
                    </Col>
                  </Form.Group>
                ))}
              </Card.Body>

              <Card.Footer>
                <ButtonUpdateAlgorithm
                  name={nameAlgorithm}
                  params={JSON.stringify(params)}
                  refetch={refetch}
                />
                <ButtonDeleteResults
                  name_algorithm={nameAlgorithm}
                  refetch={refetch}
                ></ButtonDeleteResults>
              </Card.Footer>
            </Card>
          </div>
        </>
      ) : null}
    </>
  );
}

export default class Algorithms extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      id_cathedra: null,
      nameAlgorithm: null,
      label: null,
      params: null,
      results_algorithms: null,
    };
  }

  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };

  render() {
    return (
      <>
        <NaviBarAdmin></NaviBarAdmin>
        <div className="d-flex justify-content-center">
          <Card className="my-2">
            <Card.Header className="text-center">Вибір кафедри</Card.Header>
            <Card.Footer>
              <Form.Group as={Row} className="my-2 mx-2">
                <SelectCathedra
                  handleChangeState={this.handleChangeState}
                  id_cathedra={this.state.id_cathedra}
                ></SelectCathedra>
              </Form.Group>
            </Card.Footer>
          </Card>
        </div>
        <ChooseAlgorithm
          state={this.state}
          handleChangeState={this.handleChangeState}
        />
      </>
    );
  }
}
