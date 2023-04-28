import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import SaveButton from "./SaveButton";
import SelectCathedras from "../SelectsModalWindow/SelectCathedras";
import ValidatedMessage from "../ValidatedMessage";
import cloneDeep from "clone-deep";

class TeacherModal extends React.Component {
  defState = {
    validatedName: true,
    validatedSurname: true,
    validatedPatronymic: true,
    validatedCathedra: true,
  };
  state = cloneDeep(this.defState);

  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };
  handleIncCounter = (name) => {
    this.setState((prevState) => ({ [name]: prevState[name] + 1 }));
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
              {item.id
                ? "Редагувати запис викладача"
                : "Створити запис викладача"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-md-2">Ім'я</Form.Label>
                <Col className="col-md-10">
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
                <Form.Label className="col-md-2">Прізвище</Form.Label>
                <Col className="col-md-10">
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
                <Form.Label className="col-md-2">По-батькові</Form.Label>
                <Col className="col-md-10">
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
                <Form.Label className="col-md-2">Назва кафедри</Form.Label>
                <Col className="col-md-10">
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

export default TeacherModal;
