import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_INFO } from "../queries.js";
import ButtonUpdateInfo from "../ButtonUpdateInfo.js";
import SelectCathedra from "../SelectCathedra.js";
import ButtonRunEA from "./ButtonRunEA.js";
import NaviBarAdmin from "../NaviBarAdmin.js";

function DataForm({ handleChangeState, info }) {
  const { loading, error, data, refetch } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;

  let evolution_values =
    info.evolution_values !== null
      ? info.evolution_values
      : JSON.parse(data.GetInfo.evolution_values);
  return (
    <>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Розмір популяції</Form.Label>
        <Col>
          <Form.Control
            defaultValue={evolution_values.population_size}
            type="number"
            min={0}
            onChange={(e) => {
              evolution_values.population_size = Number(e.target.value);
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
            defaultValue={evolution_values.max_generations}
            type="number"
            min={0}
            onChange={(e) => {
              evolution_values.max_generations = Number(e.target.value);
              handleChangeState("evolution_values", evolution_values);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Ймовірність схрещування</Form.Label>
        <Col>
          <Form.Control
            defaultValue={evolution_values.p_crossover}
            type="number"
            min={0}
            max={1}
            step={0.05}
            onChange={(e) => {
              evolution_values.p_crossover = Number(e.target.value);
              handleChangeState("evolution_values", evolution_values);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Ймовірність мутації</Form.Label>
        <Col>
          <Form.Control
            defaultValue={evolution_values.p_mutation}
            type="number"
            min={0}
            max={1}
            step={0.05}
            onChange={(e) => {
              evolution_values.p_mutation = Number(e.target.value);
              handleChangeState("evolution_values", evolution_values);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Ймовірність мутації гена</Form.Label>
        <Col>
          <Form.Control
            defaultValue={evolution_values.p_genes}
            type="number"
            min={0}
            max={1}
            step={0.001}
            onChange={(e) => {
              evolution_values.p_genes = Number(e.target.value);
              handleChangeState("evolution_values", evolution_values);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Елітизм</Form.Label>
        <Col>
          <Form.Control
            defaultValue={evolution_values.p_elitism}
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
        <ButtonUpdateInfo info={info} refetch={refetch}></ButtonUpdateInfo>
      </Form.Group>
    </>
  );
}

export default class EvolutionAlgorithm extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      id_cathedra: null,
      evolution_values: null,
    };
  }

  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };

  render() {
    return (
      <>
        <NaviBarAdmin></NaviBarAdmin>
        <div className="d-flex justify-content-center  ">
          <Card className="my-2">
            <Card.Header className="text-center">
              Складання розкладу за допомогою Генетичного Алгоритму
            </Card.Header>
            <Card.Body>
              <DataForm
                handleChangeState={this.handleChangeState}
                info={this.state}
              ></DataForm>
            </Card.Body>
            <Card.Footer>
              <Form.Group as={Row} className="my-2 mx-2">
                <SelectCathedra
                  handleChangeState={this.handleChangeState}
                  id_cathedra={this.state.id_cathedra}
                ></SelectCathedra>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <ButtonRunEA id_cathedra={this.state.id_cathedra}></ButtonRunEA>
              </Form.Group>
            </Card.Footer>
          </Card>
        </div>
      </>
    );
  }
}
