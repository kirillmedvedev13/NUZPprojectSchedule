import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { UPDATE_TEACHER, CREATE_TEACHER } from "./mutations";
import { GET_ALL_TEACHERS } from "./queries";
import { CreateNotification } from "../Alert";

function Save({ item, handleCloseModal, handleValidation }) {
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
        },
      }
    : {
        variables: {
          name: item.name,
          surname: item.surname,
          patronymic: item.patronymic,
        },
      };
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (item.name && item.surname && item.patronymic) {
          mutateFunction(variables).then((res) => {
            if (item.id) {
              CreateNotification(res.data.UpdateTeacher);
            } else {
              CreateNotification(res.data.CreateTeacher);
            }
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

class TeacherModal extends React.Component {
  state = {
    validated: false,
  };

  handleClose = () => {
    this.props.handleCloseModal();
  };

  handleValidation = (status) => {
    this.setState({ validated: status });
  };

  render() {
    const { isopen, handleChangeItem, item } = this.props;
    return (
      <>
        <Modal size="lg" show={isopen} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {item.id ? "Редагувати запис вчителя" : "Створити запис вчителя"}
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
