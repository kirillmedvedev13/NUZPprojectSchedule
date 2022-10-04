import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_INFO } from "./queries.js";
import ButtonUpdateInfo from "./ButtonUpdateInfo.js";

function DataForm({ handleChangeSomeValues, info }) {
  const { loading, error, data, refetch } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let general_values = JSON.parse(data.GetInfo.general_values);
  let objectName = "general_values";
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
              handleChangeSomeValues(
                objectName,
                "penaltyGrWin",
                e ? Number(e.target.value) : null
              );
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
              handleChangeSomeValues(
                objectName,
                "penaltyTeachWin",
                e ? Number(e.target.value) : null
              );
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
              handleChangeSomeValues(
                objectName,
                "penaltyLateSc",
                e ? Number(e.target.value) : null
              );
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
              handleChangeSomeValues(
                objectName,
                "penaltyEqSc",
                e ? Number(e.target.value) : null
              );
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
              handleChangeSomeValues(
                objectName,
                "penaltySameTimesSc",
                e ? Number(e.target.value) : null
              );
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
              handleChangeSomeValues(
                objectName,
                "penaltySameRecSc",
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

export default class FormGeneralValues extends React.Component {
  render() {
    const { handleChangeSomeValues, info } = this.props;
    return (
      <div className="d-flex justify-content-center  ">
        <Card className="my-2">
          <Card.Header className="text-center">
            Загальні дані для алгоритмів
          </Card.Header>
          <Card.Body>
            <DataForm
              handleChangeSomeValues={handleChangeSomeValues}
              info={info}
            ></DataForm>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
