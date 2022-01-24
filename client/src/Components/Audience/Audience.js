import React from "react";
import update from "react-addons-update";
import { Button } from "react-bootstrap";
import AudienceDialog from "./AudienceDialog";
import AudienceModal from "./AudienceModal";
import AudienceTable from "./AudienceTable";
import AudienceSearch from "./AudienceSearch";

class Audience extends React.Component {
  state = {
    filters: {
      name: "",
      id_cathedra: null,
    },
    item: {
      id: null,
      name: "",
      capacity: "",
      type_class: {
        id: null,
        name: "",
      },
      assigned_audiences: []
    },
    updateItem:  null,
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
        name: "",
        capacity: "",
        type_class: {
          id: null,
          name: "",
        },
        assigned_audiences: []
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
        <AudienceModal
          isopen={openModal}
          item={item}
          handleChangeItem={this.handleChangeItem}
          handleCloseModal={this.handleCloseModal}
          handleUpdateItem={this.handleUpdateItem}
        ></AudienceModal>
        <AudienceDialog
          isopen={openDialog}
          item={item}
          handleCloseDialog={this.handleCloseDialog}
        ></AudienceDialog>
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
        <AudienceTable
          handleOpenModal={this.handleOpenModal}
          handleOpenDialog={this.handleOpenDialog}
          handleSetItem={this.handleSetItem}
          filters={filters}
          handleUpdateItem={this.handleUpdateItem}
          updateItem={updateItem}
        ></AudienceTable>
      </>
    );
  }
}

export default Audience;
