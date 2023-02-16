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

function ChooseAlgorithm({ state, handleChangeState }) {
  const { loading, error, data, refetch } = useQuery(GET_ALL_ALGORITHM);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let arr = data.GetAllAlgorithm;
  let results_algorithms = [];
  arr.forEach((obj) => {
    if (obj.name === state.nameAlgorithm) {
      obj.results_algorithms.forEach((res) => {
        results_algorithms.push({
          name: res.params_value,
          label: res.params_value,
          results: res.results,
        });
      });
    }
  });

  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="my-2">
          <Card.Header className="text-center">Вибір алгоритму</Card.Header>
          <Card.Footer>
            <Form.Group as={Row} className="my-2 mx-2">
              <SelectAlgoritm
                data={arr}
                handleChangeState={handleChangeState}
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
        results_algorithms={results_algorithms}
        refetch={refetch}
      ></AlgorithmForm>
    </>
  );
}

function AlgorithmForm({
  state,
  handleChangeState,
  results_algorithms,
  refetch,
}) {
  let params = state.params;
  console.log(results_algorithms);
  return (
    <>
      {state.nameAlgorithm && params.length ? (
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
                  name={state.nameAlgorithm}
                  params={JSON.stringify(state.params)}
                  refetch={refetch}
                />
              </Card.Footer>
            </Card>
          </div>
          {results_algorithms.length ? (
            <MultiCharts results={results_algorithms}></MultiCharts>
          ) : null}
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
