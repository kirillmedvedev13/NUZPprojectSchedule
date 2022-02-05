import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { UPDATE_CATHEDRA, CREATE_CATHEDRA } from "./mutations";
import { GET_ALL_CATHEDRAS } from "./queries";
import { CreateNotification } from "../Alert";

function Save({ item, handleCloseModal, handleValidation }) {
  const mutation = item.id ? UPDATE_CATHEDRA : CREATE_CATHEDRA;
  const [mutateFunction, { loading, error }] = useMutation(mutation, {
    refetchQueries: [GET_ALL_CATHEDRAS],
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  const variables = item.id
    ? { variables: { id: Number(item.id), name: item.name, short_name: item.short_name } }
    : { variables: { name: item.name, short_name: item.short_name } };
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (item.name && item.short_name) {
          mutateFunction(variables).then((res) => {
            CreateNotification(
              item.id ? res.data.UpdateCathedra : res.data.CreateCathedra
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

class CathedraModal extends React.Component {
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
              {item.id ? "Редагувати запис кафедри" : "Створити запис кафедри"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={this.state.validated}>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Назва кафедри</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Кафедра"
                    value={item.name}
                    onChange={(e) => {
                      handleChangeItem("name", e.target.value);
                      this.handleValidation(false);
                    }}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Назва не повинна бути пуста
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Скорочена назва</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="Скорочена назва"
                    value={item.short_name}
                    onChange={(e) => {
                      handleChangeItem("short_name", e.target.value);
                      this.handleValidation(false);
                    }}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Скорочена назва не повинна бути пуста
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

export default CathedraModal;
