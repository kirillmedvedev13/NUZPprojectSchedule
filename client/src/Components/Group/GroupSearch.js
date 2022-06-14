import { Form, Row, InputGroup, FormControl } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import React from "react";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_ALL_SPECIALTIES } from "../Specialty/queries";

function SelectSpecialty({ handleChangeFilters }) {
  const { error, loading, data } = useQuery(GET_ALL_SPECIALTIES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllSpecialties.forEach((item) => {
    options.push({
      label: item.name,
      value: +item.id,
    });
  });
  return (
    <Select
      className="col-12"
      isClearable
      options={options}
      placeholder="Спеціальність"
      onChange={(e) => {
        handleChangeFilters("id_specialty", e ? +e.value : null);
      }}
    />
  );
}

class GroupSearch extends React.Component {
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
                placeholder="Назва групи"
                onChange={(e) => handleChangeFilters("name", e.target.value)}
              />
            </InputGroup>
            <InputGroup className="my-1">
              <SelectSpecialty
                handleChangeFilters={handleChangeFilters}
              ></SelectSpecialty>
            </InputGroup>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default GroupSearch;
