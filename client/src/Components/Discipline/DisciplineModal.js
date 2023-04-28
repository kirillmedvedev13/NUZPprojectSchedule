import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import SaveButton from "./SaveButton";
import TableSpecialties from "./TableSpecialties";
import AddSpecialtyToDiscipline from "./AddSpecialtyToDiscipline";
import ValidatedMessage from "../ValidatedMessage";
import cloneDeep from "clone-deep";

class DisciplineModal extends React.Component {
  defState = {
    validatedName: true,
    validatedSelectedSpecialtyToAdd: { status: true }, // Проверка выбранной специальности
    statusAddDisciplineToSpecialty: false, // Если тру то форма с добавлением специальности
    selectedSpecialtyToAdd: null, // выбранная специльность для добавление к дисциплине
    validatedSemesterToAdd: { status: true }, // проверка семестра
    selectedSemesterToAdd: 1, // семестр для добавления специальности
    counterSpecialties: 0, // счётчик для ключей в массиве специальностей
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
                ? `Редагувати запис дисципліни ${item.name}`
                : "Створити запис дисципліни"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-md-2">Назва дисципліни</Form.Label>
                <Col className="col-md-10">
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
                    <ValidatedMessage message="Пусте поле назви дисципліни"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-md-2">
                  Закріплені спеціальності
                </Form.Label>
                <Col className="col-md-10">
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
                    selectedSemesterToAdd={this.state.selectedSemesterToAdd}
                    validatedSemesterToAdd={this.state.validatedSemesterToAdd}
                  ></AddSpecialtyToDiscipline>
                  <TableSpecialties
                    item={item}
                    handleChangeItem={handleChangeItem}
                  ></TableSpecialties>
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

export default DisciplineModal;
