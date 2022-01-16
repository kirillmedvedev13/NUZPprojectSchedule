import { useQuery } from "@apollo/client";
import React from "react";
function DataTable({
  filters,
  handleSetItem,
  handleOpenDialog,
  handleOpenModal,
}) {
  const { loading, error, data } = useQuery();
}
class DisciplineTable extends React.Component {
  render() {
    return <></>;
  }
}
export default DisciplineTable;
