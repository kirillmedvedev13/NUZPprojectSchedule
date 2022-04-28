import React from "react";
import { GET_ALL_TEACHERS } from "../Teacher/queries";
import { GET_ALL_GROUPS } from "../Group/queries";
import { Form, Row, Col } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_ALL_SPECIALTIES } from "../Specialty/queries";
import { GET_ALL_AUDIENCES } from "../Audience/queries";
import { GET_ALL_CATHEDRAS } from "../Cathedra/queries";

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
function SelectAudience({ handleChangeFilters }) {
  const { error, loading, data } = useQuery(GET_ALL_AUDIENCES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllAudiences.forEach((item) => {
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
      placeholder="Аудиторія"
      onChange={(e) => {
        handleChangeFilters("id_audience", e ? Number(e.value) : null);
      }}
    />
  );
}
function SelectCathedra({ handleChangeFilters }) {
  const { error, loading, data } = useQuery(GET_ALL_CATHEDRAS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllCathedras.forEach((item) => {
    options.push({
      label: item.name + " (" + item.short_name + ")",
      value: Number(item.id),
    });
  });
  return (
    <Select
      className="col-12"
      isClearable
      options={options}
      placeholder="Кафедра"
      onChange={(e) => {
        handleChangeFilters("id_cathedra", e ? Number(e.value) : null);
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
      label: item.specialty.cathedra.short_name + "-" + item.name,
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

function SelectScheduleType({ handleChangeFilters }) {
  let options = [
    { value: "group", label: "По групам" },
    { value: "teacher", label: "По викладачам" },
    { value: "audience", label: "По аудиторіям" },
  ];
  return (
    <Select
      className="col-12"
      options={options}
      placeholder="Вид розкладу"
      defaultValue={{ value: "group", label: "По групам" }}
      onChange={(e) => {
        handleChangeFilters("scheduleType", e ? e.value : null);
      }}
    />
  );
}

function SwitchFilters({ filters, handleChangeFilters }) {
  switch (filters.scheduleType) {
    case "audience":
      return (
        <>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-auto text-end">Аудиторія</Form.Label>
            <Col className="col-10">
              <SelectAudience
                handleChangeFilters={handleChangeFilters}
              ></SelectAudience>
            </Col>
          </Form.Group>
        </>
      );
    case "teacher":
      return (
        <>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-auto text-end">Викладач</Form.Label>
            <Col className="col-10">
              <SelectTeacher
                handleChangeFilters={handleChangeFilters}
              ></SelectTeacher>
            </Col>
          </Form.Group>
        </>
      );
    default:
      return (
        <>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-auto text-end">Група</Form.Label>
            <Col className="col-10">
              <SelectGroup
                handleChangeFilters={handleChangeFilters}
              ></SelectGroup>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-auto text-end">Спеціальність</Form.Label>
            <Col className="col-10">
              <SelectSpecialty
                handleChangeFilters={handleChangeFilters}
              ></SelectSpecialty>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-auto text-end">Семестр</Form.Label>
            <Col className="col-10">
              <Form.Control
                type="number"
                min={1}
                max={20}
                onChange={(e) => {
                  handleChangeFilters(
                    "semester",
                    e ? Number(e.target.value) : null
                  );
                }}
              ></Form.Control>
            </Col>
          </Form.Group>
        </>
      );
  }
}
class ScheduleSearch extends React.Component {
  render() {
    const { filters, handleChangeFilters } = this.props;

    return (
      <div className="d-flex justify-content-center">
        <Form onSubmit={(e) => e.preventDefault()} className="col-8">
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-auto text-end">Вид розкладу</Form.Label>
            <Col className="col-10">
              <SelectScheduleType
                handleChangeFilters={handleChangeFilters}
              ></SelectScheduleType>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-auto text-end">Кафедра</Form.Label>
            <Col className="col-10">
              <SelectCathedra
                handleChangeFilters={handleChangeFilters}
              ></SelectCathedra>
            </Col>
          </Form.Group>
          <SwitchFilters
            filters={filters}
            handleChangeFilters={handleChangeFilters}
          />
        </Form>
      </div>
    );
  }
}
export default ScheduleSearch;
