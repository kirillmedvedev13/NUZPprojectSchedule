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
    item: {
      id: null,
      name: "",
      assigned_disciplines: [],
    },
    openModal: false,
    openDialog: false,
  };

  handleOpenDialog = () => {
    this.setState({
      openDialog: true,
    });
  };
  handleCloseDialog = () => {
    this.setState({
      openDialog: false,
    });
  };
  handleOpenModal = () => {
    this.setState({
      openModal: true,
    });
  };
  handleCloseModal = () => {
    this.setState({
      openModal: false,
      item: {
        id: null,
        name: "",
        assigned_disciplines: [],
      },
    });
  };
  handleChangeItem = (name, value) => {
    this.setState((PrevState) => ({
      item: update(PrevState.item, { $merge: { [name]: value } }),
    }));
  };

  handleChangeFilters = (name, value) => {
    console.log("filters");
    this.setState((PrevState) => ({
      filters: update(PrevState.filters, { $merge: { [name]: value } }),
    }));
  };
  handleSetItem = (item) => {
    this.setState((PrevState) => ({
      item: update(PrevState.item, {
        $merge: {
          ...item,
        },
      }),
    }));
  };
  render() {
    const { filters, item, openModal, openDialog } = this.state;
    return (
      <>
        <DisciplineModal
          isopen={openModal}
          item={item}
          handleChangeItem={this.handleChangeItem}
          handleCloseModal={this.handleCloseModal}
        ></DisciplineModal>
        <DisciplineDialog
          isopen={openDialog}
          item={item}
          handleCloseDialog={this.handleCloseDialog}
        ></DisciplineDialog>
        <DisciplineSearch
          handleChangeFilters={this.handleChangeFilters}
        ></DisciplineSearch>
        <div className="d-flex justify-content-end mx-2 my-2">
          <Button
            variant="primary"
            className="col-auto"
            onClick={this.handleOpenModal}
          >
            Додати Дісципліну
          </Button>
        </div>
        <DisciplineTable
          handleOpenModal={this.handleOpenModal}
          handleOpenDialog={this.handleOpenDialog}
          handleSetItem={this.handleSetItem}
          filters={filters}
        ></DisciplineTable>
      </>
    );
  }
}

export default Discipline;
