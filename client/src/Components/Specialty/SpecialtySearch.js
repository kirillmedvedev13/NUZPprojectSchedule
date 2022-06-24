import { Form, Row, InputGroup, FormControl } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import React from "react";
import SelectCathedra from "../SelectsSearch/SelectCathedra";

class SpecialtySearch extends React.Component {
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
                placeholder="Назва спеціальності"
                onChange={(e) => handleChangeFilters("name", e.target.value)}
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

export default SpecialtySearch;
