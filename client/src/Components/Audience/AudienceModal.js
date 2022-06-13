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
import ValidatedMessage from "../ValidatedMessage";

function Save({ item, handleCloseModal, handleChangeState }) {
  const mutation = item.id ? UPDATE_AUDIENCE : CREATE_AUDIENCE;
  const [mutateFunction, { loading, error }] = useMutation(mutation);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  const variables = item.id
    ? {
        variables: {
          id: +item.id,
          name: item.name,
          capacity: +item.capacity,
          id_type_class: +item.type_class.id,
        },
      }
    : {
        variables: {
          name: item.name,
          capacity: +item.capacity,
          id_type_class: +item.type_class.id,
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
          if (!item.type_class.id)
            handleChangeState("validatedTypeClass", false);
          if (!item.name) handleChangeState("validatedName", false);
          if (!item.capacity) handleChangeState("validatedCapacity", false);
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
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
        handleChangeItem("type_class", { id: +e.value });
      }}
    />
  );
}

function SelectsCathedras({ item, handleChangeItem }) {
  const [DelAudFromCathedra, { loading, error }] = useMutation(
    DELETE_AUDIENCE_FROM_CATHEDRA
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
                      variables: { id: +itemAU.id },
                    }).then((res) => {
                      console.log(res);
                      if (res.data.DeleteAudienceFromCathedra.successful) {
                        let arrAU = item.assigned_audiences.filter(
                          (au) => +au.id !== +itemAU.id
                        );
                        handleChangeItem("assigned_audiences", arrAU);
                      }

                      CreateNotification(res.data.DeleteAudienceFromCathedra);
                    });
                  } else {
                    // При добавлении
                    let arrAU = item.assigned_audiences.filter(
                      (au) => +au.id !== +itemAU.id
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
  handleChangeItem,
  statusAddAudeinceToCathedra,
  selectedCathedraToAdd,
  validatedSelectedCathedraToAdd,
  handleChangeState,
  handleIncCounter,
  counterCathedras,
}) {
  const query = useQuery(GET_ALL_CATHEDRAS);
  const [AddAudToCathedra, { loading, error }] = useMutation(
    ADD_AUDIENCE_TO_CATHEDRA
  );
  if (query.loading) return "Loading...";
  if (query.error) return `Error! ${error}`;
  let options = [];
  query.data.GetAllCathedras.forEach((element) => {
    options.push({ label: element.name, value: +element.id });
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  if (statusAddAudeinceToCathedra) {
    // Если открыт селект
    return (
      <Form.Group as={Row} className="my-2 mx-2 px-0">
        <Form.Label className="col-auto px-1">Виберiть кафедру</Form.Label>
        <Col className="px-1">
          <Select
            options={options}
            placeholder="Кафедра"
            onChange={(e) => {
              handleChangeState(
                "selectedCathedraToAdd",
                query.data.GetAllCathedras.find((c) => +c.id === +e.value)
              );
              handleChangeState("validatedSelectedCathedra", {
                status: true,
                message: "",
              });
            }}
          ></Select>
          {!validatedSelectedCathedraToAdd.status && (
            <ValidatedMessage
              message={validatedSelectedCathedraToAdd.message}
            ></ValidatedMessage>
          )}
        </Col>
        <Col className="col-auto px-1">
          <Button
            onClick={(e) => {
              if (selectedCathedraToAdd) {
                const checkSelectedCathedras = item.assigned_audiences.filter(
                  (au) => +au.cathedra.id === +selectedCathedraToAdd.id
                );
                if (!checkSelectedCathedras.length) {
                  // Проверка не добавлена ли эта кафедра уже в массив
                  if (item.id) {
                    // Если редактирование элемента
                    AddAudToCathedra({
                      variables: {
                        id_cathedra: +selectedCathedraToAdd.id,
                        id_audience: +item.id,
                      },
                    }).then((res) => {
                      const au = JSON.parse(
                        res.data.AddAudienceToCathedra.data
                      );
                      console.log(item);

                      handleChangeItem("assigned_audiences", [
                        ...item.assigned_audiences,
                        {
                          id: au[0].id,
                          cathedra: selectedCathedraToAdd,
                        },
                      ]);
                      CreateNotification(res.data.AddAudienceToCathedra);
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
                    handleIncCounter("counterCathedras");
                  }
                } else {
                  handleChangeState("validatedSelectedCathedraToAdd", {
                    status: false,
                    message: "Кафедра вже додана",
                  });
                }
              } else {
                handleChangeState("validatedSelectedCathedraToAdd", {
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
      <Button
        onClick={(e) => handleChangeState("statusAddAudeinceToCathedra", true)}
      >
        Додати кафедру
      </Button>
    );
  }
}

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
                  <SelectsCathedras
                    item={item}
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
              handleChangeState={this.handleChangeState}
            ></Save>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default AudienceModal;
