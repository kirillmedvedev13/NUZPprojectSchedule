import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import SelectCathedras from "./SelectCathedras";
import SaveButton from "./SaveButton";
import ValidatedMessage from "../ValidatedMessage";

class SpecialtyModal extends React.Component {
  defState = {
    validatedName: true,
    validatedCathedra: true,
    validatedCode: true,
  };
  state = this.defState;

  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };
  handleIncCounter = (name) => {
    this.setState((prevState) => ({ [name]: prevState[name] + 1 }));
  };

  handleClose = () => {
    this.setState(this.defSate);
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
              {item.id
                ? "Редагувати запис спеціальності"
                : "Створити запис спеціальності"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Назва спеціальності</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Спеціальність"
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
                <Form.Label className="col-2">Код спеціальності</Form.Label>
                <Col>
                  <Form.Control
                    type="number"
                    required
                    placeholder="Код спеціальності"
                    value={item.code}
                    onChange={(e) => {
                      handleChangeItem("code", e.target.value);
                      this.handleChangeState("validatedCode", true);
                    }}
                  ></Form.Control>
                  {!this.state.validatedCode && (
                    <ValidatedMessage message="Пусте поле кода кафедри"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Назва кафедри</Form.Label>
                <Col>
                  <SelectCathedras
                    handleChangeItem={handleChangeItem}
                    handleChangeState={this.handleChangeState}
                    item={item}
                  ></SelectCathedras>
                  {!this.state.validatedCathedra && (
                    <ValidatedMessage message="Кафедра не вибрана"></ValidatedMessage>
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

export default SpecialtyModal;
