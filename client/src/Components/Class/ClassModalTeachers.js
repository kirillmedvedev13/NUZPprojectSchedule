import { XCircle } from "react-bootstrap-icons";
import { Button, Row, Col, Table, Form } from "react-bootstrap";
import Select from "react-select";
import { CreateNotification } from "../Alert";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_TEACHER_TO_CLASS, DELETE_TEACHER_FROM_CLASS } from "./mutations";
import { GET_ALL_TEACHERS } from "../Teacher/queries";
import ValidatedMessage from "../ValidatedMessage";

export function TableTeachers({ item, handleChangeItem }) {
  const [DelTeachFromClass, { loading, error }] = useMutation(
    DELETE_TEACHER_FROM_CLASS
  );
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  return (
    <Table striped bordered hover className="my-2">
      <thead>
        <tr>
          <th>Викладач</th>
          <th>Кафедра</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {item.assigned_teachers.map((itemAT) => (
          <tr key={+itemAT.id}>
            <td>{`${itemAT.teacher.surname} ${itemAT.teacher.name}`}</td>
            <td>{itemAT.teacher.cathedra.name}</td>
            <td className="p-0">
              <XCircle
                className="m-1"
                type="button"
                onClick={(e) => {
                  if (item.id) {
                    // При редактировании
                    DelTeachFromClass({ variables: { id: +itemAT.id } }).then(
                      (res) => {
                        if (res.data.DeleteTeacherFromClass.successful) {
                          let arrAT = item.assigned_teachers.filter(
                            (at) => +at.id !== +itemAT.id
                          );
                          handleChangeItem("assigned_teachers", arrAT);
                        }
                        CreateNotification(res.data.DeleteTeacherFromClass);
                      }
                    );
                  } else {
                    // При добавлении
                    let arrAT = item.assigned_teachers.filter(
                      (at) => +at.id !== +itemAT.id
                    );
                    handleChangeItem("assigned_teachers", arrAT);
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

export function AddTeacherToClass({
  item,
  handleChangeItem,
  statusAddTeacherToClass,
  counterTeachers,
  validatedSelectedTeacher,
  selectedTeacher,
  handleChangeState,
  handleIncCounter,
}) {
  const query = useQuery(GET_ALL_TEACHERS);
  const [AddTeachToClass, { loading, error }] =
    useMutation(ADD_TEACHER_TO_CLASS);
  if (query.loading) return "Loading...";
  if (query.error) return `Error! ${error}`;
  let options = [];
  query.data.GetAllTeachers.forEach((element) => {
    options.push({
      label: `${element.surname} ${element.name} ${element.patronymic} - ${element.cathedra.short_name}`,
      value: +element.id,
    });
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  if (statusAddTeacherToClass) {
    // Если открыт селект
    return (
      <Form.Group as={Row} className="my-2 mx-2 px-0">
        <Form.Label className="col-auto px-1">Виберiть викладача</Form.Label>
        <Col className="px-1">
          <Select
            options={options}
            placeholder="Викладач"
            defaultValue={() => {
              if (selectedTeacher) {
                return {
                  label: `${selectedTeacher.surname} ${selectedTeacher.name} ${selectedTeacher.patronymic} - ${selectedTeacher.cathedra.short_name}`,
                  value: +selectedTeacher.id,
                }
              }
            }}
            onChange={(e) => {
              handleChangeState(
                "selectedTeacher",
                query.data.GetAllTeachers.find((t) => +t.id === +e.value)
              );
              handleChangeState("validatedSelectedTeacher", {
                status: true,
                message: "",
              });
            }}
          ></Select>
          {!validatedSelectedTeacher.status && (
            <ValidatedMessage
              message={validatedSelectedTeacher.message}
            ></ValidatedMessage>
          )}
        </Col>
        <Col className="col-auto px-1">
          <Button
            onClick={(e) => {
              if (selectedTeacher) {
                //Если полe в селекте не пустое
                // Проверка не добавлена ли этот учитель уже в массив
                const checkSelectedTeachers = item.assigned_teachers.find(
                  (at) => +at.teacher.id === +selectedTeacher.id
                );
                if (!checkSelectedTeachers) {
                  if (item.id) {
                    // Если редактирование элемента
                    AddTeachToClass({
                      variables: {
                        id_teacher: +selectedTeacher.id,
                        id_class: +item.id,
                      },
                    }).then((res) => {
                      const at = JSON.parse(res.data.AddTeacherToClass.data);
                      if (res.data.AddTeacherToClass.successful) {
                        handleChangeItem("assigned_teachers", [
                          ...item.assigned_teachers,
                          {
                            id: at.id,
                            teacher: selectedTeacher,
                          },
                        ]);
                      }
                      CreateNotification(res.data.AddTeacherToClass);
                    });
                  } else {
                    let arrAT = item.assigned_teachers;
                    arrAT.push({
                      id: counterTeachers,
                      teacher: selectedTeacher,
                    });
                    handleChangeItem("assigned_teachers", arrAT);
                    handleIncCounter("counterTeachers");
                  }
                } else {
                  handleChangeState("validatedSelectedTeacher", {
                    status: false,
                    message: "Викладач вже додан!",
                  });
                }
              } else {
                handleChangeState("validatedSelectedTeacher", {
                  status: false,
                  message: "Викладач не вибран!",
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
      <Button
        onClick={(e) => handleChangeState("statusAddTeacherToClass", true)}
      >
        Додати викладача
      </Button>
    );
  }
}
