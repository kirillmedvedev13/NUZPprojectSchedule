import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_INFO } from "./queries.js";
import ButtonUpdateInfo from "./ButtonUpdateInfo.js";

function DataForm({ handleChangeSomeValues, info }) {
  const { loading, error, data, refetch } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let evolution_values = JSON.parse(data.GetInfo.evolution_values);
  let objectName = "evolution_values";
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
              handleChangeSomeValues(
                objectName,
                "population_size",
                e ? Number(e.target.value) : null
              );
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
              handleChangeSomeValues(
                objectName,
                "max_generations",
                e ? Number(e.target.value) : null
              );
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
              handleChangeSomeValues(
                objectName,
                "p_crossover",
                e ? Number(e.target.value) : null
              );
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
              handleChangeSomeValues(
                objectName,
                "p_mutation",
                e ? Number(e.target.value) : null
              );
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
              handleChangeSomeValues(
                objectName,
                "p_genes",
                e ? Number(e.target.value) : null
              );
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
              handleChangeSomeValues(
                objectName,
                "p_elitism",
                e ? Number(e.target.value) : null
              );
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

export default class FormEA extends React.Component {
  render() {
    const { handleChangeSomeValues, info } = this.props;
    return (
      <Form>
        <DataForm
          handleChangeSomeValues={handleChangeSomeValues}
          info={info}
        ></DataForm>
      </Form>
    );
  }
}
