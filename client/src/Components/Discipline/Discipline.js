import React from "react";
import update from "react-addons-update";
import { Button } from "react-bootstrap";
import DisciplineDialog from "./DisciplineDialog";
import DisciplineModal from "./DisciplineModal";
import DisciplineTable from "./DisciplineTable";
import DisciplineSearch from "./DisciplineSearch";

class Discipline extends React.Component {
  state = {
    filters: {
      name: "",
      id_discipline: null,
    },
  };
  handleChangeFilters = (name, value) => {
    this.setState((PrevState) => ({
      filters: Object.assign({ ...PrevState.filters }, { [name]: value }),
    }));
  };
  render() {
    const { filters } = this.state;
    return (
      <>
        <DisciplineSearch
          handleChangeFilters={this.handleChangeFilters}
        ></DisciplineSearch>

        <DisciplineTable filters={filters}></DisciplineTable>
      </>
    );
  }
}

export default Discipline;
