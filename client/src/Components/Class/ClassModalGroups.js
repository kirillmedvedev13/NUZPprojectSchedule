import { XCircle } from "react-bootstrap-icons";
import { Button, Row, Col, Table, Form } from "react-bootstrap";
import Select from "react-select";
import { CreateNotification } from "../Alert";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_GROUP_TO_CLASS, DELETE_GROUP_FROM_CLASS } from "./mutations";
import { GET_ALL_GROUPS } from "../Group/queries";
import ValidatedMessage from "../ValidatedMessage";

export function TableGroups({ item, handleChangeItem }) {
  const [DelGroupFromClass, { loading, error }] = useMutation(
    DELETE_GROUP_FROM_CLASS
  );
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  return (
    <Table striped bordered hover className="my-2">
      <thead>
        <tr>
          <th>Група</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {item.assigned_groups.map((itemAG) => (
          <tr key={+itemAG.id}>
            <td>{`${itemAG.group.specialty.cathedra.short_name}-${itemAG.group.name}`}</td>
            <td className="p-0">
              <XCircle
                className="m-1"
                type="button"
                onClick={(e) => {
                  if (item.id) {
                    // При редактировании
                    DelGroupFromClass({
                      variables: { id: +itemAG.id },
                    }).then((res) => {
                      if (res.data.DeleteGroupFromClass.successful) {
                        const arrAG = item.assigned_groups.filter(
                          (ag) => +ag.id !== +itemAG.id
                        );
                        handleChangeItem("assigned_groups", arrAG);
                      }
                      CreateNotification(res.data.DeleteGroupFromClass);
                    });
                  } else {
                    // При добавлении
                    let arrAG = item.assigned_groups.filter(
                      (ag) => +ag.id !== +itemAG.id
                    );
                    handleChangeItem("assigned_groups", arrAG);
                  }
                }}
              ></XCircle>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export function AddGroupToClass({
  item,
  handleChangeItem,
  statusAddGroupToClass,
  counterGroups,
  validatedSelectedGroup,
  selectedGroup,
  handleChangeState,
  handleIncCounter,
}) {
  const query = useQuery(GET_ALL_GROUPS);
  const [AddGroupToClass, { loading, error }] = useMutation(ADD_GROUP_TO_CLASS);
  if (query.loading) return "Loading...";
  if (query.error) return `Error! ${error}`;
  let options = [];
  query.data.GetAllGroups.forEach((element) => {
    options.push({
      label: `${element.specialty.cathedra.short_name}-${element.name}`,
      value: +element.id,
    });
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;

  if (statusAddGroupToClass) {
    // Если открыт селект
    return (
      <Form.Group as={Row} className="my-2 mx-2 px-0">
        <Form.Label className="col-auto px-1">Виберiть групу</Form.Label>
        <Col className="px-1">
          <Select
            options={options}
            placeholder="Група"
            onChange={(e) => {
              handleChangeState(
                "selectedGroup",
                query.data.GetAllGroups.find((gr) => +gr.id === +e.value)
              );
              handleChangeState("validatedSelectedGroup", { status: true });
            }}
          ></Select>
          {!validatedSelectedGroup.status && (
            <ValidatedMessage
              message={validatedSelectedGroup.message}
            ></ValidatedMessage>
          )}
        </Col>
        <Col className="col-auto px-1">
          <Button
            onClick={(e) => {
              if (selectedGroup) {
                //Если полe в селекте не пустое
                const checkSelectedGroups = item.assigned_groups.find(
                  (ag) => +ag.group.id === +selectedGroup.id
                );
                if (!checkSelectedGroups) {
                  // Проверка не добавлена ли эта группа уже в массив
                  if (item.id) {
                    // Если редактирование элемента
                    AddGroupToClass({
                      variables: {
                        id_group: +selectedGroup.id,
                        id_class: +item.id,
                      },
                    }).then((res) => {
                      const ag = JSON.parse(res.data.AddGroupToClass.data);
                      if (res.data.AddGroupToClass.successful) {
                        handleChangeItem("assigned_groups", [
                          ...item.assigned_groups,
                          {
                            id: ag.id,
                            group: selectedGroup,
                          },
                        ]);
                      }
                      CreateNotification(res.data.AddGroupToClass);
                    });
                  } else {
                    // Создание элемента
                    let arrAG = item.assigned_groups;
                    arrAG.push({
                      id: counterGroups,
                      group: selectedGroup,
                    });
                    handleChangeItem("assigned_groups", arrAG);
                    handleIncCounter("counterGroups");
                  }
                  handleChangeState("selectedGroup", null);
                } else {
                  handleChangeState("validatedSelectedGroup", {
                    status: false,
                    message: "Група вже додана!",
                  });
                }
              } else {
                handleChangeState("validatedSelectedGroup", {
                  status: false,
                  message: "Група не вибрана!",
                });
              }
            }}
          >
            Зберегти
          </Button>
        </Col>
      </Form.Group>
    );
  } else {
    return (
      <Button onClick={(e) => handleChangeState("statusAddGroupToClass", true)}>
        Додати групу
      </Button>
    );
  }
}
