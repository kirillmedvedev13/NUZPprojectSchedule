import React from "react";
import GroupTable from "./GroupTable";
import GroupSearch from "./GroupSearch";

class Group extends React.Component {
  state = {
    filters: {
      name: "",
      id_specialty: null,
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
        <GroupSearch
          handleChangeFilters={this.handleChangeFilters}
        ></GroupSearch>
        <GroupTable
          filters={filters}
        ></GroupTable>
      </>
    );
  }
}

export default Group;
