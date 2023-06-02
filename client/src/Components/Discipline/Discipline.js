import React from "react";
import DisciplineTable from "./DisciplineTable";
import DisciplineSearch from "./DisciplineSearch";

class Discipline extends React.Component {
  state = {
    filters: {
      name: "",
      id_discipline: null,
    },
  };
  componentDidMount() {
    document.title = this.props.title;
  }
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
