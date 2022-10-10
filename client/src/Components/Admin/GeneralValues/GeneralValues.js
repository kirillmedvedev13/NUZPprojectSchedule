import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_INFO } from "../queries.js";
import ButtonUpdateInfo from "../ButtonUpdateInfo.js";
import NaviBarAdmin from "../NaviBarAdmin.js";

function DataForm({ handleChangeState, info }) {
  const { loading, error, data, refetch } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let general_values =
    info.general_values !== null
      ? info.general_values
      : JSON.parse(data.GetInfo.general_values);
  return (
    <>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вага: вікна групи</Form.Label>
        <Col>
          <Form.Control
            defaultValue={general_values.penaltyGrWin}
            type="number"
            min={0}
            onChange={(e) => {
              general_values.penaltyGrWin = Number(e.target.value);
              handleChangeState("general_values", general_values);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вага: вікна викладачiв</Form.Label>
        <Col>
          <Form.Control
            defaultValue={general_values.penaltyTeachWin}
            type="number"
            min={0}
            onChange={(e) => {
              general_values.penaltyTeachWin = Number(e.target.value);
              handleChangeState("general_values", general_values);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вага: пізні заняття</Form.Label>
        <Col>
          <Form.Control
            defaultValue={general_values.penaltyLateSc}
            type="number"
            min={0}
            onChange={(e) => {
              general_values.penaltyLateSc = Number(e.target.value);
              handleChangeState("general_values", general_values);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вага: рівномірний розклад</Form.Label>
        <Col>
          <Form.Control
            defaultValue={general_values.penaltyEqSc}
            type="number"
            min={0}
            onChange={(e) => {
              general_values.penaltyEqSc = Number(e.target.value);
              handleChangeState("general_values", general_values);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вага: накладання занять</Form.Label>
        <Col>
          <Form.Control
            defaultValue={general_values.penaltySameTimesSc}
            type="number"
            min={0}
            onChange={(e) => {
              general_values.penaltySameTimesSc = Number(e.target.value);
              handleChangeState("general_values", general_values);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вага: співпадіння занять</Form.Label>
        <Col>
          <Form.Control
            defaultValue={general_values.penaltySameRecSc}
            type="number"
            min={0}
            onChange={(e) => {
              general_values.penaltySameRecSc = Number(e.target.value);
              handleChangeState("general_values", general_values);
            }}
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
              handleChangeState("max_day", e ? Number(e.target.value) : null);
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
              handleChangeState("max_pair", e ? Number(e.target.value) : null);
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

export default class GeneralValues extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      general_values: null,
      max_pair: null,
      max_day: null,
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
              Загальні дані для алгоритмів
            </Card.Header>
            <Card.Body>
              <DataForm
                handleChangeState={this.handleChangeState}
                info={this.state}
              ></DataForm>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }
}
