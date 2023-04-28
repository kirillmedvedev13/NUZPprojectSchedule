import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import SelectSpecialty from "../SelectsSearch/SelectSpecialty";
import SelectTeacher from "../SelectsSearch/SelectTeacher";
import SelectAudience from "../SelectsSearch/SelectAudience";
import SelectCathedra from "../SelectsSearch/SelectCathedra";
import SelectGroup from "../SelectsSearch/SelectGroup";

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
            <Form.Label className="col-md-2 my-2">Аудиторія</Form.Label>
            <Col className="col-md-10">
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
            <Form.Label className="col-md-2 my-2">Викладач</Form.Label>
            <Col className="col-md-10">
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
            <Form.Label className="col-md-2 my-2">Група</Form.Label>
            <Col className="col-md-10">
              <SelectGroup
                handleChangeFilters={handleChangeFilters}
              ></SelectGroup>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-md-2 my-2">Спеціальність</Form.Label>
            <Col className="col-md-10">
              <SelectSpecialty
                handleChangeFilters={handleChangeFilters}
              ></SelectSpecialty>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-md-2 my-2">Семестр</Form.Label>
            <Col className="col-md-10">
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
        <Form onSubmit={(e) => e.preventDefault()} className="col-12">
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-md-2 my-2">Вид розкладу</Form.Label>

            <Col className="col-md-10">
              <SelectScheduleType
                handleChangeFilters={handleChangeFilters}
              ></SelectScheduleType>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-md-2 my-2">Кафедра</Form.Label>
            <Col className="col-md-10">
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
