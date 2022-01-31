import React from "react";
import ScheduleTable from "./ScheduleTable";
import update from "react-addons-update";
import ScheduleSearch from "./ScheduleSearch";

class Schedule extends React.Component {
  state = {
    filters: {
      scheduleType: "group",
      id_specialty: null,
      id_teacher: null,
      id_group: null,
      id_audience: null,
      id_cathedra: null,
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
    });
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
      item,
    });
  };
  render() {
    const { filters, item, openModal, openDialog, updateItem } = this.state;
    return (
      <>
        <ScheduleSearch
          filters={filters}
          handleChangeFilters={this.handleChangeFilters}
        ></ScheduleSearch>
        <ScheduleTable
          handleOpenModal={this.handleOpenModal}
          handleOpenDialog={this.handleOpenDialog}
          handleSetItem={this.handleSetItem}
          filters={filters}
          handleUpdateItem={this.handleUpdateItem}
          updateItem={updateItem}
        ></ScheduleTable>
      </>
    );
  }
}

export default Schedule;
