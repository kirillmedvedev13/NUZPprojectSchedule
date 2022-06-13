import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import ValidatedMessage from "../ValidatedMessage";
import AddAudienceToCathedra from "./AddAudienceToCathedra";
import SaveButton from "./SaveButton";
import SelectCathedras from "./SelectCathedras";
import SelectTypeClass from "./SelectTypeClass";

class AudienceModal extends React.Component {
  defState = {
    validatedTypeClass: true,
    validatedName: true,
    validatedCapacity: true,
    validatedSelectedCathedraToAdd: { status: true }, // Проверка выбранной кафдеры

    selectedCathedraToAdd: null, // выбранная кафедра для добавление к аудитории
    statusAddAudeinceToCathedra: false, // Если тру то форма с добавлением кафедры
    counterCathedras: 0, // счётчик для ключей в массиве закрепленных кафедр
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
                ? `Редагувати запис аудиторії ${item.name}`
                : "Створити запис аудиторії"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Назва аудиторії</Form.Label>
                <Col>
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
                <Form.Label className="col-2">Вмісткість</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Вмісткість"
                    value={item.capacity}
                    onChange={(e) => {
                      handleChangeItem("capacity", e.target.value);
                      this.handleChangeState("validatedCapacity", true);
                    }}
                  ></Form.Control>
                  {!this.state.validatedCapacity && (
                    <ValidatedMessage message="Пусте поле вмісткості"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Тип аудиторії</Form.Label>
                <Col>
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
                <Form.Label className="col-2">Закріплені кафедри</Form.Label>
                <Col>
                  <AddAudienceToCathedra
                    item={item}
                    handleChangeItem={handleChangeItem}
                    statusAddAudeinceToCathedra={
                      this.state.statusAddAudeinceToCathedra
                    }
                    handleAddAudToCath={this.handleAddAudToCath}
                    handleChangeSelectedCathedraToAdd={
                      this.handleChangeSelectedCathedraToAdd
                    }
                    validatedSelectedCathedraToAdd={
                      this.state.validatedSelectedCathedraToAdd
                    }
                    handleValidationSelectedCathedraToAdd={
                      this.handleValidationSelectedCathedraToAdd
                    }
                    selectedCathedraToAdd={this.state.selectedCathedraToAdd}
                    handleIncCounter={this.handleIncCounter}
                    handleChangeState={this.handleChangeState}
                    counterCathedras={this.state.counterCathedras}
                  ></AddAudienceToCathedra>
                  <SelectCathedras
                    item={item}
                    handleChangeItem={handleChangeItem}
                  ></SelectCathedras>
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

export default AudienceModal;
