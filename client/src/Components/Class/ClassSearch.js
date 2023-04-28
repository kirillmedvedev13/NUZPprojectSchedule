import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import SelectSpecialty from "../SelectsSearch/SelectSpecialty";
import SelectDiscipine from "../SelectsSearch/SelectDiscipline";
import SelectTeacher from "../SelectsSearch/SelectTeacher";
import SelectGroup from "../SelectsSearch/SelectGroup";

class ClassSearch extends React.Component {
  render() {
    const { handleChangeFilters } = this.props;

    return (
      <div className="d-flex justify-content-center">
        <Form onSubmit={(e) => e.preventDefault()} className="col-12">
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-md-2 my-2">Спеціальність</Form.Label>
            <Col className="col-md-10">
              <SelectSpecialty
                handleChangeFilters={handleChangeFilters}
              ></SelectSpecialty>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-md-2 my-2">Дисципліна</Form.Label>
            <Col className="col-md-10">
              <SelectDiscipine
                handleChangeFilters={handleChangeFilters}
              ></SelectDiscipine>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-md-2 my-2">Викладач</Form.Label>
            <Col className="col-md-10">
              <SelectTeacher
                handleChangeFilters={handleChangeFilters}
              ></SelectTeacher>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-md-2 my-2">Група</Form.Label>
            <Col className="col-md-10">
              <SelectGroup
                handleChangeFilters={handleChangeFilters}
              ></SelectGroup>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-md-2 my-2">Семестр</Form.Label>
            <Col className="col-md-10">
              <Form.Control
                type="number"
                min={1}
                max={14}
                onChange={(e) => {
                  handleChangeFilters("semester", e ? +e.target.value : null);
                }}
              ></Form.Control>
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
export default ClassSearch;
