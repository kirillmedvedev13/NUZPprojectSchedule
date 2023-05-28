import React from "react";
import { Form, Row, Card, Col } from "react-bootstrap";
import SelectCathedra from "../SelectCathedra.js";
import SelectAlgoritm from "./SelectAlgorithm.js";
import { GET_ALL_ALGORITHM } from "../queries";
import { useQuery } from "@apollo/client";
import MultiCharts from "./MultiCharts.js";
import Select from "react-select";

import ButtonRunAlgorithm from "./ButtonRunAlgorithm.js";
import ButtonUpdateAlgorithm from "./ButtonUpdateAlgorithm.js";
import ButtonDeleteResults from "./ButtonDeleteResults.js";

function GetLabelForResults(params, params_value) {
  let label = "";
  params = JSON.parse(params);
  params_value = JSON.parse(params_value);

  for (let i = 0; i < params.length - 1; i++) {
    label += `${params[i].short}: ${params_value[params[i].name]}, `;
  }
  if (params.length)
    label += `${params[params.length - 1].short}: ${
      params_value[params[params.length - 1].name]
    }, `;
  else label = "Без параметрів";
  return label;
}

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
  let results_algorithms = [];
  if (state.nameAlgorithm) {
    arrAlgorithm.forEach((obj) => {
      if (obj.name === state.nameAlgorithm) {
        obj.results_algorithms.forEach((res) => {
          results_algorithms.push({
            name: res.params_value,
            label: GetLabelForResults(obj.params, res.params_value),
            results: res.results,
          });
        });
      }
    });
  }
  return (
    <>
      <div className="col-md-6 offset-md-3">
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
      {results_algorithms?.length ? (
        <MultiCharts
          results={results_algorithms}
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
      {nameAlgorithm ? (
        <>
          <div className="col-md-6 offset-md-3">
            <Card className="my-2">
              <Card.Header className="text-center">
                {"Складання розклад за допомогою " + state.label}
              </Card.Header>
              <Card.Body>
                {params.map((param) => (
                  <Form.Group as={Row} className="my-2 mx-2">
                    <Form.Label className=" col-md-4">{param.label}</Form.Label>
                    <Col className="col-md-8">
                      {param.type == "select" ? (
                        <Select
                          value={{
                            value: param.value,
                            label: param.options.find(
                              (opt) => opt.value === param.value
                            ).label,
                          }}
                          options={param.options}
                          onChange={(e) => {
                            debugger;
                            param.value = e.value;
                            handleChangeState("params", params);
                          }}
                        ></Select>
                      ) : (
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
                      )}
                    </Col>
                  </Form.Group>
                ))}
              </Card.Body>

              <Card.Footer>
                {params.length ? (
                  <ButtonUpdateAlgorithm
                    name={nameAlgorithm}
                    params={JSON.stringify(params)}
                    refetch={refetch}
                  />
                ) : null}
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
        <div className="col-md-6 offset-md-3">
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
