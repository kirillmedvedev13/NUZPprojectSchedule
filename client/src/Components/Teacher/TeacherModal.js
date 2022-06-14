import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import SaveButton from "./SaveButton";
import SelectCathedras from "./SelectCathedras";
import ValidatedMessage from "../ValidatedMessage";

class TeacherModal extends React.Component {
  defState = {
    validatedName: true,
    validatedSurname: true,
    validatedPatronymic: true,
    validatedCathedra: true,
  };
  state = this.defState;

  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };
  handleIncCounter = (name) => {
    this.setState((prevState) => ({ [name]: prevState[name] + 1 }));
  };

  handleClose = () => {
    this.setState(this.defState);
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
                ? "Редагувати запис викладача"
                : "Створити запис викладача"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Ім'я</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Ім'я"
                    value={item.name}
                    onChange={(e) => {
                      handleChangeItem("name", e.target.value);
                      this.handleChangeState("validatedName", true);
                    }}
                  ></Form.Control>
                  {!this.state.validatedName && (
                    <ValidatedMessage message="Пусте поле імені викладача"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Прізвище</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Прізвище"
                    value={item.surname}
                    onChange={(e) => {
                      handleChangeItem("surname", e.target.value);
                      this.handleChangeState("validatedSurname", true);
                    }}
                  ></Form.Control>
                  {!this.state.validatedSurname && (
                    <ValidatedMessage message="Пусте поле прізвища викладачи"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">По-батькові</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="По-батькові"
                    value={item.patronymic}
                    onChange={(e) => {
                      handleChangeItem("patronymic", e.target.value);
                      this.handleChangeState("validatedPatronymic", true);
                    }}
                  ></Form.Control>
                  {!this.state.validatedPatronymic && (
                    <ValidatedMessage message="Пусте поле по-батькові викладача"></ValidatedMessage>
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

export default TeacherModal;
