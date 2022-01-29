import React from "react";
import { Table } from "react-bootstrap";
import ScheduleAudienceTable from "./ScheduleAudienceTable";
import ScheduleGroupTable from "./ScheduleGroupTable";
import ScheduleTeacherTable from "./ScheduleTeacherTable";

function SwitchTable({
  filters,
  handleSetItem,
  handleOpenDialog,
  handleOpenModal,
  handleUpdateItem,
  updateItem,
}) {
  switch (filters.scheduleType) {
    case "teacher":
      return (
        <ScheduleTeacherTable
          filters={filters}
          handleSetItem={handleSetItem}
          handleOpenDialog={handleOpenDialog}
          handleOpenModal={handleOpenModal}
          handleUpdateItem={handleUpdateItem}
          updateItem={updateItem}
        ></ScheduleTeacherTable>
      );
      break;
    case "audience":
      return (
        <ScheduleAudienceTable
          filters={filters}
          handleSetItem={handleSetItem}
          handleOpenDialog={handleOpenDialog}
          handleOpenModal={handleOpenModal}
          handleUpdateItem={handleUpdateItem}
          updateItem={updateItem}
        ></ScheduleAudienceTable>
      );
      break;
    default:
      return (
        <ScheduleGroupTable
          filters={filters}
          handleSetItem={handleSetItem}
          handleOpenDialog={handleOpenDialog}
          handleOpenModal={handleOpenModal}
          handleUpdateItem={handleUpdateItem}
          updateItem={updateItem}
        ></ScheduleGroupTable>
      );
      break;
  }
}
class ScheduleTable extends React.Component {
  render() {
    const {
      filters,
      handleOpenModal,
      handleOpenDialog,
      handleSetItem,
      updateItem,
      handleUpdateItem,
    } = this.props;
    console.log(filters);
    return (
      <SwitchTable
        filters={filters}
        handleSetItem={handleSetItem}
        handleOpenDialog={handleOpenDialog}
        handleOpenModal={handleOpenModal}
        handleUpdateItem={handleUpdateItem}
        updateItem={updateItem}
      ></SwitchTable>
    );
  }
}

export default ScheduleTable;
