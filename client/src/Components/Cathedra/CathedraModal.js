import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import SaveButton from "./SaveButton";
import ValidatedMessage from "../ValidatedMessage";
import cloneDeep from "clone-deep";

class CathedraModal extends React.Component {
  defState = {
    validatedName: true, // Перевірка назви кафедри
    validatedShortName: true, // Перевірка скороченої назви
  };

  state = cloneDeep(this.defState);

  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };

  handleClose = () => {
    this.setState(cloneDeep(this.defState));
    this.props.handleCloseModal();
    this.props.refetch();
  };

  render() {
    const { isopen, handleChangeItem, item } = this.props;
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
                <Form.Label className="col-md-2">Назва кафедри</Form.Label>
                <Col className="col-md-10">
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
                <Form.Label className="col-md-2">Скорочена назва</Form.Label>
                <Col className="col-md-10">
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
            <Row className="w-100 justify-content-end mx-3">
              <Button
                className="col-md-3 mx-2 my-2"
                variant="secondary"
                onClick={this.handleClose}
              >
                Закрити
              </Button>
              <SaveButton
                item={item}
                handleCloseModal={this.handleClose}
                handleChangeState={this.handleChangeState}
              ></SaveButton>
            </Row>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default CathedraModal;
