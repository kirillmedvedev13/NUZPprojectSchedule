import React from "react";
import { Form, Row, Card } from "react-bootstrap";
import SelectCathedra from "../SelectCathedra.js";
import NaviBarAdmin from "../NaviBarAdmin.js";
import EvolutionAlgorithm from "./EvolutionAlghorithm.js";
import SimpleAlgorithm from "./SimpleAlgorithm.js";
import SimulatedAnnealingAlgorithm from "./SimulatedAnnealingAlgorithm.js";
import SelectAlgoritm from "./SelectAlgorithm.js";
import { GET_INFO } from "../queries";
import { useQuery } from "@apollo/client";
import { FragmentsOnCompositeTypesRule } from "graphql";
import MultiCharts from "./MultiCharts.js";

function GetAlgorithmForm({ state, handleChangeState }) {
  let { id_cathedra, algorithm, evolution_values, simulated_annealing } = state;
  const { loading, error, data, refetch } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;

  switch (algorithm) {
    case "evolution_algorithm":
      if (evolution_values === null) {
        evolution_values = JSON.parse(data.GetInfo.evolution_values);
      }
      if (!evolution_values) {
        evolution_values = {};
      }
      return (
        <>
          <div className="d-flex justify-content-center">
            <EvolutionAlgorithm
              id_cathedra={id_cathedra}
              evolution_values={evolution_values}
              refetch={refetch}
              handleChangeState={handleChangeState}
            ></EvolutionAlgorithm>
          </div>
          <div className="d-flex justify-content-center">
            <MultiCharts results={data.GetInfo.results}></MultiCharts>
          </div>
        </>
      );
    case "simulated_annealing":
      if (simulated_annealing === null) {
        simulated_annealing = JSON.parse(data.GetInfo.simulated_annealing);
      }
      if (!simulated_annealing) {
        simulated_annealing = {};
      }
      return (
        <>
          <div className="d-flex justify-content-center">
            <SimulatedAnnealingAlgorithm
              id_cathedra={id_cathedra}
              simulated_annealing={simulated_annealing}
              refetch={refetch}
              handleChangeState={handleChangeState}
            ></SimulatedAnnealingAlgorithm>
          </div>
          <div className="d-flex justify-content-center">
            <MultiCharts results={data.GetInfo.results}></MultiCharts>
          </div>
        </>
      );
    default:
      return (
        <>
          <div className="d-flex justify-content-center">
            <SimpleAlgorithm id_cathedra={id_cathedra}></SimpleAlgorithm>
          </div>
          <div className="d-flex justify-content-center">
            <MultiCharts results={data.GetInfo.results}></MultiCharts>
          </div>
        </>
      );
  }
}

export default class Algorithms extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      id_cathedra: null,
      algorithm: null,
      evolution_values: null,
      simulated_annealing: null,
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

        <GetAlgorithmForm
          state={this.state}
          handleChangeState={this.handleChangeState}
        ></GetAlgorithmForm>

        <div className="d-flex justify-content-center"></div>
      </>
    );
  }
}
