import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import ButtonUpdateInfo from "../ButtonUpdateInfo.js";
import ButtonRunSimulatedAnnealingAlgorithm from "./ButtonRunSimulatedAnnealingAlgorithm.js";

export default class SimulatedAnnealingAlgorithm extends React.Component {
  render() {
    let { id_cathedra, refetch, handleChangeState, simulated_annealing } = this.props;
    return (
      <>
        <div className="d-flex justify-content-center mx-5">
          <Card className="my-2">
            <Card.Header className="text-center">
              Складання розкладу за допомогою Імітації відпалу
            </Card.Header>
            <Card.Body>
              <>
                <Form.Group as={Row} className="my-2 mx-2">
                  <Form.Label className="col-5">Початкова температура</Form.Label>
                  <Col>
                    <Form.Control
                      value={simulated_annealing?.temperature}
                      type="number"
                      min={0}
                      onChange={(e) => {
                        simulated_annealing.temperature = Number(e.target.value);
                        handleChangeState("simulated_annealing", simulated_annealing);
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="my-2 mx-2">
                  <Form.Label className="col-5">Коефіцієнт alpha</Form.Label>
                  <Col>
                    <Form.Control
                      value={simulated_annealing?.alpha}
                      type="number"
                      min={0}
                      onChange={(e) => {
                        simulated_annealing.alpha = Number(e.target.value);
                        handleChangeState("simulated_annealing", simulated_annealing);
                      }}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="my-2 mx-2">
                  <ButtonUpdateInfo info={{ simulated_annealing }} refetch={refetch}></ButtonUpdateInfo>
                </Form.Group>
              </>
            </Card.Body>
            <Card.Footer>
              <Form.Group as={Row} className="my-2 mx-2">
                <ButtonRunSimulatedAnnealingAlgorithm
                  id_cathedra={id_cathedra} refetch={refetch}
                ></ButtonRunSimulatedAnnealingAlgorithm>
              </Form.Group>
            </Card.Footer>
          </Card>
        </div>
      </>
    );
  }
}
