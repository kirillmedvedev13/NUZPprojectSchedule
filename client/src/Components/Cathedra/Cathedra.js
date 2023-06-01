import React from "react";
import CathedraTable from "./CathedraTable";
import CathedraSearch from "./CathedraSearch";

class Cathedra extends React.Component {
  state = {
    filters: {
      name: "",
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
        <CathedraSearch
          handleChangeFilters={this.handleChangeFilters}
        ></CathedraSearch>
        <CathedraTable filters={filters}></CathedraTable>
      </>
    );
  }
}

export default Cathedra;
