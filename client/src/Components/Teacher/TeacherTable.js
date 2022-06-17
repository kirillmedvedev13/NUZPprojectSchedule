import React from "react";
import { Table } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { useQuery } from "@apollo/client";
import { GET_ALL_TEACHERS } from "./queries";
import TeacherDialog from "./TeacherDialog";
import TeacherModal from "./TeacherModal";
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
  const { loading, error, data, refetch } = useQuery(GET_ALL_TEACHERS, {
    variables: filters,
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <>
      <tbody>
        {data.GetAllTeachers.map((item) => (
          <tr key={item.id}>
            <td>{item.surname}</td>
            <td>{item.name}</td>
            <td>{item.patronymic}</td>
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
      <TeacherModal
        isopen={openModal}
        item={item}
        handleChangeItem={handleChangeItem}
        handleCloseModal={handleCloseModal}
        refetch={refetch}
      ></TeacherModal>
      <TeacherDialog
        isopen={openDialog}
        item={item}
        handleCloseDialog={handleCloseDialog}
        refetch={refetch}
      ></TeacherDialog>
    </>
  );
}

class TeacherTable extends React.Component {
  defState = {
    item: {
      id: null,
      name: "",
      surname: "",
      patronymic: "",
      cathedra: {
        id: null,
      },
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
        <div className="d-flex justify-content-end mx-2 my-2">
          <Button
            variant="primary"
            className="col-auto"
            onClick={this.handleOpenModal}
          >
            Додати Викладача
          </Button>
        </div>
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

export default TeacherTable;
