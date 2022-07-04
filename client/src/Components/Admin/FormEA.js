import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { GET_INFO } from "./queries.js";
import { UPDATE_INFO, CALC_FITNESS } from "./mutations.js";
import { CreateNotification } from "../Alert.js";

function ButtonUpdateInfo({ info, refetch }) {
  const [UpdateInfo, { loading, error }] = useMutation(UPDATE_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let data = [];
  for (const [key, value] of Object.entries(info)) {
    if (value != null) data.push({ key, value });
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
                refetch();
              }
            );
        }}
      >
        Оновити данi
      </Button>
    </div>
  );
}
function ButtonCalcFitness({ refetch }) {
  const [CalcFitness, { loading, error }] = useMutation(CALC_FITNESS);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <div className="my-2 mx-2 d-flex justify-content-center">
      <Button
        className="col-12"
        onClick={() => {
          CalcFitness().then((res) => {
            CreateNotification(res.data.CalcFitness);
            refetch();
          });
        }}
      >
        Порахувати значення фiтнес
      </Button>
    </div>
  );
}

function DataForm({ handleChangeInfo, info }) {
  const { loading, error, data, refetch } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <>
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
        <Form.Label className="col-5">
          Максимальна кiлькiсть iтерацiй
        </Form.Label>
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
        <Form.Label className="col-5">Ймовірність мутації гена</Form.Label>
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
        <Form.Label className="col-5">Вага: вікна групи</Form.Label>
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
        <Form.Label className="col-5">Вага: вікна викладачiв</Form.Label>
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
        <Form.Label className="col-5">Вага: пізні заняття</Form.Label>
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
        <Form.Label className="col-5">Вага: рівномірний розклад</Form.Label>
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
        <Form.Label className="col-5">Вага: накладання занять</Form.Label>
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
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вага: співпадіння занять</Form.Label>
        <Col>
          <Form.Control
            defaultValue={data.GetInfo.penaltySameRecSc}
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeInfo(
                "penaltySameRecSc",
                e ? Number(e.target.value) : null
              );
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
        <Form.Label className="col-5">Фітнес значення</Form.Label>
        <Col>
          <div>
            {data.GetInfo.fitness_value === null ? (
              <p></p>
            ) : (
              <pre>{data.GetInfo.fitness_value} </pre>
            )}
          </div>
        </Col>
      </Form.Group>
      <ButtonUpdateInfo info={info} refetch={refetch}></ButtonUpdateInfo>
      <ButtonCalcFitness refetch={refetch}></ButtonCalcFitness>
    </>
  );
}

export default class FormEA extends React.Component {
  render() {
    const { handleChangeInfo, info } = this.props;
    return (
      <Form>
        <DataForm handleChangeInfo={handleChangeInfo} info={info}></DataForm>
      </Form>
    );
  }
}
