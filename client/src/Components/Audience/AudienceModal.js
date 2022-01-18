import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_AUDIENCE, CREATE_AUDIENCE } from "./mutations";
import { GET_ALL_AUDIENCES, GET_ALL_TYPE_CLASSES } from "./queries";
import Select from "react-select";
import { CreateNotification } from "../Alert";

function Save({
  item,
  handleCloseModal,
  handleValidation,
  handleValidationTypeClass
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
          id_type_class: Number(item.id_type_class)
        },
      }
    : {
        variables: {
          name: item.name,
          capacity: Number(item.capacity),
          id_type_class: Number(item.id_type_class)
        },
      };
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (
          item.name &&
          item.capacity
        ) {
          mutateFunction(variables).then((res) => {
            CreateNotification(
              item.id ? res.data.UpdateAudience : res.data.CreateAudience
            );
            handleCloseModal();
          });
        } else {
          handleValidation(true);
          if (item.id_type_class) {
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
        handleChangeItem("id_type_class", Number(e.value));
        e.value = item.id_type_class;
      }}
    />
  );
}

class AudienceModal extends React.Component {
  state = {
    validated: false,
    validatedTypeClass: true,
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
    const { isopen, handleChangeItem, item } = this.props;
    console.log(item)
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
                  <SelectTypeClass item={item} handleValidationTypeClass={this.handleValidationTypeClass} handleChangeItem={handleChangeItem}></SelectTypeClass>
                  {!this.state.validatedTypeClass && (
                    <div className="text-danger">Тип не вибран</div>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Закріплені кафедри</Form.Label>
                <Col>
                        
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
