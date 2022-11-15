import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";

import ButtonUpdateInfo from "../ButtonUpdateInfo.js";
import ButtonRunEA from "./ButtonRunEA.js";
import ButtonRunEACpp from "./ButtonRunEACpp.js";

export default class EvolutionAlgorithm extends React.Component {
  render() {
    let { id_cathedra, refetch, evolution_values, handleChangeState } = this.props;
    return (
      <div className="d-flex justify-content-center mx-5">
        <Card className="my-2">
          <Card.Header className="text-center">
            Складання розкладу за допомогою Генетичного Алгоритму
          </Card.Header>
          <Card.Body>
            <>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-5">Розмір популяції</Form.Label>
                <Col>
                  <Form.Control
                    value={evolution_values?.population_size}
                    type="number"
                    min={0}
                    onChange={(e) => {
                      evolution_values.population_size = Number(
                        e.target.value
                      );
                      handleChangeState("evolution_values", evolution_values);
                    }}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-5">
                  Максимальна кiлькiсть iтерацiй
                </Form.Label>
                <Col>
                  <Form.Control
                    value={evolution_values?.max_generations}
                    type="number"
                    min={0}
                    onChange={(e) => {
                      evolution_values.max_generations = Number(
                        e.target.value
                      );
                      handleChangeState("evolution_values", evolution_values);
                    }}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-5">
                  Ймовірність схрещування
                </Form.Label>
                <Col>
                  <Form.Control
                    value={evolution_values?.p_crossover}
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={(e) => {
                      evolution_values.p_crossover = Number(e.target.value);
                      this.handleChangeState(
                        "evolution_values",
                        evolution_values
                      );
                    }}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-5">Ймовірність мутації</Form.Label>
                <Col>
                  <Form.Control
                    value={evolution_values?.p_mutation}
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={(e) => {
                      evolution_values.p_mutation = Number(e.target.value);
                      this.handleChangeState(
                        "evolution_values",
                        evolution_values
                      );
                    }}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-5">
                  Ймовірність мутації гена
                </Form.Label>
                <Col>
                  <Form.Control
                    value={evolution_values?.p_genes}
                    type="number"
                    min={0}
                    max={1}
                    step={0.001}
                    onChange={(e) => {
                      evolution_values.p_genes = Number(e.target.value);
                      this.handleChangeState(
                        "evolution_values",
                        evolution_values
                      );
                    }}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-5">Елітизм</Form.Label>
                <Col>
                  <Form.Control
                    value={evolution_values?.p_elitism}
                    type="number"
                    min={0}
                    max={0.5}
                    step={0.01}
                    onChange={(e) => {
                      evolution_values.p_elitism = Number(e.target.value);
                      handleChangeState("evolution_values", evolution_values);
                    }}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <ButtonUpdateInfo
                  info={{ evolution_values }}
                  refetch={refetch}
                ></ButtonUpdateInfo>
              </Form.Group>
            </>
          </Card.Body>
          <Card.Footer>
            <Form.Group as={Row} className="my-2 mx-2">
              <ButtonRunEA id_cathedra={id_cathedra}></ButtonRunEA>
              <ButtonRunEACpp id_cathedra={id_cathedra}></ButtonRunEACpp>
            </Form.Group>
          </Card.Footer>
        </Card>
      </div>
    );
  }
}
