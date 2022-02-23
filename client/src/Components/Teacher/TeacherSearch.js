import { Form, Row, InputGroup, FormControl } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import React from "react";
import { GET_ALL_CATHEDRAS } from "../Cathedra/queries";
import { useQuery } from "@apollo/client";
import Select from "react-select";

function SelectCathedra({ handleChangeFilters }) {
  const { error, loading, data } = useQuery(GET_ALL_CATHEDRAS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  console.log(data);
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

class TeacherSearch extends React.Component {
  render() {
    const { handleChangeFilters } = this.props;

    return (
      <div className="d-flex justify-content-center">
        <Form onSubmit={(e) => e.preventDefault()} className="col-8">
          <Form.Group as={Row} className="my-2 mx-2 ">
            <InputGroup className="my-1">
              <InputGroup.Text>
                <Search></Search>
              </InputGroup.Text>
              <FormControl
                placeholder="Прізвище"
                onChange={(e) => handleChangeFilters("surname", e.target.value)}
              />
            </InputGroup>
            <InputGroup className="my-1">
              <SelectCathedra
                handleChangeFilters={handleChangeFilters}
              ></SelectCathedra>
            </InputGroup>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default TeacherSearch;
