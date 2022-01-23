import { useQuery } from "@apollo/client";
import React from "react";
import { Table } from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { GET_ALL_CLASSES } from "./queries";
function DataTable({
  filters,
  handleSetItem,
  handleOpenDialog,
  handleOpenModal,
}) {
  const { loading, error, data } = useQuery(GET_ALL_CLASSES, {
    variables: filters,
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <tbody>
      {data.GetAllClasses.map((item) => (
        <tr key={item.id}>
          <td>
            {item.assigned_discipline.discipline.name} (
            {item.assigned_discipline.specialty.name})
          </td>
          <td>{item.type_class.name}</td>
          <td>{item.times_per_week}</td>
          <td>
            <Table>
              <tbody>
                {item.assigned_teachers.map((obj) => {
                  return (
                    <tr key={obj.teacher.id}>
                      <td>{obj.teacher.surname + " " + obj.teacher.name}</td>
                      <td>{obj.teacher.cathedra.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </td>
          <td>
            <Table>
              <tbody>
                {item.assigned_groups.map((obj) => {
                  return (
                    <tr key={obj.group.id}>
                      <td>{obj.group.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </td>
          <td>
            <Table>
              <tbody>
                {item.recommended_audiences.map((obj) => {
                  return (
                    <tr key={obj.audience.id}>
                      <td>{obj.audience.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
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
      ))}
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
              <th>Дисципліна</th>
              <th>Тип заняття</th>
              <th>Кількість на тиждень</th>
              <th>Викладачі</th>
              <th>Групи</th>
              <th>Рекомендовані аудиторії</th>
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
export default DisciplineTable;
