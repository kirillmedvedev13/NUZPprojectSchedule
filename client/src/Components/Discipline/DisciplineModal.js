import React from "react";
import { Button, Modal, Form, Row, Col, Table } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import {
  UPDATE_DISCIPLINE,
  CREATE_DISCIPLINE,
  DELETE_DISCIPLINE_FROM_SPECIALTY,
} from "./mutations";
import { ADD_DISCIPLINE_TO_SPECIALTY } from "./mutations";
import { GET_ALL_DISCIPLINES } from "./queries";
import { GET_ALL_SPECIALTIES } from "../Specialty/queries";
import Select from "react-select";
import { CreateNotification } from "../Alert";
import { XCircle } from "react-bootstrap-icons";

function Save({
  item,
  handleCloseModal,
  handleValidation,
  handleValidationTypeClass,
}) {
  const mutation = item.id ? UPDATE_DISCIPLINE : CREATE_DISCIPLINE;
  const [mutateFunction, { loading, error }] = useMutation(mutation, {
    refetchQueries: [GET_ALL_DISCIPLINES],
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  console.log("creeate");
  console.log(item);
  const variables = item.id
    ? {
        variables: {
          id: Number(item.id),
          name: item.name,
        },
      }
    : {
        variables: {
          name: item.name,
          assigned_disciplines: JSON.stringify(item.assigned_disciplines),
        },
      };
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (item.name) {
          mutateFunction(variables).then((res) => {
            CreateNotification(
              item.id ? res.data.UpdateDiscipline : res.data.CreateDiscipline
            );
            handleCloseModal();
          });
        } else {
          handleValidation(true);
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}

function SelectsSpecialties({ item, handleUpdateItem, handleChangeItem }) {
  const [DelDiscFromSpecialty, { loading, error }] = useMutation(
    DELETE_DISCIPLINE_FROM_SPECIALTY,
    {
      refetchQueries: [GET_ALL_DISCIPLINES],
    }
  );

  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  return (
    <Table striped bordered hover className="my-2">
      <thead>
        <tr>
          <th>Назва спеціальності</th>
          <th>Семестр</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {item.assigned_disciplines.map((itemDisc) => (
          <tr key={Number(itemDisc.id)}>
            <td>{itemDisc.specialty.name}</td>
            <td>{itemDisc.semester}</td>
            <td className="p-0">
              <XCircle
                className="m-1"
                type="button"
                onClick={(e) => {
                  if (item.id) {
                    // При редактировании
                    console.log("itemDisc", itemDisc);
                    DelDiscFromSpecialty({
                      variables: { id: Number(itemDisc.id) },
                    }).then((res) => {
                      console.log(res);
                      handleUpdateItem(item);
                      CreateNotification(
                        res.data.DeleteDisciplineFromSpecialty
                      );
                    });
                  } else {
                    // При добавлении
                    let arrDisc = item.assigned_disciplines.filter(
                      (disc) => Number(disc.id) !== Number(itemDisc.id)
                    );
                    handleChangeItem("assigned_disciplines", arrDisc);
                  }
                }}
              ></XCircle>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function AddSpecialtyToDiscipline({
  item,
  handleUpdateItem,
  handleAddDiscToSpec,
  statusAddDisciplineToSpecialty,
  handleChangeSelectedSpecialtyToAdd,
  selectedSpecialtyToAdd,
  handleValidationSelectedSpecialtyToAdd,
  validatedSelectedSpecialtyToAdd,
  handleChangeItem,
  handleIncCounterSpecialties,
  counterSpecialties,
}) {
  const query = useQuery(GET_ALL_SPECIALTIES);
  const [AddDiscToSpecialty, { loading, error }] = useMutation(
    ADD_DISCIPLINE_TO_SPECIALTY,
    {
      refetchQueries: [GET_ALL_DISCIPLINES],
    }
  );
  if (query.loading) return "Loading...";
  if (query.error) return `Error! ${error}`;
  let options = [];
  query.data.GetAllSpecialties.forEach((element) => {
    options.push({ label: element.name, value: Number(element.id) });
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  if (statusAddDisciplineToSpecialty) {
    return (
      <Form.Group as={Row} className="my-2 mx-2 px-0">
        <Form.Label className="col-auto px-1">
          Виберiть спеціальність
        </Form.Label>
        <Col className="px-1">
          <Select
            options={options}
            placeholder="Спеціальність"
            onChange={(e) => {
              handleChangeSelectedSpecialtyToAdd({
                id: e.value,
                name: e.label,
                semester: selectedSpecialtyToAdd
                  ? selectedSpecialtyToAdd.semester
                  : 0,
              });
              handleValidationSelectedSpecialtyToAdd({ status: true });
            }}
          ></Select>
          {!validatedSelectedSpecialtyToAdd.status && (
            <div className="text-danger">
              {validatedSelectedSpecialtyToAdd.message}
            </div>
          )}
        </Col>
        <Col>
          <Form.Control
            required
            type="number"
            min="1"
            max="13"
            placeholder="Семестр"
            onChange={(e) => {
              handleChangeSelectedSpecialtyToAdd({
                id: selectedSpecialtyToAdd ? selectedSpecialtyToAdd.id : 0,
                name: selectedSpecialtyToAdd
                  ? selectedSpecialtyToAdd.name
                  : null,
                semester: e.target.value,
              });
              handleValidationSelectedSpecialtyToAdd({ status: true });
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Вкажіть семестр
          </Form.Control.Feedback>
        </Col>

        <Col className="col-auto px-1">
          <Button
            onClick={(e) => {
              if (selectedSpecialtyToAdd) {
                if (
                  selectedSpecialtyToAdd.name &&
                  selectedSpecialtyToAdd.semester
                ) {
                  const checkSelectedSpecialties =
                    item.assigned_disciplines.filter(
                      (disc) =>
                        Number(disc.specialty.id) ===
                          Number(selectedSpecialtyToAdd.id) &&
                        Number(disc.semester) ===
                          Number(selectedSpecialtyToAdd.semester)
                    );
                  if (!checkSelectedSpecialties.length) {
                    // Проверка не добавлена ли эта кафедра уже в массив
                    if (item.id) {
                      console.log("yes");
                      // Если редактирование элемента
                      AddDiscToSpecialty({
                        variables: {
                          id_specialty: Number(selectedSpecialtyToAdd.id),
                          semester: Number(selectedSpecialtyToAdd.semester),
                          id_discipline: Number(item.id),
                        },
                      }).then((res) => {
                        handleUpdateItem(item);
                        CreateNotification(res.data.AddDisciplineToSpecialty);
                        handleAddDiscToSpec(false);
                        handleChangeSelectedSpecialtyToAdd(null);
                      });
                    } else {
                      // Создание элемента
                      let arrDisc = item.assigned_disciplines;
                      arrDisc.push({
                        id: counterSpecialties,
                        semester: selectedSpecialtyToAdd.semester,
                        specialty: {
                          id: selectedSpecialtyToAdd.id,
                          name: selectedSpecialtyToAdd.name,
                        },
                      });
                      handleChangeItem("assigned_disciplines", arrDisc);
                      handleIncCounterSpecialties();
                      handleAddDiscToSpec(false);
                      handleChangeSelectedSpecialtyToAdd(null);
                    }
                  } else {
                    handleValidationSelectedSpecialtyToAdd({
                      status: false,
                      message: "Не можна додати однакових записів",
                    });
                  }
                } else {
                  handleValidationSelectedSpecialtyToAdd({
                    status: false,
                    message: "Виберіть спеціальність та вкажіть семестр!",
                  });
                }
              } else {
                handleValidationSelectedSpecialtyToAdd({
                  status: false,
                  message: "Спеціальність не вибрана!",
                });
              }
            }}
          >
            Зберегти
          </Button>
        </Col>
      </Form.Group>
    );
  } else {
    return (
      <Button onClick={(e) => handleAddDiscToSpec(true)}>
        Додати Спеціальність
      </Button>
    );
  }
}

class DisciplineModal extends React.Component {
  state = {
    validated: false,
    statusAddDisciplineToSpecialty: false, // Если тру то форма с добавлением кафедры
    selectedSpecialtyToAdd: null, // выбранная кафедра для добавление к аудитории
    validatedSelectedSpecialtyToAdd: { status: true }, // Проверка выбранной кафдеры
    counterSpecialties: 0, // счётчик для ключей в массиве закрепленных кафедр
  };

  //При выборке кафедры в селекте
  handleChangeSelectedSpecialtyToAdd = (specialty) => {
    this.setState({ selectedSpecialtyToAdd: specialty });
  };

  //Изменение отображение : формы или кнопки
  handleAddDiscToSpec = (status) => {
    this.setState({ statusAddDisciplineToSpecialty: status });
  };

  //Проверка на выбранную кафедру
  handleValidationSelectedSpecialtyToAdd = (valid) => {
    this.setState({ validatedSelectedSpecialtyToAdd: valid });
  };

  //Увелечиние счётчика кафедр
  handleIncCounterSpecialties = () => {
    this.setState((prevState) => ({
      counterSpecialties: prevState.counterSpecialties + 1,
    }));
  };

  handleClose = () => {
    this.props.handleCloseModal();
  };

  handleValidation = (status) => {
    this.setState({ validated: status });
  };

  render() {
    const { isopen, handleChangeItem, item, handleUpdateItem } = this.props;
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
            <Form noValidate validated={this.state.validated}>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Назва дисципліни</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Дисципліни"
                    value={item.name}
                    onChange={(e) => {
                      handleChangeItem("name", e.target.value);
                    }}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Назва не повинна бути пуста
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">
                  Закріплені спеціальності
                </Form.Label>
                <Col>
                  <AddSpecialtyToDiscipline
                    item={item}
                    handleUpdateItem={handleUpdateItem}
                    statusAddDisciplineToSpecialty={
                      this.state.statusAddDisciplineToSpecialty
                    }
                    handleAddDiscToSpec={this.handleAddDiscToSpec}
                    handleChangeSelectedSpecialtyToAdd={
                      this.handleChangeSelectedSpecialtyToAdd
                    }
                    validatedSelectedSpecialtyToAdd={
                      this.state.validatedSelectedSpecialtyToAdd
                    }
                    handleValidationSelectedSpecialtyToAdd={
                      this.handleValidationSelectedSpecialtyToAdd
                    }
                    selectedSpecialtyToAdd={this.state.selectedSpecialtyToAdd}
                    handleChangeItem={handleChangeItem}
                    handleIncCounterSpecialties={
                      this.handleIncCounterSpecialties
                    }
                    counterSpecialties={this.state.counterSpecialties}
                  ></AddSpecialtyToDiscipline>
                  <SelectsSpecialties
                    item={item}
                    handleUpdateItem={handleUpdateItem}
                    handleChangeItem={handleChangeItem}
                  ></SelectsSpecialties>
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
            ></Save>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default DisciplineModal;
