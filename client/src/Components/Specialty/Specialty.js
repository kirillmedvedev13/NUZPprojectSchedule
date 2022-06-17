import React from "react";
import SpecialtyTable from "./SpecialtyTable";
import SpecialtySearch from "./SpecialtySearch";

class Specialty extends React.Component {
  state = {
    filters: {
      name: "",
      id_cathedra: null,
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
        <SpecialtySearch
          handleChangeFilters={this.handleChangeFilters}
        ></SpecialtySearch>
        <SpecialtyTable filters={filters}></SpecialtyTable>
      </>
    );
  }
}

export default Specialty;
