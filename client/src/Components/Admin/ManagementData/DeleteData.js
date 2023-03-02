import React from "react";
import { Form, Row, Card } from "react-bootstrap";
import ButtonDeleteAllData from "./ButtonDeleteAllData.js"
import SelectCathedra from "../SelectCathedra.js";

export default class DeleteData extends React.Component {
    constructor(args) {
        super(args);
        this.state = {
            id_cathedra: null,
        }
    }

    handleChangeState = (name, item) => {
        this.setState({ [name]: item });
    };

    render() {
        return (
            <div className="m-2">
                    <Card>
                        <Card.Header className="d-flex justify-content-center m-2">
                            Видалення даних
                        </Card.Header>
                        <Card.Body>
                            <Form.Group as={Row} className=" mx-2">
                                <SelectCathedra
                                    id_cathedra={this.state.id_cathedra}
                                    handleChangeState={this.handleChangeState}
                                ></SelectCathedra>
                            </Form.Group>
                        </Card.Body>
                        <Card.Footer>
                            <Form.Group as={Row} className="my-2 mx-4">
                                <ButtonDeleteAllData
                                    id_cathedra={this.state.id_cathedra}
                                ></ButtonDeleteAllData>
                            </Form.Group>
                        </Card.Footer>
                    </Card>
            </div>
        );
    }
}
