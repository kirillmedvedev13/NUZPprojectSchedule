import { Form, Row, InputGroup, FormControl } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import React from "react";

class CathedraSearch extends React.Component {
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
                placeholder="Кафедра"
                onChange={(e) => handleChangeFilters("name", e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default CathedraSearch;
