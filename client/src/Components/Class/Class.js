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
      id_discipline: null,
      id_teacher: null,
      id_group: null,
      id_specialty: null,
      semester: null,
    },
    item: {
      id: null,
      times_per_week: "",
      type_class: {
        id: null,
      },
      assigned_discipline: {
        id: null,
      },
      assigned_groups: [],
      assigned_teachers: [],
      recommended_audiences: [],
    },
    updateItem: null,
    openModal: false,
    openDialog: false,
  };

  //обновляет переданный объект в модальном окне
  handleUpdateItem = (item) => {
    this.setState({
      updateItem: item,
    })
  }

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
        times_per_week: "",
        type_class: {
          id: null,
        },
        assigned_discipline: {
          id: null,
        },
        assigned_groups: [],
        assigned_teachers: [],
        recommended_audiences: [],
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
    this.setState({
      item
    });
  };

  render() {
    const { filters, item, openModal, openDialog, updateItem } = this.state;
    return (
      <>
        <ClassModal
          isopen={openModal}
          item={item}
          handleChangeItem={this.handleChangeItem}
          handleCloseModal={this.handleCloseModal}
          handleUpdateItem={this.handleUpdateItem}
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
          handleUpdateItem={this.handleUpdateItem}
          updateItem={updateItem}
        ></ClassTable>
      </>
    );
  }
}

export default Class;
