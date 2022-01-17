import React from "react";
import update from "react-addons-update";
import { Button } from "react-bootstrap";
import GroupDialog from "./GroupDialog";
import GroupModal from "./GroupModal";
import GroupTable from "./GroupTable";
import GroupSearch from "./GroupSearch";

class Group extends React.Component {
  state = {
    filters: {
      name: "",
      id_specialty: null,
    },
    item: {
      id: null,
      name: "",
      id_specialty: null,
      number_students: "",
      semester: "",
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
        id_specialty: null,
        number_students: "",
        semester: "",
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
        $merge: { ...item, id_specialty: Number(item.specialty.id) },
      }),
    }));
  };

  render() {
    const { filters, item, openModal, openDialog } = this.state;
    return (
      <>
        <GroupModal
          isopen={openModal}
          item={item}
          handleChangeItem={this.handleChangeItem}
          handleCloseModal={this.handleCloseModal}
        ></GroupModal>
        <GroupDialog
          isopen={openDialog}
          item={item}
          handleCloseDialog={this.handleCloseDialog}
        ></GroupDialog>
        <GroupSearch
          handleChangeFilters={this.handleChangeFilters}
        ></GroupSearch>
        <div className="d-flex justify-content-end mx-2 my-2">
          <Button
            variant="primary"
            className="col-auto"
            onClick={this.handleOpenModal}
          >
            Додати групу
          </Button>
        </div>
        <GroupTable
          handleOpenModal={this.handleOpenModal}
          handleOpenDialog={this.handleOpenDialog}
          handleSetItem={this.handleSetItem}
          filters={filters}
        ></GroupTable>
      </>
    );
  }
}

export default Group;
