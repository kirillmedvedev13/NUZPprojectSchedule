import React from "react";
import { Form, Row, Col, Button, } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { GET_INFO } from "./queries.js";
import { UPDATE_INFO } from "./mutations.js"
import { CreateNotification } from "../Alert.js"

function UpdateInfo({ info }) {
  const [update_info, { loading, error }] = useMutation(UPDATE_INFO, { refetchQueries: GET_INFO });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  console.log(info)
  return (
    <div className="my-2 mx-2 d-flex justify-content-center">
      <Button onClick={(e) => {
        update_info(info).then((res) => {
          CreateNotification(res.data.UpdateInfo);
        })
      }
      }
      >
        Оновити данi</Button>
    </div>
  )
}

function DataForm({ handleChangeInfo, handleSetInfo }) {
  const { loading, error, data } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  console.log(data.GetInfo)

  return (
    <div onLoad={(e) => handleSetInfo(data.GetInfo)}>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Розмір популяції</Form.Label>
        <Col>
          <Form.Control
            value={data.GetInfo.population_size}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "population_size",
                e ? Number(e.target.value) : 0
              );
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Кількість популяцій</Form.Label>
        <Col>
          <Form.Control
            value={data.GetInfo.max_generations}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "max_generations",
                e ? Number(e.target.value) : 0
              );
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Ймовірність схрещування</Form.Label>
        <Col>
          <Form.Control
            value={data.GetInfo.p_crossover}
            type="number"
            min={0}
            max={1}
            step={0.05}
            onChange={(e) => {
              handleChangeInfo(
                "p_crossover", e ? Number(e.target.value) : 0
              );
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Ймовірність мутації</Form.Label>
        <Col>
          <Form.Control
            value={data.GetInfo.p_mutation}
            type="number"
            min={0}
            max={1}
            step={0.05}
            onChange={(e) => {
              handleChangeInfo("p_mutation", e ? Number(e.target.value) : 0);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Ймовірність мутації генів</Form.Label>
        <Col>
          <Form.Control
            value={data.GetInfo.p_genes}
            type="number"
            min={0}
            max={1}
            step={0.001}
            onChange={(e) => {
              handleChangeInfo("p_genes", e ? Number(e.target.value) : 0);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вікно в групи</Form.Label>
        <Col>
          <Form.Control
            value={data.GetInfo.penaltyGrWin}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "penaltyGrWin",
                e ? Number(e.target.value) : 0
              );
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вікно в викладача</Form.Label>
        <Col>
          <Form.Control
            value={data.GetInfo.penaltyTeachWin}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "penaltyTeachWin",
                e ? Number(e.target.value) : 0
              );
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Пізні заняття</Form.Label>
        <Col>
          <Form.Control
            value={data.GetInfo.penaltyLateSc}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "penaltyLateSc",
                e ? Number(e.target.value) : 0
              );
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Рівномірний розклад</Form.Label>
        <Col>
          <Form.Control
            value={data.GetInfo.penaltyEqSc}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "penaltyEqSc",
                e ? Number(e.target.value) : 0
              );
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Накладання занять</Form.Label>
        <Col>
          <Form.Control
            value={data.GetInfo.penaltySameTimesSc}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "penaltySameTimesSc",
                e ? Number(e.target.value) : 0
              );
            }}
          />
        </Col>
      </Form.Group>
    </div>
  )
}

export default class FormEA extends React.Component {
  render() {
    const { handleChangeInfo, handleSetInfo, info } = this.props;
    console.log(info)
    return (
      <Form>
        <DataForm handleChangeInfo={handleChangeInfo} handleSetInfo={handleSetInfo}></DataForm>
        <UpdateInfo info={info}></UpdateInfo>
      </Form>
    );
  }
}
