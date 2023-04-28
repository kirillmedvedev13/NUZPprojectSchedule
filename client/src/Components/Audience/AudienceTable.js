import React from "react";
import { Table } from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { useQuery } from "@apollo/client";
import { GET_ALL_AUDIENCES } from "./queries";
import AudienceModal from "./AudienceModal";
import AudienceDialog from "./AudienceDialog";
import { Button } from "react-bootstrap";
import cloneDeep from "clone-deep";

function DataTable({
  filters,
  handleSetItem,
  handleOpenDialog,
  handleOpenModal,
  openModal,
  openDialog,
  item,
  handleChangeItem,
  handleCloseModal,
  handleCloseDialog,
}) {
  const { loading, error, data, refetch } = useQuery(GET_ALL_AUDIENCES, {
    variables: filters,
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <>
      <tbody>
        {data.GetAllAudiences.map((item) => {
          return (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.type_class.name}</td>
              <td>{item.capacity}</td>
              <td>
                <ul className="mx-0 px-0">
                  {item.assigned_audiences.map((item) => {
                    return (
                      <li key={item.cathedra.id}>
                        {item.cathedra.name +
                          " (" +
                          item.cathedra.short_name +
                          ")"}
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
      <AudienceModal
        isopen={openModal}
        item={item}
        handleChangeItem={handleChangeItem}
        handleCloseModal={handleCloseModal}
        refetch={refetch}
      ></AudienceModal>
      <AudienceDialog
        isopen={openDialog}
        item={item}
        handleCloseDialog={handleCloseDialog}
        refetch={refetch}
      ></AudienceDialog>
    </>
  );
}

class AudienceTable extends React.Component {
  defState = {
    item: {
      id: null,
      name: "",
      capacity: "",
      type_class: {
        id: null,
        name: "",
      },
      assigned_audiences: [],
    },
    openModal: false,
    openDialog: false,
  };
  state = cloneDeep(this.defState);

  handleSetItem = (item) => {
    this.setState({
      item,
    });
  };

  handleOpenDialog = () => {
    this.setState({
      openDialog: true,
    });
  };

  handleCloseDialog = () => {
    this.setState(cloneDeep(this.defState));
  };

  handleOpenModal = () => {
    this.setState({
      openModal: true,
    });
  };

  handleCloseModal = () => {
    this.setState(cloneDeep(this.defState));
  };

  handleChangeItem = (name, value) => {
    this.setState((PrevState) => ({
      item: Object.assign({ ...PrevState.item }, { [name]: value }),
    }));
  };

  render() {
    const { filters } = this.props;
    const { item, openModal, openDialog } = this.state;
    return (
      <>
        <div className="d-flex justify-content-end mx-3 my-2">
          <Button
            variant="primary"
            className="col-auto"
            onClick={this.handleOpenModal}
          >
            Додати аудиторiю
          </Button>
        </div>

        <div className="table-responsive w-100">
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
              handleSetItem={this.handleSetItem}
              handleOpenDialog={this.handleOpenDialog}
              handleOpenModal={this.handleOpenModal}
              openModal={openModal}
              openDialog={openDialog}
              item={item}
              handleChangeItem={this.handleChangeItem}
              handleCloseModal={this.handleCloseModal}
              handleCloseDialog={this.handleCloseDialog}
            ></DataTable>
          </Table>
        </div>
      </>
    );
  }
}

export default AudienceTable;
