import React from "react";
import { Form, Row, Card } from "react-bootstrap";
import SelectCathedra from "../SelectCathedra.js";
import ButtonRunSA from "./ButtonRunSA.js";
import NaviBarAdmin from "../NaviBarAdmin.js";

export default class SimpleAlgorithm extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      id_cathedra: null,
      evolution_values: null,
    };
  }

  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };
  render() {
    return (
      <>
        <NaviBarAdmin></NaviBarAdmin>
        <div className="d-flex justify-content-center  ">
          <Card className="my-2">
            <Card.Header className="text-center">
              Складання розкладу за Алгоритму перебору
            </Card.Header>
            <Card.Footer>
              <Form.Group as={Row} className="my-2 mx-2">
                <SelectCathedra
                  handleChangeState={this.handleChangeState}
                  id_cathedra={this.state.id_cathedra}
                ></SelectCathedra>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <ButtonRunSA id_cathedra={this.state.id_cathedra}></ButtonRunSA>
              </Form.Group>
            </Card.Footer>
          </Card>
        </div>
      </>
    );
  }
}
