import React from "react";
import update from "react-addons-update";
import { Button } from "react-bootstrap";
import TeacherDialog from "./TeacherDialog";
import TeacherModal from "./TeacherModal";
import TeacherTable from "./TeacherTable";
import TeacherSearch from "./TeacherSearch";

class Teacher extends React.Component {
  state = {
    filters: {
      surname: "",
      id_cathedra: null,
    },
    item: {
      id: null,
      name: "",
      surname: "",
      patronymic: "",
      cathedra: {
        id: null,
      },
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
        surname: "",
        patronymic: "",
        cathedra: {
          id: null,
        },
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
    this.setState(
      { item }
    );
  };

  render() {
    const { filters, item, openModal, openDialog } = this.state;
    return (
      <>
        <TeacherModal
          isopen={openModal}
          item={item}
          handleChangeItem={this.handleChangeItem}
          handleCloseModal={this.handleCloseModal}
        ></TeacherModal>
        <TeacherDialog
          isopen={openDialog}
          item={item}
          handleCloseDialog={this.handleCloseDialog}
        ></TeacherDialog>
        <TeacherSearch
          handleChangeFilters={this.handleChangeFilters}
        ></TeacherSearch>
        <div className="d-flex justify-content-end mx-2 my-2">
          <Button
            variant="primary"
            className="col-auto"
            onClick={this.handleOpenModal}
          >
            Додати Викладача
          </Button>
        </div>
        <TeacherTable
          handleOpenModal={this.handleOpenModal}
          handleOpenDialog={this.handleOpenDialog}
          handleSetItem={this.handleSetItem}
          filters={filters}
        ></TeacherTable>
      </>
    );
  }
}

export default Teacher;
