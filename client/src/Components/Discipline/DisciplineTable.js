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
  updateItem,
  handleUpdateItem,
}) {
  const { loading, error, data } = useQuery(GET_ALL_DISCIPLINES, {
    variables: filters,
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <tbody>
      {data.GetAllDisciplines.map((item) => {
        if (updateItem) {
          if (Number(updateItem.id) === Number(item.id)) {
            if (JSON.stringify(item) !== JSON.stringify(updateItem)) {
              handleSetItem(item);
              handleUpdateItem(null);
            }
          }
        }
        return (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>
              <ul className="px-0">
                {item.assigned_disciplines.map((item1) => {
                  return (
                    <li key={item1.id}>
                      {item1.specialty.name} - {item1.semester}
                    </li>
                  );
                })}
              </ul>
            </td>
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
        );
      })}
    </tbody>
  );
}
class DisciplineTable extends React.Component {
  render() {
    const {
      filters,
      handleOpenModal,
      handleOpenDialog,
      handleSetItem,
      handleUpdateItem,
      updateItem,
    } = this.props;
    return (
      <div className="container-fluid w-100">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Дисципліна</th>
              <th>Спеціальність - Семестер</th>
              <th></th>
            </tr>
          </thead>
          <DataTable
            filters={filters}
            handleSetItem={handleSetItem}
            handleOpenDialog={handleOpenDialog}
            handleOpenModal={handleOpenModal}
            handleUpdateItem={handleUpdateItem}
            updateItem={updateItem}
          ></DataTable>
        </Table>
      </div>
    );
  }
}
export default DisciplineTable;
