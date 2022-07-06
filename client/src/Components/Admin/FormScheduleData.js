import ButtonCalcFitness from "./ButtonCalcFitness";
import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { GET_INFO } from "./queries.js";
import ButtonUpdateInfo from "./ButtonUpdateInfo.js";

function DataForm({ handleChangeInfo, info }) {
  const { loading, error, data, refetch } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let fitnessValue = JSON.parse(data.GetInfo.fitness_value);
  return (
    <>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Загальний фітнес</Form.Label>
        <Col>
          <Form.Control defaultValue={fitnessValue.fitnessValue} readOnly />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Фітнес рек. час</Form.Label>
        <Col>
          <Form.Control defaultValue={fitnessValue.fitnessSameRecSc} readOnly />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Фітнес груп:</Form.Label>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Загальний</Form.Label>
        <Col>
          <Form.Control
            defaultValue={fitnessValue.fitnessGr.fitnessValue}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вікна</Form.Label>
        <Col>
          <Form.Control
            defaultValue={fitnessValue.fitnessGr.fitnessGrWin}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Накладання занять</Form.Label>
        <Col>
          <Form.Control
            defaultValue={fitnessValue.fitnessGr.fitnessSameTimesSc}
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
            defaultValue={fitnessValue.fitnessTeach.fitnessValue}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вікна</Form.Label>
        <Col>
          <Form.Control
            defaultValue={fitnessValue.fitnessTeach.fitnessTeachWin}
            readOnly
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Накладання занять</Form.Label>
        <Col>
          <Form.Control
            defaultValue={fitnessValue.fitnessTeach.fitnessSameTimesSc}
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
            defaultValue={fitnessValue.fitnessAud.fitnessSameTimesSc}
            readOnly
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Кількість днів</Form.Label>
        <Col>
          <Form.Control
            defaultValue={data.GetInfo.max_day}
            type="number"
            min={1}
            max={7}
            onChange={(e) => {
              handleChangeInfo("max_day", e ? Number(e.target.value) : null);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Кількість занять</Form.Label>
        <Col>
          <Form.Control
            defaultValue={data.GetInfo.max_pair}
            type="number"
            min={1}
            max={8}
            onChange={(e) => {
              handleChangeInfo("max_pair", e ? Number(e.target.value) : null);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <ButtonCalcFitness refetch={refetch}></ButtonCalcFitness>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <ButtonUpdateInfo info={info} refetch={refetch}></ButtonUpdateInfo>
      </Form.Group>
    </>
  );
}
export default class FormScheduleData extends React.Component {
  render() {
    const { handleChangeInfo, info } = this.props;
    return (
      <div className="d-flex justify-content-center  ">
        <Card className="my-2">
          <Card.Header className="text-center">
            Дані про поточний розклад
          </Card.Header>
          <Card.Body>
            <DataForm
              handleChangeInfo={handleChangeInfo}
              info={info}
            ></DataForm>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
