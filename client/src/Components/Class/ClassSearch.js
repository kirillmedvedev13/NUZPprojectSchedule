import React from "react";
import { GET_ALL_TEACHERS } from "../Teacher/queries";
import { GET_ALL_GROUPS } from "../Group/queries";
import { Form, Row, Col } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_ALL_DISCIPLINES } from "../Discipline/queries";
import { GET_ALL_SPECIALTIES } from "../Specialty/queries"

function SelectSpecialty({ handleChangeFilters }) {
  const { error, loading, data } = useQuery(GET_ALL_SPECIALTIES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllSpecialties.forEach((item) => {
    options.push({
      label: item.name,
      value: Number(item.id),
    });
  });
  return (
    <Select
      className="col-12"
      isClearable
      options={options}
      placeholder="Спеціальність"
      onChange={(e) => {
        handleChangeFilters("id_specialty", e ? Number(e.value) : null);
      }}
    />
  );
}

function SelectDiscipine({ handleChangeFilters }) {
  const { error, loading, data } = useQuery(GET_ALL_DISCIPLINES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllDisciplines.forEach((item) => {
    options.push({
      label: item.name,
      value: Number(item.id),
    });
  });
  return (
    <Select
      className="col-12"
      isClearable
      options={options}
      placeholder="Дисципліна"
      onChange={(e) => {
        handleChangeFilters("id_discipline", e ? Number(e.value) : null);
      }}
    />
  );
}

function SelectTeacher({ handleChangeFilters }) {
  const { error, loading, data } = useQuery(GET_ALL_TEACHERS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllTeachers.forEach((item) => {
    options.push({
      label: item.surname + " " + item.name,
      value: Number(item.id),
    });
  });
  return (
    <Select
      className="col-12"
      isClearable
      options={options}
      placeholder="Викладач"
      onChange={(e) => {
        handleChangeFilters("id_teacher", e ? Number(e.value) : null);
      }}
    />
  );
}

function SelectGroup({ handleChangeFilters }) {
  const { error, loading, data } = useQuery(GET_ALL_GROUPS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllGroups.forEach((item) => {
    options.push({
      label: item.name,
      value: Number(item.id),
    });
  });
  return (
    <Select
      className="col-12"
      isClearable
      options={options}
      placeholder="Група"
      onChange={(e) => {
        handleChangeFilters("id_group", e ? Number(e.value) : null);
      }}
    />
  );
}
class ClassSearch extends React.Component {
  render() {
    const { handleChangeFilters } = this.props;

    return (
      <div className="d-flex justify-content-center">
        <Form onSubmit={(e) => e.preventDefault()} className="col-8">
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-auto text-end">Спеціальність</Form.Label>
            <Col className="col-10">
              <SelectSpecialty
                handleChangeFilters={handleChangeFilters}
              ></SelectSpecialty>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-auto text-end">Дисципліна</Form.Label>
            <Col className="col-10">
              <SelectDiscipine
                handleChangeFilters={handleChangeFilters}
              ></SelectDiscipine>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-auto text-end">Викладач</Form.Label>
            <Col className="col-10">
              <SelectTeacher
                handleChangeFilters={handleChangeFilters}
              ></SelectTeacher>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-auto text-end">Група</Form.Label>
            <Col className="col-10">
              <SelectGroup
                handleChangeFilters={handleChangeFilters}
              ></SelectGroup>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-auto text-end">Семестр</Form.Label>
            <Col className="col-10">
              <Form.Control
                placeholder="Семестр"
                onChange={(e) => {
                  handleChangeFilters("semester", Number(e.target.value))
                }
                }
              ></Form.Control>
            </Col>
          </Form.Group>
        </Form>
      </div >
    );
  }
}
export default ClassSearch;
