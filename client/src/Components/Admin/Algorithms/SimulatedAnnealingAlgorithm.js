import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_INFO } from "../queries.js";
import ButtonUpdateInfo from "../ButtonUpdateInfo.js";
import ButtonRunSimulatedAnnealingAlgorithm from "./ButtonRunSimulatedAnnealingAlgorithm.js";

function DataForm({ handleChangeState, info }) {
  const { loading, error, data, refetch } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let simulated_annealing =
    info.simulated_annealing !== null
      ? info.simulated_annealing
      : JSON.parse(data.GetInfo.simulated_annealing);
  if (!simulated_annealing) {
    simulated_annealing = {};
  }
  return (
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
        <ButtonUpdateInfo info={info} refetch={refetch}></ButtonUpdateInfo>
      </Form.Group>
    </>
  );
}

export default class SimulatedAnnealingAlgorithm extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      simulated_annealing: null,
    };
  }

  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };

  render() {
    const { id_cathedra } = this.props;
    return (
      <>
        <div className="d-flex justify-content-center mx-5">
          <Card className="my-2">
            <Card.Header className="text-center">
              Складання розкладу за допомогою Імітації відпалу
            </Card.Header>
            <Card.Body>
              <DataForm
                handleChangeState={this.handleChangeState}
                info={this.state}
              ></DataForm>
            </Card.Body>
            <Card.Footer>
              <Form.Group as={Row} className="my-2 mx-2">
                <ButtonRunSimulatedAnnealingAlgorithm
                  id_cathedra={id_cathedra}
                ></ButtonRunSimulatedAnnealingAlgorithm>
              </Form.Group>
            </Card.Footer>
          </Card>
        </div>
      </>
    );
  }
}
