import React from "react";
import { Button, Modal, Form, Row, Col, Table } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import {
  UPDATE_AUDIENCE,
  CREATE_AUDIENCE,
  DELETE_AUDIENCE_FROM_CATHEDRA,
  ADD_AUDIENCE_TO_CATHEDRA,
} from "./mutations";
import { GET_ALL_AUDIENCES, GET_ALL_TYPE_CLASSES } from "./queries";
import { GET_ALL_CATHEDRAS } from "../Cathedra/queries";
import Select from "react-select";
import { CreateNotification } from "../Alert";
import { XCircle } from "react-bootstrap-icons";

function Save({
  item,
  handleCloseModal,
  handleValidation,
  handleValidationTypeClass,
}) {
  const mutation = item.id ? UPDATE_AUDIENCE : CREATE_AUDIENCE;
  const [mutateFunction, { loading, error }] = useMutation(mutation, {
    refetchQueries: [GET_ALL_AUDIENCES],
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  const variables = item.id
    ? {
        variables: {
          id: Number(item.id),
          name: item.name,
          capacity: Number(item.capacity),
          id_type_class: Number(item.type_class.id),
        },
      }
    : {
        variables: {
          name: item.name,
          capacity: Number(item.capacity),
          id_type_class: Number(item.type_class.id),
          assigned_cathedras: JSON.stringify(item.assigned_audiences),
        },
      };
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (item.name && item.capacity) {
          mutateFunction(variables).then((res) => {
            CreateNotification(
              item.id ? res.data.UpdateAudience : res.data.CreateAudience
            );
            handleCloseModal();
          });
        } else {
          handleValidation(true);
          if (item.type_class.id) {
            handleValidationTypeClass(true);
          } else {
            handleValidationTypeClass(false);
          }
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
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

function SelectsCathedras({ item, handleUpdateItem, handleChangeItem }) {
  const [DelAudFromCathedra, { loading, error }] = useMutation(
    DELETE_AUDIENCE_FROM_CATHEDRA,
    {
      refetchQueries: [GET_ALL_AUDIENCES],
    }
  );

  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  return (
    <Table striped bordered hover className="my-2">
      <thead>
        <tr>
          <th>Назва кафедри</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {item.assigned_audiences.map((itemAU) => (
          <tr key={Number(itemAU.id)}>
            <td>{itemAU.cathedra.name}</td>
            <td className="p-0">
              <XCircle
                className="m-1"
                type="button"
                onClick={(e) => {
                  if (item.id) {
                    // При редактировании
                    DelAudFromCathedra({
                      variables: { id: Number(itemAU.id) },
                    }).then((res) => {
                      handleUpdateItem(item);
                      CreateNotification(res.data.DeleteAudienceFromCathedra);
                    });
                  } else {
                    // При добавлении
                    let arrAU = item.assigned_audiences.filter(
                      (au) => Number(au.id) !== Number(itemAU.id)
                    );
                    handleChangeItem("assigned_audiences", arrAU);
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

function AddAudienceToCathedra({
  item,
  handleUpdateItem,
  handleAddAudToCath,
  statusAddAudeinceToCathedra,
  handleChangeSelectedCathedraToAdd,
  selectedCathedraToAdd,
  handleValidationSelectedCathedraToAdd,
  validatedSelectedCathedraToAdd,
  handleChangeItem,
  handleIncCounterCathedras,
  counterCathedras,
}) {
  const query = useQuery(GET_ALL_CATHEDRAS);
  const [AddAudToCathedra, { loading, error }] = useMutation(
    ADD_AUDIENCE_TO_CATHEDRA,
    {
      refetchQueries: [GET_ALL_AUDIENCES],
    }
  );
  if (query.loading) return "Loading...";
  if (query.error) return `Error! ${error}`;
  let options = [];
  query.data.GetAllCathedras.forEach((element) => {
    options.push({ label: element.name, value: Number(element.id) });
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  if (statusAddAudeinceToCathedra) {
    return (
      <Form.Group as={Row} className="my-2 mx-2 px-0">
        <Form.Label className="col-auto px-1">Виберiть кафедру</Form.Label>
        <Col className="px-1">
          <Select
            options={options}
            placeholder="Кафедра"
            onChange={(e) => {
              handleChangeSelectedCathedraToAdd({ id: e.value, name: e.label });
              handleValidationSelectedCathedraToAdd({ status: true });
            }}
          ></Select>
          {!validatedSelectedCathedraToAdd.status && (
            <div className="text-danger">
              {validatedSelectedCathedraToAdd.message}
            </div>
          )}
        </Col>
        <Col className="col-auto px-1">
          <Button
            onClick={(e) => {
              if (selectedCathedraToAdd) {
                const checkSelectedCathedras = item.assigned_audiences.filter(
                  (au) =>
                    Number(au.cathedra.id) === Number(selectedCathedraToAdd.id)
                );
                if (!checkSelectedCathedras.length) {
                  // Проверка не добавлена ли эта кафедра уже в массив
                  if (item.id) {
                    // Если редактирование элемента
                    AddAudToCathedra({
                      variables: {
                        id_cathedra: Number(selectedCathedraToAdd.id),
                        id_audience: Number(item.id),
                      },
                    }).then((res) => {
                      handleUpdateItem(item);
                      CreateNotification(res.data.AddAudienceToCathedra);
                      handleAddAudToCath(false);
                      handleChangeSelectedCathedraToAdd(null);
                    });
                  } else {
                    // Создание элемента
                    let arrAU = item.assigned_audiences;
                    arrAU.push({
                      id: counterCathedras,
                      cathedra: {
                        id: selectedCathedraToAdd.id,
                        name: selectedCathedraToAdd.name,
                      },
                    });
                    handleChangeItem("assigned_audiences", arrAU);
                    handleIncCounterCathedras();
                    handleAddAudToCath(false);
                    handleChangeSelectedCathedraToAdd(null);
                  }
                } else {
                  handleValidationSelectedCathedraToAdd({
                    status: false,
                    message: "Кафедра вже додана",
                  });
                }
              } else {
                handleValidationSelectedCathedraToAdd({
                  status: false,
                  message: "Кафедра не вибрана!",
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
      <Button onClick={(e) => handleAddAudToCath(true)}>Додати кафедру</Button>
    );
  }
}

class AudienceModal extends React.Component {
  state = {
    validated: false,
    validatedTypeClass: true,
    statusAddAudeinceToCathedra: false, // Если тру то форма с добавлением кафедры
    selectedCathedraToAdd: null, // выбранная кафедра для добавление к аудитории
    validatedSelectedCathedraToAdd: { status: true }, // Проверка выбранной кафдеры
    counterCathedras: 0, // счётчик для ключей в массиве закрепленных кафедр
  };

  //При выборке кафедры в селекте
  handleChangeSelectedCathedraToAdd = (cathedra) => {
    this.setState({ selectedCathedraToAdd: cathedra });
  };

  //Изменение отображение : формы или кнопки
  handleAddAudToCath = (status) => {
    this.setState({ statusAddAudeinceToCathedra: status });
  };

  //Проверка на выбранную кафедру
  handleValidationSelectedCathedraToAdd = (valid) => {
    this.setState({ validatedSelectedCathedraToAdd: valid });
  };

  //Увелечиние счётчика кафедр
  handleIncCounterCathedras = () => {
    this.setState((prevState) => ({
      counterCathedras: prevState.counterCathedras + 1,
    }));
  };

  handleClose = () => {
    this.props.handleCloseModal();
  };

  handleValidation = (status) => {
    this.setState({ validated: status });
  };

  handleValidationTypeClass = (status) => {
    this.setState({ validatedTypeClass: status });
  };

  render() {
    const { isopen, handleChangeItem, item, handleUpdateItem } = this.props;
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
            <Form noValidate validated={this.state.validated}>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Назва аудиторії</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Аудиторія"
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
                <Form.Label className="col-2">Вмісткість</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Вмісткість"
                    value={item.capacity}
                    onChange={(e) => {
                      handleChangeItem("capacity", e.target.value);
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
                  <SelectTypeClass
                    item={item}
                    handleValidationTypeClass={this.handleValidationTypeClass}
                    handleChangeItem={handleChangeItem}
                  ></SelectTypeClass>
                  {!this.state.validatedTypeClass && (
                    <div className="text-danger">Тип не вибран</div>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Закріплені кафедри</Form.Label>
                <Col>
                  <AddAudienceToCathedra
                    item={item}
                    handleUpdateItem={handleUpdateItem}
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
                    handleChangeItem={handleChangeItem}
                    handleIncCounterCathedras={this.handleIncCounterCathedras}
                    counterCathedras={this.state.counterCathedras}
                  ></AddAudienceToCathedra>
                  <SelectsCathedras
                    item={item}
                    handleUpdateItem={handleUpdateItem}
                    handleChangeItem={handleChangeItem}
                  ></SelectsCathedras>
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
            ></Save>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default AudienceModal;
