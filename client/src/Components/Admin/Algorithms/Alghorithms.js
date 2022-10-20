import React from "react";
import { Form, Row, Card } from "react-bootstrap";
import SelectCathedra from "../SelectCathedra.js";
import NaviBarAdmin from "../NaviBarAdmin.js";
import EvolutionAlgorithm from "./EvolutionAlghorithm.js";
import SimpleAlgorithm from "./SimpleAlgorithm.js";
import SimulatedAnnealingAlgorithm from "./SimulatedAnnealingAlgorithm.js";

export default class Algorithms extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      id_cathedra: null,
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
            <Card.Header className="text-center">
              Вибір кафедри
            </Card.Header>
            <Card.Footer>
              <Form.Group as={Row} className="my-2 mx-2">
                <SelectCathedra
                  handleChangeState={this.handleChangeState}
                  id_cathedra={this.state.id_cathedra}
                ></SelectCathedra>
              </Form.Group>
            </Card.Footer>
          </Card>
        </div>
        <div className="d-flex justify-content-center">
          <EvolutionAlgorithm id_cathedra={this.state.id_cathedra}></EvolutionAlgorithm>
          <SimpleAlgorithm id_cathedra={this.state.id_cathedra}></SimpleAlgorithm>
          <SimulatedAnnealingAlgorithm id_cathedra={this.state.id_cathedra}></SimulatedAnnealingAlgorithm>
        </div>
      </>
    );
  }
}
