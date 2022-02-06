import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_CLASS,
  UPDATE_CLASS,
} from "./mutations";
import { GET_ALL_CLASSES, GET_ALL_TYPE_CLASSES } from "./queries";
import { GET_ALL_DISCIPLINES } from "../Discipline/queries"
import Select from "react-select";
import { CreateNotification } from "../Alert";
import { SelectsTeachers, AddTeacherToClass } from "./ClassModalTeachers"
import { SelectsGroups, AddGroupToClass } from "./ClassModalGroups"
import { SelectsRecAudience, AddRecAudienceToClass } from "./ClassModalRecAudience"

function Save({
  item,
  handleCloseModal,
  handleValidation,
  handleValidationTypeClass,
  handleValidationDiscipline,
}) {
  const mutation = item.id ? UPDATE_CLASS : CREATE_CLASS;
  const [mutateFunction, { loading, error }] = useMutation(mutation, {
    refetchQueries: [GET_ALL_CLASSES],
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  const variables = item.id
    ? {
      variables: {
        id: Number(item.id),
        id_assigned_discipline: Number(item.assigned_discipline.id),
        times_per_week: Number(item.times_per_week),
        id_type_class: Number(item.type_class.id)
      },
    }
    : {
      variables: {
        id_assigned_discipline: Number(item.assigned_discipline.id),
        times_per_week: Number(item.times_per_week),
        id_type_class: Number(item.type_class.id),
        assigned_teachers: JSON.stringify(item.assigned_teachers.map(item => {return Number(item.teacher.id)})),
        assigned_groups: JSON.stringify(item.assigned_groups.map(item => {return Number(item.group.id)})),
        recommended_audiences: JSON.stringify(item.recommended_audiences.map(item => {return Number(item.audience.id)})),
      },
    };
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (
          item.times_per_week && item.type_class.id && item.assigned_discipline.id
        ) {
          mutateFunction(variables).then((res) => {
            CreateNotification(
              item.id ? res.data.UpdateClass : res.data.CreateClass
            );
            handleCloseModal();
          });
        } else {
          if (!item.times_per_week) {
            handleValidation(true);
          }
          if (!item.type_class.id) {
            handleValidationTypeClass(false);
          }
          if (!item.assigned_discipline.id) {
            handleValidationDiscipline(false);
          }
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}

function SelectDiscipline({
  item,
  handleChangeItem,
  handleValidationDiscipline,
}) {
  const { error, loading, data } = useQuery(GET_ALL_DISCIPLINES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllDisciplines.forEach((discipline) => {
    discipline.assigned_disciplines.forEach((assigned_discipline) => {
      options.push({ label: `${discipline.name} - ${assigned_discipline.specialty.name} - ${assigned_discipline.semester} семестр`, value: Number(assigned_discipline.id) });
    })
  });
  return (
    <Select
      required
      options={options}
      placeholder="Дисциплiна"
      defaultValue={
        item.id
          ? { label: `${item.assigned_discipline.discipline.name} - ${item.assigned_discipline.specialty.name} - ${item.assigned_discipline.semester} семестр`, value: Number(item.type_class.id) }
          : null
      }
      onChange={(e) => {
        handleValidationDiscipline(true);
        handleChangeItem("assigned_discipline", { id: Number(e.value) });
        e.value = item.assigned_discipline.id;
      }}
    />
  );
}

function SelectTypeClass({
  item,
  handleChangeItem,
  handleValidationTypeClass,
}) {
  const { error, loading, data } = useQuery(GET_ALL_TYPE_CLASSES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllTypeClasses.forEach((selectitem) => {
    options.push({ label: selectitem.name, value: Number(selectitem.id) });
  });
  return (
    <Select
      required
      options={options}
      placeholder="Тип аудиторії"
      defaultValue={
        item.id
          ? { label: item.type_class.name, value: Number(item.type_class.id) }
          : null
      }
      onChange={(e) => {
        handleValidationTypeClass(true);
        handleChangeItem("type_class", { id: Number(e.value) });
        e.value = item.type_class.id;
      }}
    />
  );
}

class ClassModal extends React.Component {
  state = {
    validated: false,
    validatedTypeClass: true,
    validatedDiscipline: true,

    statusAddGroupToClass: false, // Если тру то форма с добавлением группы
    selectedGroup: null, // выбранная группа для добавление к занятию 
    validatedSelectedGroup: { status: true },  // Проверка выбранной группы
    counterGroups: 0, // счётчик для ключей в массиве закрепленных групп

    statusAddTeacherToClass: false, // Если тру то форма с добавлением учитилей
    selectedTeacher: null, // выбранный учитель для добавление к занятию 
    validatedSelectedTeacher: { status: true },  // Проверка выбранного учителя
    counterTeachers: 0, // счётчик для ключей в массиве закрепленных учитилей

    statusAddRecAudeinceToClass: false, // Если тру то форма с добавлением аудиторий
    selectedRecAudience: null, // выбранная аудитория для добавление к занятию 
    validatedSelectedRecAudience: { status: true },  // Проверка выбранной аудитории
    counterRecAudeinces: 0, // счётчик для ключей в массиве рекомендуемых аудиторий
  };

  //При выборке элемента в селекте
  handleChangeSelectedItem = (name, item) => {
    this.setState({ [name]: item });
  }

  //Изменение отображение : формы или кнопки
  handleChangeViewSelect = (name, status) => {
    this.setState({ [name]: status });
  }

  //Проверка на выбранный элемент
  handleValidationSelectedItem = (name, valid) => {
    this.setState({ [name]: valid });
  }

  //Увелечиние счётчика элементов
  handleIncCounter = (name) => {
    this.setState(prevState => ({ [name]: prevState[name] + 1 }));
  }

  handleClose = () => {
    this.setState({
      validated: false,
      validatedTypeClass: true,
      validatedDiscipline: true,

      statusAddGroupToClass: false, // Если тру то форма с добавлением группы
      selectedGroup: null, // выбранная группа для добавление к занятию 
      validatedSelectedGroup: { status: true },  // Проверка выбранной группы
      counterGroups: 0, // счётчик для ключей в массиве закрепленных групп

      statusAddTeacherToClass: false, // Если тру то форма с добавлением учитилей
      selectedTeacher: null, // выбранный учитель для добавление к занятию 
      validatedSelectedTeacher: { status: true },  // Проверка выбранного учителя
      counterTeachers: 0, // счётчик для ключей в массиве закрепленных учитилей

      statusAddRecAudienceToClass: false, // Если тру то форма с добавлением аудиторий
      selectedRecAudience: null, // выбранная аудитория для добавление к занятию 
      validatedSelectedRecAudience: { status: true },  // Проверка выбранной аудитории
      counterRecAudiences: 0, // счётчик для ключей в массиве рекомендуемых аудиторий
    })
    this.props.handleCloseModal();
  };

  handleValidation = (status) => {
    this.setState({ validated: status });
  };

  handleValidationTypeClass = (status) => {
    this.setState({ validatedTypeClass: status });
  };

  handleValidationDiscipline = (status) => {
    this.setState({ validatedDiscipline: status });
  };

  render() {
    const { isopen, handleChangeItem, item, handleUpdateItem } = this.props;
    return (
      <>
        <Modal size="lg" show={isopen} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {item.id
                ? `Редагувати запис заняття`
                : "Створити запис заняття"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={this.state.validated}>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Дисципліна</Form.Label>
                <Col>
                  <SelectDiscipline item={item} handleValidationDiscipline={this.handleValidationDiscipline} handleChangeItem={handleChangeItem}></SelectDiscipline>
                  {!this.state.validatedDiscipline && (
                    <div className="text-danger">Дисципліна не вибрана</div>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Кількість занять на тиждень</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Кількість занять на тиждень"
                    value={item.times_per_week}
                    onChange={(e) => {
                      handleChangeItem("times_per_week", e.target.value);
                    }}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Поле не повинно бути пустим
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Тип аудиторії</Form.Label>
                <Col>
                  <SelectTypeClass item={item} handleValidationTypeClass={this.handleValidationTypeClass} handleChangeItem={handleChangeItem}></SelectTypeClass>
                  {!this.state.validatedTypeClass && (
                    <div className="text-danger">Тип не вибран</div>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Закріплені викладачі</Form.Label>
                <Col>
                  <AddTeacherToClass
                    item={item}
                    handleUpdateItem={handleUpdateItem}
                    handleChangeItem={handleChangeItem}
                    statusAddTeacherToClass={this.state.statusAddTeacherToClass}
                    counterTeachers={this.state.counterTeachers}
                    validatedSelectedTeacher={this.state.validatedSelectedTeacher}
                    selectedTeacher={this.state.selectedTeacher}
                    handleChangeViewSelect={this.handleChangeViewSelect}
                    handleChangeSelectedItem={this.handleChangeSelectedItem}
                    handleValidationSelectedItem={this.handleValidationSelectedItem}
                    handleIncCounter={this.handleIncCounter}

                  >
                  </AddTeacherToClass>
                  <SelectsTeachers
                    item={item}
                    handleUpdateItem={handleUpdateItem}
                    handleChangeItem={handleChangeItem}
                  >
                  </SelectsTeachers>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Закріплені групи</Form.Label>
                <Col>
                  <AddGroupToClass
                    item={item}
                    handleUpdateItem={handleUpdateItem}
                    handleChangeItem={handleChangeItem}
                    statusAddGroupToClass={this.state.statusAddGroupToClass}
                    counterGroups={this.state.counterGroups}
                    validatedSelectedGroup={this.state.validatedSelectedGroup}
                    selectedGroup={this.state.selectedGroup}
                    handleChangeViewSelect={this.handleChangeViewSelect}
                    handleChangeSelectedItem={this.handleChangeSelectedItem}
                    handleValidationSelectedItem={this.handleValidationSelectedItem}
                    handleIncCounter={this.handleIncCounter}
                  >
                  </AddGroupToClass>
                  <SelectsGroups
                    item={item}
                    handleUpdateItem={handleUpdateItem}
                    handleChangeItem={handleChangeItem}
                  >
                  </SelectsGroups>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Рекомендовані аудиторії</Form.Label>
                <Col>
                  <AddRecAudienceToClass
                    item={item}
                    handleUpdateItem={handleUpdateItem}
                    handleChangeItem={handleChangeItem}
                    statusAddRecAudienceToClass={this.state.statusAddRecAudienceToClass}
                    counterRecAudiences={this.state.counterRecAudiences}
                    validatedSelectedRecAudience={this.state.validatedSelectedRecAudience}
                    selectedRecAudience={this.state.selectedRecAudience}
                    handleChangeViewSelect={this.handleChangeViewSelect}
                    handleChangeSelectedItem={this.handleChangeSelectedItem}
                    handleValidationSelectedItem={this.handleValidationSelectedItem}
                    handleIncCounter={this.handleIncCounter}
                  >
                  </AddRecAudienceToClass>
                  <SelectsRecAudience
                    item={item}
                    handleUpdateItem={handleUpdateItem}
                    handleChangeItem={handleChangeItem}
                  >
                  </SelectsRecAudience>
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
              handleValidation={this.handleValidation}
              handleValidationTypeClass={this.handleValidationTypeClass}
              handleValidationDiscipline={this.handleValidationDiscipline}
            ></Save>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ClassModal;
