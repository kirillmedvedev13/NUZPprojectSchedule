import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import SaveButton from "./SaveButton";
import SelectSpecialties from "../SelectsModalWindow/SelectSpecialties";
import ValidatedMessage from "../ValidatedMessage";
import cloneDeep from "clone-deep";

class GroupModal extends React.Component {
  defState = {
    validatedName: true,
    validatedNumberStudents: true,
    validatedSemester: true,
    validatedSpecialty: true,
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
              {item.id
                ? `Редагувати запис групи ${item.name}`
                : "Створити запис групи"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-md-2 my-1">
                  Назва спеціальності
                </Form.Label>
                <Col className="col-md-10 my-1">
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
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-md-2 my-2">Назва групи</Form.Label>
                <Col className="col-md-10 my-1">
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
                <Form.Label className="col-md-2 my-1">
                  Кількість студентів
                </Form.Label>
                <Col className="col-md-10 my-1">
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
                <Form.Label className="col-md-2 my-1">Семестр</Form.Label>
                <Col className="col-md-10 my-1">
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

export default GroupModal;
