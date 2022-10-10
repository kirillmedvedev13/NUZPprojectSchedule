import ButtonCalcFitness from "./ButtonCalcFitness";
import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_INFO } from "../queries.js";
import NaviBarAdmin from "../NaviBarAdmin.js";

function DataForm() {
  const { loading, error, data, refetch } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let fitnessValue = data.GetInfo.fitness_value;
  fitnessValue = JSON.parse(fitnessValue);
  return (
    <>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Загальний фітнес</Form.Label>
        <Col>
          <Form.Control defaultValue={fitnessValue?.fitnessValue} readOnly />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Фітнес рек. час</Form.Label>
        <Col>
          <Form.Control
            defaultValue={fitnessValue?.fitnessSameRecSc}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Фітнес груп:</Form.Label>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Загальний</Form.Label>
        <Col>
          <Form.Control
            defaultValue={fitnessValue?.fitnessGr.fitnessValue}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вікна</Form.Label>
        <Col>
          <Form.Control
            defaultValue={fitnessValue?.fitnessGr.fitnessGrWin}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Накладання занять</Form.Label>
        <Col>
          <Form.Control
            defaultValue={fitnessValue?.fitnessGr.fitnessSameTimesSc}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Фітнес викладачів:</Form.Label>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Загальний</Form.Label>
        <Col>
          <Form.Control
            defaultValue={fitnessValue?.fitnessTeach.fitnessValue}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вікна</Form.Label>
        <Col>
          <Form.Control
            defaultValue={fitnessValue?.fitnessTeach.fitnessTeachWin}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Накладання занять</Form.Label>
        <Col>
          <Form.Control
            defaultValue={fitnessValue?.fitnessTeach.fitnessSameTimesSc}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Фітнес аудиторій:</Form.Label>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Накладання занять</Form.Label>
        <Col>
          <Form.Control
            defaultValue={fitnessValue?.fitnessAud.fitnessSameTimesSc}
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
        <NaviBarAdmin></NaviBarAdmin>
        <div className="d-flex justify-content-center  ">
          <Card className="my-2">
            <Card.Header className="text-center">
              Дані про поточний розклад
            </Card.Header>
            <Card.Body>
              <DataForm></DataForm>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }
}
