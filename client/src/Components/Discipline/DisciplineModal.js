import React from "react";
import { Button, Modal, Form, Row, Col, ListGroup } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_CATHEDRAS } from "../Cathedra/queries";
import { UPDATE_SPECIALTY, CREATE_SPECIALTY } from "./mutations";
import { GET_ALL_SPECIALTIES } from "../Specialty/queries";
import Select from "react-select";
import { CreateNotification } from "../Alert";

function Save({
  item,
  handleCloseModal,
  handleValidation,
  handleValidationSpecialty,
}) {
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (!item.name) handleValidation(true);
        if (!item.id_cathedra) {
          handleValidationSpecialty(false);
        }
        if (item.name && item.id_cathedra) {
          handleValidation(true, false);
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}

function SelectSpecialties({
  item,
  handleChangeItem,
  handleValidationSpecialty,
  selectedSpec,
}) {
  const { error, loading, data } = useQuery(GET_ALL_SPECIALTIES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllSpecialties.forEach((selectitem) => {
    options.push({ label: selectitem.name, value: Number(selectitem.id) });
  });
  return (
    <Select
      required
      options={options}
      placeholder="Спеціальність"
      defaultValue={
        item.id
          ? { label: item.specialty.name, value: Number(item.specialty.id) }
          : null
      }
      onChange={(e) => {
        handleValidationSpecialty(true);
        handleChangeItem("id_specialty", Number(e.value));
        console.log(item);
        selectedSpec.push({ id: item.id_specialty, name: e });
      }}
    />
  );
}
class DisciplineModal extends React.Component {
  state = {
    validated: false,
    isValidSpecialty: true,
    selectedSpec: [],
  };
  handleClose = () => {
    this.props.handleCloseModal();
  };

  handleValidation = (status) => {
    this.setState({ validated: status });
  };

  handleValidationSpecialty = (status) => {
    this.setState({ isValidSpecialty: status });
  };

  render() {
    const { isopen, handleChangeItem, item } = this.props;
    return (
      <>
        <Modal size="lg" show={isopen} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {item.id
                ? "Редагувати запис дісципліни"
                : "Створити запис дісципліни"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={this.state.validated}>
              <Form.Group as={Row} className="my-2 mx-2">
                <Form.Label className="col-2">Дісципліна</Form.Label>
                <Col>
                  <Form.Control
                    required
                    placeholder="дісципліна"
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
                <Form.Label className="col-2">Спеціальності</Form.Label>
                <Col>
                  <SelectSpecialties
                    handleValidationSpecialty={this.handleValidationSpecialty}
                    handleChangeItem={handleChangeItem}
                    item={item}
                    selectedSpec={this.state.selectedSpec}
                  ></SelectSpecialties>
                  {!this.state.isValidSpecialty && (
                    <div className="text-danger">
                      Виберіть хоч б одну спеціальність на якій ведеться ця
                      дісципліна
                    </div>
                  )}
                </Col>
                <ListGroup>
                  {this.state.selectedSpec
                    ? this.state.selectedSpec.map((object) => {
                        console.log(object);
                        return <ListGroup.Item>{object.name}</ListGroup.Item>;
                      })
                    : ""}
                </ListGroup>
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
              handleValidationCathedra={this.handleValidationSpecialty}
              handleValidation={this.handleValidation}
            ></Save>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
export default DisciplineModal;
