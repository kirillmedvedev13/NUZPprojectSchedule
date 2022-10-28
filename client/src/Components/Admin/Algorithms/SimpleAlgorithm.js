import React from "react";
import { Form, Row, Card } from "react-bootstrap";
import ButtonRunSA from "./ButtonRunSA.js";

export default class SimpleAlgorithm extends React.Component {
  render() {
    let { id_cathedra } = this.props;
    return (
      <>
        <div className="d-flex justify-content-center mx-5">
          <Card className="my-2">
            <Card.Header className="text-center">
              Складання розкладу за Алгоритму перебору
            </Card.Header>
            <Card.Footer>
              <Form.Group as={Row} className="my-2 mx-2">
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <ButtonRunSA id_cathedra={id_cathedra}></ButtonRunSA>
              </Form.Group>
            </Card.Footer>
          </Card>
        </div>
      </>
    );
  }
}
