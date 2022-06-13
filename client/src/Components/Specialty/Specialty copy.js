import React from "react";
import update from "react-addons-update";
import { Button } from "react-bootstrap";
import SpecialtyDialog from "./SpecialtyDialog";
import SpecialtyModal from "./SpecialtyModal";
import SpecialtyTable from "./SpecialtyTable";
import SpecialtySearch from "./SpecialtySearch";

class Specialty extends React.Component {
  state = {
    filters: {
      name: "",
      id_cathedra: null,
    },
    item: {
      id: null,
      name: "",
      code: "",
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
        code: "",
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
        <SpecialtyModal
          isopen={openModal}
          item={item}
          handleChangeItem={this.handleChangeItem}
          handleCloseModal={this.handleCloseModal}
        ></SpecialtyModal>
        <SpecialtyDialog
          isopen={openDialog}
          item={item}
          handleCloseDialog={this.handleCloseDialog}
        ></SpecialtyDialog>
        <SpecialtySearch
          handleChangeFilters={this.handleChangeFilters}
        ></SpecialtySearch>
        <div className="d-flex justify-content-end mx-2 my-2">
          <Button
            variant="primary"
            className="col-auto"
            onClick={this.handleOpenModal}
          >
            Додати Спеціальність
          </Button>
        </div>
        <SpecialtyTable
          handleOpenModal={this.handleOpenModal}
          handleOpenDialog={this.handleOpenDialog}
          handleSetItem={this.handleSetItem}
          filters={filters}
        ></SpecialtyTable>
      </>
    );
  }
}

export default Specialty;
