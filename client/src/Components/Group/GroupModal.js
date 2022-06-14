import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import SaveButton from "./SaveButton";
import SelectSpecialties from "./SelectSpecialties";
import ValidatedMessage from "../ValidatedMessage";

class GroupModal extends React.Component {
  defState = {
    validatedName: true,
    validatedNumberStudents: true,
    validatedSemester: true,
    validatedSpecialty: true,
  };
  state = this.defState;

  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
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
                ? `Редагувати запис групи ${item.name}`
                : "Створити запис групи"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Назва групи</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Група"
                    value={item.name}
                    onChange={(e) => {
                      handleChangeItem("name", e.target.value);
                      this.handleChangeState("validatedName", true);
                    }}
                  ></Form.Control>
                  {!this.state.validatedName && (
                    <ValidatedMessage message="Пусте поле назви групи"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Кількість студентів</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Кількість студентів"
                    value={item.number_students}
                    onChange={(e) => {
                      handleChangeItem("number_students", e.target.value);
                      this.handleChangeState("validatedNumberStudents", true);
                    }}
                  ></Form.Control>
                  {!this.state.validatedNumberStudents && (
                    <ValidatedMessage message="Пусте поле кількості студентів"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Семестр</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Семестр"
                    value={item.semester}
                    onChange={(e) => {
                      handleChangeItem("semester", e.target.value);
                      this.handleChangeState("validatedSemester", true);
                    }}
                  ></Form.Control>
                  {!this.state.validatedSemester && (
                    <ValidatedMessage message="Пусте поле семестру"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Назва спеціальності</Form.Label>
                <Col>
                  <SelectSpecialties
                    handleChangeState={this.handleChangeState}
                    handleChangeItem={handleChangeItem}
                    item={item}
                  ></SelectSpecialties>
                  {!this.state.validatedSpecialty && (
                    <ValidatedMessage message="Спеціальність не вибранa"></ValidatedMessage>
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

export default GroupModal;
