import React from "react";
import { Button } from "react-bootstrap";
import ClassTable from "./ClassTable";
import ClassSearch from "./ClassSearch";

class Class extends React.Component {
  state = {
    filters: {
      id_discipline: null,
      id_teacher: null,
      id_group: null,
      id_specialty: null,
      semester: null,
    },
  };
  handleChangeFilters = (name, value) => {
    this.setState((PrevState) => ({
      filters: Object.assign({ ...PrevState.filters }, { [name]: value })
    }));
  };

  render() {
    const { filters } = this.state;
    return (
      <>
        <ClassSearch
          handleChangeFilters={this.handleChangeFilters}
        ></ClassSearch>
        <div className="d-flex justify-content-end mx-2 my-2">
          <Button
            variant="primary"
            className="col-auto"
            onClick={this.handleOpenModal}
          >
            Додати Занняття
          </Button>
        </div>
        <ClassTable
          filters={filters}
        ></ClassTable>
      </>
    );
  }
}

export default Class;
