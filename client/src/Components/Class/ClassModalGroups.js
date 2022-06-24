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
  let setCathSemester = new Set();
  query.data.GetAllGroups.forEach((element) => {
    options.push({
      label: `${element.specialty.cathedra.short_name}-${element.name}`,
      value: +element.id,
    });
    setCathSemester.add(
      JSON.stringify({
        name: "All",

        specialty: {
          cathedra: {
            short_name: element.specialty.cathedra.short_name,
          },
        },
        semester: element.semester,
      })
    );
  });
  setCathSemester.forEach((element) => {
    let elem = JSON.parse(element);
    options.push({
      label: `${elem.specialty.cathedra.short_name}-${elem.semester} семестр`,
      value: element,
    });
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let findGroupSemester = (e) => {
    let group = query.data.GetAllGroups.find((gr) => +gr.id === +e.value);
    if (group) return group;
    else {
      if (setCathSemester.has(e.value)) return JSON.parse(e.value);
    }
  };
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
              handleChangeState("selectedGroup", findGroupSemester(e));
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
              let groups;
              if (selectedGroup) {
                if (selectedGroup.name === "All")
                  groups = query.data.GetAllGroups.filter(
                    (gr) =>
                      +gr.semester === +selectedGroup.semester &&
                      gr.specialty.cathedra.short_name ===
                      selectedGroup.specialty.cathedra.short_name
                  );
                else {
                  groups = [selectedGroup];
                }

                //Если полe в селекте не пустое
                let checkSelectedGroups;
                for (let gr of groups) {
                  checkSelectedGroups = item.assigned_groups.find(
                    (ag) => +ag.group.id === +gr.id
                  );
                  if (checkSelectedGroups) break;
                }

                if (!checkSelectedGroups) {
                  // Проверка не добавлена ли эта группа уже в массив
                  if (item.id) {
                    // Если редактирование элемента
                    AddGroupToClass({
                      variables: {
                        id_group: JSON.stringify(groups),
                        id_class: +item.id,
                      },
                    }).then((res) => {
                      const ag = JSON.parse(res.data.AddGroupToClass.data);
                      if (res.data.AddGroupToClass.successful) {
                        handleChangeItem("assigned_groups", [
                          ...item.assigned_groups,
                          ...ag.map((assigned_group) => {
                            return {
                              id: assigned_group.id,
                              group: query.data.GetAllGroups.find(
                                (gr) => +gr.id === +assigned_group.id_group
                              ),
                            };
                          }),
                        ]);
                      }
                      CreateNotification(res.data.AddGroupToClass);
                    });
                  } else {
                    // Создание элемента
                    let arrAG = item.assigned_groups;
                    groups.forEach((gr) => {
                      arrAG.push({
                        id: counterGroups,
                        group: gr,
                      });

                      handleIncCounter("counterGroups");
                    });
                    handleChangeItem("assigned_groups", arrAG);
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
