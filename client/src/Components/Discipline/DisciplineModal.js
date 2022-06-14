import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";

import SaveButton from "./SaveButton";
import SelectSpecialties from "./SelectSpecialties";
import AddSpecialtyToDiscipline from "./AddSpecialtyToDiscipline";
import ValidatedMessage from "../ValidatedMessage";

class DisciplineModal extends React.Component {
  defState = {
    validatedName: true,
    validatedSelectedSpecialtyToAdd: { status: true }, // Проверка выбранной кафдеры

    statusAddDisciplineToSpecialty: false, // Если тру то форма с добавлением кафедры
    selectedSpecialtyToAdd: null, // выбранная кафедра для добавление к аудитории
    counterSpecialties: 0, // счётчик для ключей в массиве закрепленных кафедр
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
                ? `Редагувати запис дисципліни ${item.name}`
                : "Створити запис дисципліни"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Назва дисципліни</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Дисципліни"
                    value={item.name}
                    onChange={(e) => {
                      handleChangeItem("name", e.target.value);
                      this.handleChangeState("validatedName", true);
                    }}
                  ></Form.Control>
                  {!this.state.validatedName && (
                    <ValidatedMessage message="Пусте поле назви дісципліни"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">
                  Закріплені спеціальності
                </Form.Label>
                <Col>
                  <AddSpecialtyToDiscipline
                    item={item}
                    handleChangeItem={handleChangeItem}
                    statusAddDisciplineToSpecialty={
                      this.state.statusAddDisciplineToSpecialty
                    }
                    validatedSelectedSpecialtyToAdd={
                      this.state.validatedSelectedSpecialtyToAdd
                    }
                    selectedSpecialtyToAdd={this.state.selectedSpecialtyToAdd}
                    handleIncCounter={this.handleIncCounter}
                    handleChangeState={this.handleChangeState}
                    counterSpecialties={this.state.counterSpecialties}
                  ></AddSpecialtyToDiscipline>
                  <SelectSpecialties
                    item={item}
                    handleChangeItem={handleChangeItem}
                  ></SelectSpecialties>
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

export default DisciplineModal;
