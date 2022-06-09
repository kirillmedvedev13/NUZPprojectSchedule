import { useQuery } from "@apollo/client";
import React from "react";
import { Table } from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { GET_ALL_CLASSES } from "./queries";
import ClassDialog from "./ClassDialog";
import ClassModal from "./ClassModal";

function DataTable({
  filters,
  handleSetItem,
  handleOpenDialog,
  handleOpenModal,
  openModal,
  openDialog,
  item,
  needUpdateItem,
  handleChangeItem,
  handleCloseModal,
  handleCloseDialog,
  handleUpdateItem
}) {
  const { loading, error, data, refetch } = useQuery(GET_ALL_CLASSES, {
    variables: filters,
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <>
      <tbody>
        {data.GetAllClasses.map((clas) => {
          return (
            <tr key={clas.id}>
              <td>{clas.assigned_discipline.discipline.name}</td>
              <td>{clas.assigned_discipline.specialty.name}</td>
              <td>{clas.assigned_discipline.semester}</td>
              <td>{clas.type_class.name}</td>
              <td>{clas.times_per_week}</td>
              <td>
                <Table>
                  <tbody>
                    {clas.assigned_teachers.map((obj) => {
                      return (
                        <tr key={obj.teacher.id}>
                          <td>{obj.teacher.surname + " " + obj.teacher.name}</td>
                          <td>{obj.teacher.cathedra.short_name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </td>
              <td>
                <Table>
                  <tbody>
                    {clas.assigned_groups.map((obj) => {
                      return (
                        <tr key={obj.group.id}>
                          <td>
                            {clas.assigned_discipline.specialty.cathedra
                              .short_name +
                              "-" +
                              obj.group.name}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </td>
              <td>
                <Table>
                  <tbody>
                    {clas.recommended_audiences.map((obj) => {
                      return (
                        <tr key={obj.audience.id}>
                          <td>{obj.audience.name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </td>
              <td className="col-2" onClick={(e) => handleSetItem(clas)}>
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
      <ClassModal
        isopen={openModal}
        item={item}
        handleChangeItem={handleChangeItem}
        handleCloseModal={handleCloseModal}
        refetch={refetch}
      ></ClassModal>
      <ClassDialog
        isopen={openDialog}
        item={item}
        handleCloseDialog={handleCloseDialog}
        refetch={refetch}
      ></ClassDialog>
    </>
  );
}
class ClassTable extends React.Component {
  def_state = {
    item: {
      id: null,
      times_per_week: "",
      id_type_class: {
        id: null,
      },
      assigned_discipline: {
        id: null,
      },
      assigned_groups: [],
      assigned_teachers: [],
      recommended_audiences: [],
    },
    openModal: false,
    openDialog: false,
  }

  state = this.def_state;

  handleSetItem = (item) => {
    this.setState({
      item
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
    this.setState({
      openModal: false
    })
  };

  handleChangeItem = (name, value) => {
    this.setState((PrevState) => ({
      item: Object.assign({ ...PrevState.item }, { [name]: value })
    }));
  };

  render() {
    const { filters } = this.props;
    const { item, openModal, openDialog } = this.state;
    return (
      <div className="container-fluid w-100">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Дисципліна</th>
              <th>Спеціальність</th>
              <th>Семестр</th>
              <th>Тип заняття</th>
              <th>Кількість занять на тиждень</th>
              <th>Викладачі</th>
              <th>Групи</th>
              <th>Рекомендовані аудиторії</th>
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
    );
  }
}
export default ClassTable;
