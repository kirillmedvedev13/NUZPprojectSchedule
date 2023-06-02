import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_INFO } from "../queries.js";
import ButtonUpdateInfo from "../ButtonUpdateInfo.js";

function DataForm({ handleChangeState, info }) {
  const { loading, error, data, refetch } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let general_values =
    info.general_values !== null
      ? info.general_values
      : JSON.parse(data.GetInfo.general_values);
  let max_day = info.max_day !== null ? info.max_day : data.GetInfo.max_day;
  let max_pair = info.max_pair !== null ? info.max_pair : data.GetInfo.max_pair;
  if (!general_values) {
    general_values = {};
  }
  return (
    <>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Вага: вікна групи</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={general_values?.penaltyGrWin}
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
        <Form.Label className="col-md-3">Вага: вікна викладачiв</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={general_values?.penaltyTeachWin}
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
        <Form.Label className="col-md-3">Вага: пізні заняття</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={general_values?.penaltyLateSc}
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
        <Form.Label className="col-md-3">Вага: рівномірний розклад</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={general_values?.penaltyEqSc}
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
        <Form.Label className="col-md-3">Вага: накладання занять</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={general_values?.penaltySameTimesSc}
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
        <Form.Label className="col-md-3">Вага: співпадіння занять</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={general_values?.penaltySameRecSc}
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
        <Form.Label className="col-md-3">Кількість днів</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={max_day}
            type="number"
            min={1}
            onChange={(e) => {
              handleChangeState("max_day", e.target.value);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-md-3">Кількість занять</Form.Label>
        <Col className="col-md-9">
          <Form.Control
            value={max_pair}
            type="number"
            min={1}
            onChange={(e) => {
              handleChangeState("max_pair", e.target.value);
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
  componentDidMount() {
    document.title = this.props.title;
  }
  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };

  render() {
    return (
      <>
        <div className="col-md-6 offset-md-3">
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
