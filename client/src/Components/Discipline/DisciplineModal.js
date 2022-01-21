import React from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  ListGroup,
  InputGroup,
} from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_DISCIPLINE, UPDATE_DISCIPLINE } from "./mutations";
import { GET_ALL_SPECIALTIES } from "../Specialty/queries";
import Select from "react-select";
import { CreateNotification } from "../Alert";
import { XCircle } from "react-bootstrap-icons";
import { GET_ALL_DISCIPLINES } from "./queries";

function Save({
  item,
  handleCloseModal,
  handleValidation,
  handleValidationSpecialty,
}) {
  const mutation = item.id ? UPDATE_DISCIPLINE : CREATE_DISCIPLINE;
  const [mutateFunction, { loading, error }] = useMutation(mutation, {
    refetchQueries: [GET_ALL_DISCIPLINES],
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  console.log(item);
  item.assigned_disciplines.map((object) => {
    if (object.semester === 0) {
      CreateNotification({
        successful: false,
        message: "Введіть правильний номер семестру",
      });
      return;
    }
  });
  let str = JSON.stringify(item.assigned_disciplines);
  const variables = item.id
    ? {
        variables: {
          id: Number(item.id),
          name: item.name,
          input: str,
        },
      }
    : {
        variables: {
          name: item.name,
          input: str,
        },
      };

  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (!item.name) handleValidation(true);
        if (!item.assigned_disciplines.length) {
          handleValidationSpecialty(false);
        }
        if (item.name && item.assigned_disciplines.length) {
          handleValidation(true, false);
          mutateFunction(variables).then((res) => {
            CreateNotification(
              item.id ? res.data.UpdateDiscipline : res.data.CreateDiscipline
            );
          });
          handleCloseModal();
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}
const findInArraySpec = (array, id) => {
  let spec = {};
  array.map((object) => {
    if (Number(object.id) === Number(id)) {
      spec = object;
    }
  });
  return spec;
};
const findInArraySpeciaty = (array, id) => {
  let check = false;
  array.map((object) => {
    if (Number(object.specialty.id) === Number(id)) {
      check = true;
    }
  });
  return check;
};

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
    if (!findInArraySpeciaty(selectedSpec, selectitem.id))
      options.push({ label: selectitem.name, value: Number(selectitem.id) });
  });
  return (
    <Select
      required
      options={options}
      placeholder="Спеціальність"
      defaultValue={""}
      onChange={(e) => {
        handleValidationSpecialty(true);
        let spec = findInArraySpec(data.GetAllSpecialties, e.value);
        handleChangeItem("assigned_disciplines", selectedSpec);

        selectedSpec.push({
          specialty: { id: spec.id, name: spec.name },
          semester: 0,
        });
      }}
    />
  );
}
class DisciplineModal extends React.Component {
  state = {
    validated: false,
    isValidSpecialty: true,
    selectedSpec: [],
    update: false,
  };
  handleClose = () => {
    this.setState({
      validated: false,
      isValidSpecialty: true,
      selectedSpec: [],
      update: false,
    });
    this.props.handleCloseModal();
  };

  handleValidation = (status) => {
    this.setState({ validated: status });
  };

  handleValidationSpecialty = (status) => {
    this.setState({ isValidSpecialty: status });
  };
  deleteSelectedSpec = (object, selectedSpec) => {
    let arr = selectedSpec;
    arr.splice(arr.indexOf(object), 1);
    console.log(arr);
    this.setState({
      update: true,
      selectedSpec: arr,
    });
    this.props.handleChangeItem("assigned_disciplines", arr);
  };
  setSelectedSpec = (item) => {
    if (
      item.assigned_disciplines.length &&
      this.state.selectedSpec.length === 0 &&
      !this.state.update
    ) {
      let arr = [];
      item.assigned_disciplines.map((object) => {
        arr.push({ specialty: object.specialty, semester: object.semester });
      });
      this.state.selectedSpec = arr;
    }
  };
  setSemester = (id, semester) => {
    if (semester < 1 || semester > 13) {
      CreateNotification({
        successful: false,
        message: "Введіть правильний номер семестру",
      });
      return;
    }
    let arr = this.state.selectedSpec;
    arr.map((object) => {
      if (object.specialty.id === id) object.semester = semester;
    });
    this.setState({
      selectedSpec: arr,
    });
    this.props.handleChangeItem("assigned_disciplines", arr);
  };

  render() {
    const { isopen, handleChangeItem, item } = this.props;
    this.setSelectedSpec(item);
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
                <ListGroup variant="flush">
                  {this.state.selectedSpec[0]
                    ? this.state.selectedSpec.map((object) => {
                        return (
                          <ListGroup.Item key={object.specialty.id}>
                            <label className="col-8">
                              {object.specialty.name}
                            </label>
                            <input
                              placeholder="Семестр"
                              value={object.semester}
                              className="col-3"
                              id={object.specialty.id}
                              type="number"
                              min="0"
                              max="13"
                              required
                              onChange={(e) => {
                                this.setSemester(
                                  object.specialty.id,
                                  e.target.value
                                );
                              }}
                            ></input>
                            <XCircle
                              className="mx-1"
                              type="button"
                              onClick={(e) => {
                                this.deleteSelectedSpec(
                                  object,
                                  this.state.selectedSpec
                                );
                              }}
                            />
                          </ListGroup.Item>
                        );
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
              handleValidationSpecialty={this.handleValidationSpecialty}
              handleValidation={this.handleValidation}
            ></Save>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
export default DisciplineModal;
