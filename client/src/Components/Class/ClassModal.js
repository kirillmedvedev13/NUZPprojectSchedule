import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_CLASS, UPDATE_CLASS } from "./mutations";
import { GET_ALL_TYPE_CLASSES } from "./queries";
import { GET_ALL_DISCIPLINES } from "../Discipline/queries";
import Select from "react-select";
import { CreateNotification } from "../Alert";
import { AddTeacherToClass, TableTeachers } from "./ClassModalTeachers";
import { TableGroups, AddGroupToClass } from "./ClassModalGroups";
import {
  TableRecAudience,
  AddRecAudienceToClass,
} from "./ClassModalRecAudience";
import ValidatedMessage from "../ValidatedMessage";

function Save({ item, handleCloseModal, handleChangeState }) {
  const mutation = item.id ? UPDATE_CLASS : CREATE_CLASS;
  const [mutateFunction, { loading, error }] = useMutation(mutation);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  const variables = item.id
    ? {
        variables: {
          id: Number(item.id),
          id_assigned_discipline: Number(item.assigned_discipline.id),
          times_per_week: Number(item.times_per_week),
          id_type_class: Number(item.type_class.id),
        },
      }
    : {
        variables: {
          id_assigned_discipline: Number(item.assigned_discipline.id),
          times_per_week: Number(item.times_per_week),
          id_type_class: Number(item.type_class.id),
          assigned_teachers: JSON.stringify(
            item.assigned_teachers.map((item) => {
              return Number(item.teacher.id);
            })
          ),
          assigned_groups: JSON.stringify(
            item.assigned_groups.map((item) => {
              return Number(item.group.id);
            })
          ),
          recommended_audiences: JSON.stringify(
            item.recommended_audiences.map((item) => {
              return Number(item.audience.id);
            })
          ),
        },
      };
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (
          item.times_per_week &&
          item.type_class.id &&
          item.assigned_discipline.id
        ) {
          mutateFunction(variables).then((res) => {
            CreateNotification(
              item.id ? res.data.UpdateClass : res.data.CreateClass
            );
            handleCloseModal();
          });
        } else {
          if (!item.times_per_week) {
            handleChangeState("validatedTimesPerWeek", false);
          }
          if (!item.type_class.id) {
            handleChangeState("validatedTypeClass", false);
          }
          if (!item.assigned_discipline.id) {
            handleChangeState("validatedDiscipline", false);
          }
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}

function SelectDiscipline({ item, handleChangeItem, handleChangeState }) {
  const { error, loading, data } = useQuery(GET_ALL_DISCIPLINES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllDisciplines.forEach((discipline) => {
    discipline.assigned_disciplines.forEach((assigned_discipline) => {
      options.push({
        label: `${discipline.name} - ${assigned_discipline.specialty.name} - ${assigned_discipline.semester} семестр`,
        value: +assigned_discipline.id,
      });
    });
  });
  return (
    <Select
      required
      options={options}
      placeholder="Дисциплiна"
      defaultValue={
        item.id
          ? {
              label: `${item.assigned_discipline.discipline.name} - ${item.assigned_discipline.specialty.name} - ${item.assigned_discipline.semester} семестр`,
              value: +item.assigned_discipline.id,
            }
          : null
      }
      onChange={(e) => {
        handleChangeState("validatedSelectedGroup", true);
        handleChangeItem("assigned_discipline", { id: +e.value });
      }}
    />
  );
}

function SelectTypeClass({ item, handleChangeItem, handleChangeState }) {
  const { error, loading, data } = useQuery(GET_ALL_TYPE_CLASSES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllTypeClasses.forEach((selectitem) => {
    options.push({ label: selectitem.name, value: +selectitem.id });
  });
  return (
    <Select
      required
      options={options}
      placeholder="Тип аудиторії"
      defaultValue={
        item.id
          ? { label: item.type_class.name, value: +item.type_class.id }
          : null
      }
      onChange={(e) => {
        handleChangeState("validatedTypeClass", true);
        handleChangeItem("type_class", { id: Number(e.value) });
        e.value = item.type_class.id;
      }}
    />
  );
}

class ClassModal extends React.Component {
  defSate = {
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

  state = this.defSate;

  //При выборке элемента в селекте
  handleChangeState = (name, item) => {
    this.setState({ [name]: item });
  };

  //Увелечиние счётчика элементов
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
            <Save
              item={item}
              handleCloseModal={this.handleClose}
              handleChangeState={this.handleChangeState}
            ></Save>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ClassModal;
