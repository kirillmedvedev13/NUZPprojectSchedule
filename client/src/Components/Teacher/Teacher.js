import React from "react";
import TeacherTable from "./TeacherTable";
import TeacherSearch from "./TeacherSearch";

class Teacher extends React.Component {
  state = {
    filters: {
      surname: "",
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
        <TeacherSearch
          handleChangeFilters={this.handleChangeFilters}
        ></TeacherSearch>

        <TeacherTable filters={filters}></TeacherTable>
      </>
    );
  }
}

export default Teacher;
