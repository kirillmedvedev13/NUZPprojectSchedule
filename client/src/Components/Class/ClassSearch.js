import React from "react";
import { GET_ALL_TEACHERS } from "../Teacher/queries";

import { GET_ALL_GROUPS } from "../Group/queries";
import { Form, Row, InputGroup, FormControl } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_ALL_DISCIPLINES } from "../Discipline/queries";

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
          <Form.Group as={Row} className="my-2 mx-2 ">
            <InputGroup className="my-1">
              <SelectDiscipine
                handleChangeFilters={handleChangeFilters}
              ></SelectDiscipine>
            </InputGroup>
            <InputGroup className="my-1">
              <SelectTeacher
                handleChangeFilters={handleChangeFilters}
              ></SelectTeacher>
            </InputGroup>
            <InputGroup className="my-1">
              <SelectGroup
                handleChangeFilters={handleChangeFilters}
              ></SelectGroup>
            </InputGroup>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
export default ClassSearch;
