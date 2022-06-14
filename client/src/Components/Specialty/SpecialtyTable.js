import React from "react";
import { Table } from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { useQuery } from "@apollo/client";
import { GET_ALL_SPECIALTIES } from "./queries";
import SpecialtyDialog from "./SpecialtyDialog";
import SpecialtyModal from "./SpecialtyModal";
import { Button } from "react-bootstrap";

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
  const { loading, error, data, refetch } = useQuery(GET_ALL_SPECIALTIES, {
    variables: filters,
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <>
      <tbody>
        {data.GetAllSpecialties.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.code}</td>
            <td>
              {item.cathedra.name + " (" + item.cathedra.short_name + ")"}
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
      <SpecialtyModal
        isopen={openModal}
        item={item}
        handleChangeItem={handleChangeItem}
        handleCloseModal={handleCloseModal}
        refetch={refetch}
      ></SpecialtyModal>
      <SpecialtyDialog
        isopen={openDialog}
        item={item}
        handleCloseDialog={handleCloseDialog}
        refetch={refetch}
      ></SpecialtyDialog>
    </>
  );
}

class SpecialtyTable extends React.Component {
  defState = {
    item: {
      id: null,
      name: "",
      code: "",
      cathedra: {
        id: null,
      },
    },
    openModal: false,
    openDialog: false,
  };
  state = this.defState;
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
    this.defState.item.assigned_disciplines = [];
    this.setState({
      item: this.defState.item,
      openModal: false,
    });
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
        <div className="d-flex justify-content-end mx-2 my-2">
          <Button
            variant="primary"
            className="col-auto"
            onClick={this.handleOpenModal}
          >
            Додати Спеціальність
          </Button>
        </div>
        <div className="container-fluid w-100">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Назва спеціальності</th>
                <th>Код спеціальності</th>
                <th>Назва кафедри</th>
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

export default SpecialtyTable;
