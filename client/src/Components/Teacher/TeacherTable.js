import React from "react";
import { Table } from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { useQuery } from "@apollo/client";
import { GET_ALL_TEACHERS } from "./queries";

function DataTable({
  filters,
  handleSetItem,
  handleOpenDialog,
  handleOpenModal,
}) {
  const { loading, error, data } = useQuery(GET_ALL_TEACHERS, {
    variables: filters,
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <tbody>
      {data.GetAllTeachers.map((item) => (
        <tr key={item.id}>
          <td>{item.surname}</td>
          <td>{item.name}</td>
          <td>{item.patronymic}</td>
          <td>{item.cathedra.name + " (" + item.cathedra.short_name + ")"}</td>
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
      ))}
    </tbody>
  );
}

class TeacherTable extends React.Component {
  render() {
    const { filters, handleOpenModal, handleOpenDialog, handleSetItem } =
      this.props;
    return (
      <div className="container-fluid w-100">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Прізвище</th>
              <th>Ім'я</th>

              <th>По-батькові</th>
              <th>Кафедра</th>
              <th></th>
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

export default TeacherTable;
