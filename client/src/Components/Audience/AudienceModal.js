import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import ValidatedMessage from "../ValidatedMessage";
import AddCathedraToAudience from "./AddCathedraToAudience";
import SaveButton from "./SaveButton";
import TableCathedras from "./TableCathedras";
import SelectTypeClass from "../SelectsModalWindow/SelectTypeClass.js";
import cloneDeep from "clone-deep";

class AudienceModal extends React.Component {
  defState = {
    validatedTypeClass: true,
    validatedName: true,
    validatedCapacity: true,
    validatedSelectedCathedraToAdd: { status: true }, // Проверка выбранной кафдеры
    selectedCathedraToAdd: null, // выбранная кафедра для добавление к аудитории
    statusAddCathedraToAudience: false, // Если тру то форма с добавлением кафедры
    counterCathedras: 0, // счётчик для ключей в массиве закрепленных кафедр
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
                ? `Редагувати запис аудиторії ${item.name}`
                : "Створити запис аудиторії"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-md-2">Назва аудиторії</Form.Label>
                <Col className="col-md-10">
                  <Form.Control
                    required
                    placeholder="Аудиторія"
                    value={item.name}
                    onChange={(e) => {
                      handleChangeItem("name", e.target.value);
                      this.handleChangeState("validatedName", true);
                    }}
                  ></Form.Control>
                  {!this.state.validatedName && (
                    <ValidatedMessage message="Пусте поле назви аудиторії"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-md-2">Кількість місць</Form.Label>
                <Col className="col-md-10">
                  <Form.Control
                    required
                    type="number"
                    min={0}
                    placeholder="Кількість місць"
                    value={item.capacity}
                    onChange={(e) => {
                      let value = +e.target.value;
                      if (value >= 0) {
                        handleChangeItem("capacity", e.target.value);
                        this.handleChangeState("validatedCapacity", true);
                      } else {
                        handleChangeItem("capacity", 0);
                        this.handleChangeState("validatedCapacity", {
                          status: false,
                          message:
                            "Значення повинно бути більше або дорівнювати 0",
                        });
                      }
                    }}
                  ></Form.Control>
                  {!this.state.validatedCapacity && (
                    <ValidatedMessage
                      message="Пусте поле вмісткості"
                      isopen={isopen}
                    ></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-md-2">Тип аудиторії</Form.Label>
                <Col className="col-md-10">
                  <SelectTypeClass
                    item={item}
                    handleChangeState={this.handleChangeState}
                    handleChangeItem={handleChangeItem}
                  ></SelectTypeClass>
                  {!this.state.validatedTypeClass && (
                    <ValidatedMessage message="Тип не вибран"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-md-2">Закріплені кафедри</Form.Label>
                <Col className="col-md-10">
                  <AddCathedraToAudience
                    item={item}
                    handleChangeItem={handleChangeItem}
                    statusAddCathedraToAudience={
                      this.state.statusAddCathedraToAudience
                    }
                    validatedSelectedCathedraToAdd={
                      this.state.validatedSelectedCathedraToAdd
                    }
                    selectedCathedraToAdd={this.state.selectedCathedraToAdd}
                    handleIncCounter={this.handleIncCounter}
                    handleChangeState={this.handleChangeState}
                    counterCathedras={this.state.counterCathedras}
                  ></AddCathedraToAudience>
                  <TableCathedras
                    item={item}
                    handleChangeItem={handleChangeItem}
                  ></TableCathedras>
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

export default AudienceModal;
