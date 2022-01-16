import { useQuery } from "@apollo/client";
import React from "react";
import { Table } from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { GET_ALL_DISCIPLINES } from "./queries";
function DataTable({
  filters,
  handleSetItem,
  handleOpenDialog,
  handleOpenModal,
}) {
  const { loading, error, data } = useQuery(GET_ALL_DISCIPLINES, {
    variables: filters,
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <tbody>
      {data.GetAllDisciplines.map((item) =>
        item.assigned_disciplines.map((item1) => (
          <tr key={item1.id}>
            <td>{item.name}</td>
            <td>{item1.specialty.name}</td>
            <td>{item1.semester}</td>
            <td className="col-2" onClick={(e) => handleSetItem(item)}>
              <PencilSquare
                className="mx-1"
                type="button"
                onClick={(e) => handleOpenModal()}
              />
              <XCircle
                className="mx-1"
                type="button"
                onClick={(e) => handleOpenDialog()}
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
class DisciplineTable extends React.Component {
  render() {
    const { filters, handleOpenModal, handleOpenDialog, handleSetItem } =
      this.props;
    return (
      <div className="container-fluid w-100">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Назва дісципліни</th>
              <th>Назва спеціальності</th>

              <th>Семестер</th>
            </tr>
          </thead>
          <DataTable
            filters={filters}
            handleSetItem={handleSetItem}
            handleOpenDialog={handleOpenDialog}
            handleOpenModal={handleOpenModal}
          ></DataTable>
        </Table>
      </div>
    );
  }
}
export default DisciplineTable;
