import React from "react";
import AudienceTable from "./AudienceTable";
import AudienceSearch from "./AudienceSearch";

class Audience extends React.Component {
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
        <AudienceSearch
          handleChangeFilters={this.handleChangeFilters}
        ></AudienceSearch>
        <AudienceTable filters={filters}></AudienceTable>
      </>
    );
  }
}

export default Audience;
