import { useQuery } from "@apollo/client";
import React from "react";
import { Table } from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { GET_ALL_DISCIPLINES } from "./queries";
import { Button } from "react-bootstrap";
import DisciplineDialog from "./DisciplineDialog";
import DisciplineModal from "./DisciplineModal";
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
  const { loading, error, data, refetch } = useQuery(GET_ALL_DISCIPLINES, {
    variables: filters,
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <>
      <tbody>
        {data.GetAllDisciplines.map((item) => {
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
      <DisciplineModal
        isopen={openModal}
        item={item}
        handleChangeItem={handleChangeItem}
        handleCloseModal={handleCloseModal}
        refetch={refetch}
      ></DisciplineModal>
      <DisciplineDialog
        isopen={openDialog}
        item={item}
        handleCloseDialog={handleCloseDialog}
        refetch={refetch}
      ></DisciplineDialog>
    </>
  );
}
class DisciplineTable extends React.Component {
  defState = {
    item: {
      id: null,
      name: "",
      assigned_disciplines: [],
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
            Додати дисципліну
          </Button>
        </div>
        <div className="table-responsive w-100">
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
export default DisciplineTable;
