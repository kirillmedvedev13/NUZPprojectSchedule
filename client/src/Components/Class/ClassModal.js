import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { AddTeacherToClass, TableTeachers } from "./ClassModalTeachers";
import { TableGroups, AddGroupToClass } from "./ClassModalGroups";
import {
  TableRecAudience,
  AddRecAudienceToClass,
} from "./ClassModalRecAudience";
import ValidatedMessage from "../ValidatedMessage";
import SaveButton from "./SaveButton";
import SelectTypeClass from "./SelectTypeClass";
import SelectDiscipline from "./SelectDiscipline";

class ClassModal extends React.Component {
  defState = {
    validatedTimesPerWeek: true,
    validatedTypeClass: true,
    validatedDiscipline: true,

    statusAddGroupToClass: false, // Если тру то форма с добавлением группы
    selectedGroup: null, // выбранная группа для добавление к занятию
    validatedSelectedGroup: { status: true, message: "" }, // Проверка выбранной группы
    counterGroups: 0, // счётчик для ключей в массиве закрепленных групп

    statusAddTeacherToClass: false, // Если тру то форма с добавлением учитилей
    selectedTeacher: null, // выбранный учитель для добавление к занятию
    validatedSelectedTeacher: { status: true, message: "" }, // Проверка выбранного учителя
    counterTeachers: 0, // счётчик для ключей в массиве закрепленных учитилей

    statusAddRecAudeinceToClass: false, // Если тру то форма с добавлением аудиторий
    selectedRecAudience: null, // выбранная аудитория для добавление к занятию
    validatedSelectedRecAudience: { status: true, message: "" }, // Проверка выбранной аудитории
    counterRecAudeinces: 0, // счётчик для ключей в массиве рекомендуемых аудиторий
  };

  state = this.defState;

  //При выборке элемента в селекте
  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };

  //Увелечиние счётчика элементов
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
              {item.id ? `Редагувати запис заняття` : "Створити запис заняття"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Дисципліна</Form.Label>
                <Col>
                  <SelectDiscipline
                    item={item}
                    handleChangeState={this.handleChangeState}
                    handleChangeItem={handleChangeItem}
                  ></SelectDiscipline>
                  {!this.state.validatedDiscipline && (
                    <ValidatedMessage message="Дисциплiна не вибрана"></ValidatedMessage>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">
                  Кількість занять на тиждень
                </Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Кількість занять на тиждень"
                    value={item.times_per_week}
                    onChange={(e) => {
                      handleChangeItem("times_per_week", e.target.value);
                      this.handleChangeState("validatedTimesPerWeek", true);
                    }}
                  ></Form.Control>
                  {!this.state.validatedTimesPerWeek && (
                    <ValidatedMessage message="Пусте поле кiлькостi занять"></ValidatedMessage>
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
                <Form.Label className="col-2">Закріплені викладачі</Form.Label>
                <Col>
                  <AddTeacherToClass
                    item={item}
                    handleChangeItem={handleChangeItem}
                    statusAddTeacherToClass={this.state.statusAddTeacherToClass}
                    counterTeachers={this.state.counterTeachers}
                    validatedSelectedTeacher={
                      this.state.validatedSelectedTeacher
                    }
                    selectedTeacher={this.state.selectedTeacher}
                    handleChangeState={this.handleChangeState}
                    handleIncCounter={this.handleIncCounter}
                  ></AddTeacherToClass>
                  <TableTeachers
                    item={item}
                    handleChangeItem={handleChangeItem}
                  ></TableTeachers>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Закріплені групи</Form.Label>
                <Col>
                  <AddGroupToClass
                    item={item}
                    handleChangeItem={handleChangeItem}
                    statusAddGroupToClass={this.state.statusAddGroupToClass}
                    counterGroups={this.state.counterGroups}
                    validatedSelectedGroup={this.state.validatedSelectedGroup}
                    selectedGroup={this.state.selectedGroup}
                    handleChangeState={this.handleChangeState}
                    handleIncCounter={this.handleIncCounter}
                  ></AddGroupToClass>
                  <TableGroups
                    item={item}
                    handleChangeItem={handleChangeItem}
                  ></TableGroups>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">
                  Рекомендовані аудиторії
                </Form.Label>
                <Col>
                  <AddRecAudienceToClass
                    item={item}
                    handleChangeItem={handleChangeItem}
                    statusAddRecAudienceToClass={
                      this.state.statusAddRecAudienceToClass
                    }
                    counterRecAudiences={this.state.counterRecAudiences}
                    validatedSelectedRecAudience={
                      this.state.validatedSelectedRecAudience
                    }
                    selectedRecAudience={this.state.selectedRecAudience}
                    handleChangeState={this.handleChangeState}
                    handleIncCounter={this.handleIncCounter}
                  ></AddRecAudienceToClass>
                  <TableRecAudience
                    item={item}
                    handleChangeItem={handleChangeItem}
                  ></TableRecAudience>
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

export default ClassModal;
