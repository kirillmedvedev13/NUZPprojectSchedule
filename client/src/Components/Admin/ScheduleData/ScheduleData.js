import ButtonCalcFitness from "./ButtonCalcFitness";
import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_INFO } from "../queries.js";

function DataForm() {
  const { loading, error, data, refetch } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let fitnessValue = JSON.parse(data.GetInfo.fitness_value);
  if (!fitnessValue) {
    fitnessValue = {};
  }
  return (
    <>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Загальний фітнес</Form.Label>
        <Col className="col-md-9">
          <Form.Control value={fitnessValue?.fitnessValue} readOnly />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Фітнес рек. час</Form.Label>
        <Col className="col-md-9">
          <Form.Control value={fitnessValue?.fitnessSameRecSc} readOnly />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Фітнес груп:</Form.Label>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Загальний</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={fitnessValue?.fitnessGr?.fitnessValue}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Вікна</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={fitnessValue?.fitnessGr?.fitnessGrWin}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Накладання занять</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={fitnessValue?.fitnessGr?.fitnessSameTimesSc}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Фітнес викладачів:</Form.Label>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Загальний</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={fitnessValue?.fitnessTeach?.fitnessValue}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Вікна</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={fitnessValue?.fitnessTeach?.fitnessTeachWin}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Накладання занять</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={fitnessValue?.fitnessTeach?.fitnessSameTimesSc}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Фітнес аудиторій:</Form.Label>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Накладання занять</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={fitnessValue?.fitnessAud?.fitnessSameTimesSc}
            readOnly
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="my-2 mx-2">
        <ButtonCalcFitness refetch={refetch}></ButtonCalcFitness>
      </Form.Group>
    </>
  );
}
export default class ScheduleData extends React.Component {
  render() {
    return (
      <>
        <div className="col-md-6 offset-md-3">
          <Card className="my-2">
            <Card.Header className="text-center">
              Оцінка поточного розкладу
            </Card.Header>
            <Card.Body>
              <DataForm handleChangeState={this.handleChangeState}></DataForm>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }
}
