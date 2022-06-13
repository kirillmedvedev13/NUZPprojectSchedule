import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import SaveButton from "./SaveButton";
import ValidatedMessage from "../ValidatedMessage";

class CathedraModal extends React.Component {
  defState = {
    validatedName: true,
    validatedShortName: true,
  };

  state = this.defState;

  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };

  handleClose = () => {
    this.setState(this.defSate);
    this.props.handleCloseModal();
    this.props.refetch();
  };

  render() {
    const { isopen, handleChangeItem, item } = this.props;
    console.log(item);
    return (
      <>
        <Modal size="lg" show={isopen} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {item.id ? "Редагувати запис кафедри" : "Створити запис кафедри"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Назва кафедри</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Кафедра"
                    value={item.name}
                    onChange={(e) => {
                      handleChangeItem("name", e.target.value);
                      this.handleChangeState("validatedName", true);
                    }}
                  ></Form.Control>
                  {!this.state.validatedName && (
                    <ValidatedMessage message="Пусте поле назви кафедри"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Скорочена назва</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Скорочена назва"
                    value={item.short_name}
                    onChange={(e) => {
                      handleChangeItem("short_name", e.target.value);
                      this.handleChangeState("validatedShortName", true);
                    }}
                  ></Form.Control>
                  {!this.state.validatedShortName && (
                    <ValidatedMessage message="Пусте поле скороченої назви кафедри"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Закрити
            </Button>
            <SaveButton
              item={item}
              handleCloseModal={this.handleClose}
              handleChangeState={this.handleChangeState}
            ></SaveButton>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default CathedraModal;
