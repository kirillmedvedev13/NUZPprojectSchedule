import React from "react";
import { Table } from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { useQuery } from "@apollo/client";
import { GET_ALL_AUDIENCES } from "./queries";

function DataTable({
  filters,
  handleSetItem,
  handleOpenDialog,
  handleOpenModal,
  handleUpdateItem,
  updateItem
}) {
  const { loading, error, data } = useQuery(GET_ALL_AUDIENCES, {
    variables: filters,
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <tbody>
      {
        data.GetAllAudiences.map((item) => {
          if (updateItem) {
            if (Number(updateItem.id) === Number(item.id)) {
              if(JSON.stringify(item) !== JSON.stringify(updateItem)){
                handleSetItem(item);
                handleUpdateItem(null);
              }
            }
          }
          return (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.type_class.name}</td>
              <td>{item.capacity}</td>
              <td>
                <ul className="mx-0 px-0">
                  {
                    item.assigned_audiences.map((item) => {
                      return (<li key={item.cathedra.id}>{item.cathedra.name}</li>)
                    })
                  }
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
          )
        }
        )
      }
    </tbody>
  );
}

class AudienceTable extends React.Component {
  render() {
    const { filters, handleOpenModal, handleOpenDialog, handleSetItem, handleUpdateItem, updateItem } =
      this.props;
    return (
      <div className="container-fluid w-100">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Назва аудиторії</th>
              <th>Тип</th>
              <th>Вмісткість</th>
              <th>Закріплені кафедри</th>
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

export default AudienceTable;
