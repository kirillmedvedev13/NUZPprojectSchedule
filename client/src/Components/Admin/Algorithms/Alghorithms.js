import React from "react";
import { Form, Row, Card } from "react-bootstrap";
import SelectCathedra from "../SelectCathedra.js";
import NaviBarAdmin from "../NaviBarAdmin.js";
import EvolutionAlgorithm from "./EvolutionAlghorithm.js";
import SimpleAlgorithm from "./SimpleAlgorithm.js";
import SimulatedAnnealingAlgorithm from "./SimulatedAnnealingAlgorithm.js";
import SelectAlgoritm from "./SelectAlgorithm.js";
import { GET_INFO } from "../queries";

function GetAlgorithmForm({ algorithm, id_cathedra }) {
  const { loading, error, data, refetch } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  switch (algorithm) {
    case "evolution_algorithm":
      return (
        <EvolutionAlgorithm
          id_cathedra={id_cathedra}
          data={data.GetInfo}
          refetch={refetch}
        ></EvolutionAlgorithm>
      );
    case "simulated_annealing":
      return (
        <SimulatedAnnealingAlgorithm
          id_cathedra={id_cathedra}
        ></SimulatedAnnealingAlgorithm>
      );
    default:
      return <SimpleAlgorithm id_cathedra={id_cathedra}></SimpleAlgorithm>;
  }
}

export default class Algorithms extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      id_cathedra: null,
      algorithm: null,
    };
  }

  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };

  render() {
    return (
      <>
        <NaviBarAdmin></NaviBarAdmin>
        <div className="d-flex justify-content-center">
          <Card className="my-2">
            <Card.Header className="text-center">Вибір кафедри</Card.Header>
            <Card.Footer>
              <Form.Group as={Row} className="my-2 mx-2">
                <SelectCathedra
                  handleChangeState={this.handleChangeState}
                  id_cathedra={this.state.id_cathedra}
                ></SelectCathedra>
              </Form.Group>
            </Card.Footer>
            <Card.Header className="text-center">Вибір алгоритму</Card.Header>
            <Card.Footer>
              <Form.Group as={Row} className="my-2 mx-2">
                <SelectAlgoritm
                  handleChangeState={this.handleChangeState}
                ></SelectAlgoritm>
              </Form.Group>
            </Card.Footer>
          </Card>
        </div>
        <div className="d-flex justify-content-center">
          <GetAlgorithmForm
            algorithm={this.state.algorithm}
            id_cathedra={this.state.id_cathedra}
          ></GetAlgorithmForm>
        </div>
        <div className="d-flex justify-content-center"></div>
      </>
    );
  }
}
