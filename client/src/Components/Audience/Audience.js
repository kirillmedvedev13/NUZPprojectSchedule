import React from "react";
import { Button } from "react-bootstrap";
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
        <div className="d-flex justify-content-end mx-2 my-2">
          <Button
            variant="primary"
            className="col-auto"
            onClick={this.handleOpenModal}
          >
            Додати аудиторiю
          </Button>
        </div>
        <AudienceTable filters={filters}></AudienceTable>
      </>
    );
  }
}

export default Audience;
