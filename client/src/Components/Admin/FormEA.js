import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { GET_FITNESS, GET_INFO } from "./queries.js";
import { UPDATE_INFO } from "./mutations.js";
import { CreateNotification } from "../Alert.js";

function ButtonUpdateInfo({ info }) {
  const [UpdateInfo, { loading, error }] = useMutation(UPDATE_INFO, {
    refetchQueries: GET_INFO,
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let data = [];
  for (const [key, value] of Object.entries(info)) {
    if (value !== null) data.push({ key, value });
  }
  return (
    <div className="my-2 mx-2 d-flex justify-content-center">
      <Button
        className="col-12"
        onClick={(e) => {
          if (data.length === 0) return;
          else
            UpdateInfo({ variables: { data: JSON.stringify(data) } }).then(
              (res) => {
                CreateNotification(res.data.UpdateInfo);
              }
            );
        }}
      >
        Оновити данi
      </Button>
    </div>
  );
}
function ButtonGetFitness() {
  const { loading, error, data } = useQuery(GET_FITNESS, {});
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <div className="my-2 mx-2 d-flex justify-content-center">
      <Button
        className="col-12"
        onClick={() => {
          CreateNotification(data.GetFitness);
        }}
      >
        Отримати значення фітнес
      </Button>
    </div>
  );
}

function DataForm({ handleChangeInfo, handleSetInfo }) {
  const { loading, error, data } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <div onLoad={(e) => handleSetInfo(data.GetInfo)}>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Розмір популяції</Form.Label>
        <Col>
          <Form.Control
            defaultValue={data.GetInfo.population_size}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "population_size",
                e ? Number(e.target.value) : null
              );
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Кількість популяцій</Form.Label>
        <Col>
          <Form.Control
            defaultValue={data.GetInfo.max_generations}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
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
            defaultValue={data.GetInfo.p_crossover}
            type="number"
            min={0}
            max={1}
            step={0.05}
            onChange={(e) => {
              handleChangeInfo(
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
            defaultValue={data.GetInfo.p_mutation}
            type="number"
            min={0}
            max={1}
            step={0.05}
            onChange={(e) => {
              handleChangeInfo("p_mutation", e ? Number(e.target.value) : null);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Ймовірність мутації генів</Form.Label>
        <Col>
          <Form.Control
            defaultValue={data.GetInfo.p_genes}
            type="number"
            min={0}
            max={1}
            step={0.001}
            onChange={(e) => {
              handleChangeInfo("p_genes", e ? Number(e.target.value) : null);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Елітизм</Form.Label>
        <Col>
          <Form.Control
            defaultValue={data.GetInfo.p_elitism}
            type="number"
            min={0}
            max={0.5}
            step={0.01}
            onChange={(e) => {
              handleChangeInfo("p_elitism", e ? Number(e.target.value) : null);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вікно в групи</Form.Label>
        <Col>
          <Form.Control
            defaultValue={data.GetInfo.penaltyGrWin}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "penaltyGrWin",
                e ? Number(e.target.value) : null
              );
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вікно в викладача</Form.Label>
        <Col>
          <Form.Control
            defaultValue={data.GetInfo.penaltyTeachWin}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "penaltyTeachWin",
                e ? Number(e.target.value) : null
              );
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Пізні заняття</Form.Label>
        <Col>
          <Form.Control
            defaultValue={data.GetInfo.penaltyLateSc}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "penaltyLateSc",
                e ? Number(e.target.value) : null
              );
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Рівномірний розклад</Form.Label>
        <Col>
          <Form.Control
            defaultValue={data.GetInfo.penaltyEqSc}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "penaltyEqSc",
                e ? Number(e.target.value) : null
              );
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Накладання занять</Form.Label>
        <Col>
          <Form.Control
            defaultValue={data.GetInfo.penaltySameTimesSc}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "penaltySameTimesSc",
                e ? Number(e.target.value) : null
              );
            }}
          />
        </Col>
      </Form.Group>
    </div>
  );
}

export default class FormEA extends React.Component {
  render() {
    const { handleChangeInfo, handleSetInfo, info } = this.props;
    console.log(info);
    return (
      <Form>
        <DataForm
          handleChangeInfo={handleChangeInfo}
          handleSetInfo={handleSetInfo}
        ></DataForm>
        <ButtonUpdateInfo info={info}></ButtonUpdateInfo>
        <ButtonGetFitness></ButtonGetFitness>
      </Form>
    );
  }
}
