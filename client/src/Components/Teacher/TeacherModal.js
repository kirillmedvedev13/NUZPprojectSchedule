import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_TEACHER, CREATE_TEACHER } from "./mutations";
import { GET_ALL_CATHEDRAS } from "../Cathedra/queries";
import { GET_ALL_TEACHERS } from "./queries";
import { CreateNotification } from "../Alert";
import Select from "react-select";

function Save({
  item,
  handleCloseModal,
  handleValidation,
  handleValidationCathedra,
}) {
  const mutation = item.id ? UPDATE_TEACHER : CREATE_TEACHER;
  const [mutateFunction, { loading, error }] = useMutation(mutation, {
    refetchQueries: [GET_ALL_TEACHERS],
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  const variables = item.id
    ? {
      variables: {
        id: Number(item.id),
        name: item.name,
        surname: item.surname,
        patronymic: item.patronymic,
        id_cathedra: Number(item.cathedra.id),
      },
    }
    : {
      variables: {
        name: item.name,
        surname: item.surname,
        patronymic: item.patronymic,
        id_cathedra: Number(item.cathedra.id),
      },
    };
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (!item.cathedra.id) {
          handleValidationCathedra(false);
        }
        else if (!item.name || !item.surname || !item.patronymic) {
          handleValidation(true);
        } else {
          mutateFunction(variables).then((res) => {
            if (item.id) {
              CreateNotification(res.data.UpdateTeacher);
            } else {
              CreateNotification(res.data.CreateTeacher);
            }
            handleCloseModal();
          });
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}
function SelectCathedras({ item, handleChangeItem, handleValidationCathedra }) {
  const { error, loading, data } = useQuery(GET_ALL_CATHEDRAS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllCathedras.forEach((selectitem) => {
    options.push({ label: selectitem.name, value: Number(selectitem.id) });
  });
  return (
    <Select
      required
      options={options}
      placeholder="Кафедра"
      defaultValue={
        item.id
          ? { label: item.cathedra.name, value: Number(item.cathedra.id) }
          : null
      }
      onChange={(e) => {
        handleValidationCathedra(true);
        handleChangeItem("cathedra", { id: Number(e.value) });
        e.value = item.cathedra.id;
      }}
    />
  );
}

class TeacherModal extends React.Component {
  state = {
    validated: false,
    isValidCathedra: true,
  };

  handleClose = () => {
    this.props.handleCloseModal();
  };

  handleValidation = (status) => {
    this.setState({ validated: status });
  };
  handleValidationCathedra = (status) => {
    this.setState({ isValidCathedra: status });
  };

  render() {
    const { isopen, handleChangeItem, item } = this.props;
    return (
      <>
        <Modal size="lg" show={isopen} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {item.id ? "Редагувати запис викладача" : "Створити запис викладача"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={this.state.validated}>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Ім'я</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Ім'я"
                    value={item.name}
                    onChange={(e) => {
                      handleChangeItem("name", e.target.value);
                    }}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Ім'я не повинно бути пустим
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Прізвище</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Прізвище"
                    value={item.surname}
                    onChange={(e) => {
                      handleChangeItem("surname", e.target.value);
                    }}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Прізвище не повинно пустим
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">По-батькові</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="По-батькові"
                    value={item.patronymic}
                    onChange={(e) => {
                      handleChangeItem("patronymic", e.target.value);
                    }}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    По-батькові не повинно бути пустим
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Назва кафедри</Form.Label>
                <Col>
                  <SelectCathedras
                    handleValidationCathedra={this.handleValidationCathedra}
                    handleChangeItem={handleChangeItem}
                    item={item}
                  ></SelectCathedras>
                  {!this.state.isValidCathedra && (
                    <div className="text-danger">Кафедра не вибрана</div>
                  )}
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
              handleValidationCathedra={this.handleValidationCathedra}
              handleValidation={this.handleValidation}
            ></Save>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default TeacherModal;
