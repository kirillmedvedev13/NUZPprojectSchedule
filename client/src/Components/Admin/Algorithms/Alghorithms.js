import React from "react";
import { Form, Row, Card } from "react-bootstrap";
import SelectCathedra from "../SelectCathedra.js";
import NaviBarAdmin from "../NaviBarAdmin.js";
import EvolutionAlgorithm from "./EvolutionAlghorithm.js";
import SimpleAlgorithm from "./SimpleAlgorithm.js";
import SimulatedAnnealing from "./SimulatedAnnealing.js";
import SelectAlgoritm from "./SelectAlgorithm.js";
import { GET_ALL_ALGORITHM, GET_INFO } from "../queries";
import { useQuery } from "@apollo/client";
import MultiCharts from "./MultiCharts.js";
import ButtonRunAlgorithm from "./ButtonRunAlgorithm.js";

function CardAlgorithm({ state, handleChangeState }) {
  const { loading, error, data, refetch } = useQuery(GET_ALL_ALGORITHM);
  if (loading) return null;
  if (error) return `Error! ${error}`;

  return;
  <>
    <div className="d-flex justify-content-center">
      <Card className="my-2">
        <Card.Header className="text-center">Вибір алгоритму</Card.Header>
        <Card.Footer>
          <Form.Group as={Row} className="my-2 mx-2">
            <SelectAlgoritm
              data={data}
              handleChangeState={handleChangeState}
            ></SelectAlgoritm>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2">
            <ButtonRunAlgorithm
              name={state.nameAlgorithm}
              id_cathedra={state.id_cathedra}
            ></ButtonRunAlgorithm>
          </Form.Group>
        </Card.Footer>
      </Card>
    </div>

    <GetAlgorithmForm
      state={state}
      handleChangeState={handleChangeState}
      refetch={refetch}
    ></GetAlgorithmForm>
  </>;
}

function GetAlgorithmForm({ state, handleChangeState }) {
  let alg;

  switch (state.nameAlgorithm) {
    case "evolution_algorithm":
      alg = (
        <div className="d-flex justify-content-center">
          <EvolutionAlgorithm
            id_cathedra={id_cathedra}
            params={evolution_values}
            refetch={refetch}
            handleChangeState={handleChangeState}
          ></EvolutionAlgorithm>
        </div>
      );
      break;
    case "simulated_annealing":
      if (simulated_annealing === null) {
        simulated_annealing = JSON.parse(data.GetInfo.simulated_annealing);
      }
      if (!simulated_annealing) {
        simulated_annealing = {};
      }
      alg = (
        <div className="d-flex justify-content-center">
          <SimulatedAnnealing
            id_cathedra={id_cathedra}
            simulated_annealing={simulated_annealing}
            refetch={refetch}
            handleChangeState={handleChangeState}
          ></SimulatedAnnealing>
        </div>
      );
      break;
    default:
      <div className="d-flex justify-content-center">
        <SimpleAlgorithm id_cathedra={id_cathedra}></SimpleAlgorithm>
      </div>;
  }
  alg = (
    <>
      ${alg} +
      <div className="d-flex justify-content-center">
        <MultiCharts results={data.GetInfo.results}></MultiCharts>
      </div>
    </>
  );
  return alg;
}

export default class Algorithms extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      id_cathedra: null,
      nameAlgorithm: null,
      params: null,
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
          </Card>
        </div>
        <CardAlgorithm
          state={this.state}
          handleChangeState={this.handleChangeState}
        />
      </>
    );
  }
}
