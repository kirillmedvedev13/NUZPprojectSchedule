import React from "react";
import { Form, Row, Col } from "react-bootstrap";

export default function FormEA({ handleChangeFilters }) {
  return (
    <Form>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Розмір популяції</Form.Label>
        <Col>
          <Form.Control
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeFilters(
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
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeFilters(
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
            type="number"
            min={0}
            max={1}
            step={0.1}
            onChange={(e) => {
              handleChangeFilters(
                "p_crossover",

                e ? Number(e.target.value) : 0
              );
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Ймовірність мутації</Form.Label>
        <Col>
          <Form.Control
            type="number"
            min={0}
            max={1}
            step={0.1}
            onChange={(e) => {
              handleChangeFilters("p_mutation", e ? Number(e.target.value) : 0);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Ймовірність мутації генів</Form.Label>
        <Col>
          <Form.Control
            type="number"
            min={0}
            max={1}
            step={0.001}
            onChange={(e) => {
              handleChangeFilters("p_genes", e ? Number(e.target.value) : 0);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="my-2 mx-2">
        <Form.Label className="col-5">Вікно в групи</Form.Label>
        <Col>
          <Form.Control
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeFilters(
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
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeFilters(
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
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeFilters(
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
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeFilters(
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
            type="number"
            min={0}
            onChange={(e) => {
              handleChangeFilters(
                "penaltySameTimesSc",
                e ? Number(e.target.value) : 0
              );
            }}
          />
        </Col>
      </Form.Group>
    </Form>
  );
}
