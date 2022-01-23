import React from "react";
import update from "react-addons-update";
import { Button } from "react-bootstrap";
import ClassDialog from "./ClassDialog";
import ClassModal from "./ClassModal";
import ClassTable from "./ClassTable";
import ClassSearch from "./ClassSearch";

class Class extends React.Component {
  state = {
    filters: {
      name: "",
      id_discipline: null,
      id_teacher: null,
      id_group: null,
    },
    item: {
      id: null,
      type_class: null,
      number_per_week: null,
      assigned_discipline: [],
      assigned_groups: [],
      assigned_teachers: [],
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
        type_class: null,
        number_per_week: null,
        assigned_discipline: [],
        assigned_groups: [],
        assigned_teachers: [],
      },
    });
  };

  handleChangeItem = (name, value) => {
    this.setState((PrevState) => ({
      item: update(PrevState.item, { $merge: { [name]: value } }),
    }));
  };

  handleChangeFilters = (name, value) => {
    this.setState((PrevState) => ({
      filters: update(PrevState.filters, { $merge: { [name]: value } }),
    }));
  };

  handleSetItem = (item) => {
    this.setState((PrevState) => ({
      item: update(PrevState.item, {
        $merge: { ...item },
      }),
    }));
  };

  render() {
    const { filters, item, openModal, openDialog } = this.state;
    return (
      <>
        <ClassModal
          isopen={openModal}
          item={item}
          handleChangeItem={this.handleChangeItem}
          handleCloseModal={this.handleCloseModal}
        ></ClassModal>
        <ClassDialog
          isopen={openDialog}
          item={item}
          handleCloseDialog={this.handleCloseDialog}
        ></ClassDialog>
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
          handleOpenModal={this.handleOpenModal}
          handleOpenDialog={this.handleOpenDialog}
          handleSetItem={this.handleSetItem}
          filters={filters}
        ></ClassTable>
      </>
    );
  }
}

export default Class;
