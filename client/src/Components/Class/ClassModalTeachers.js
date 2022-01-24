import { XCircle } from "react-bootstrap-icons"
import { Button, Row, Col, Table, Form } from "react-bootstrap";
import Select from "react-select";
import { CreateNotification } from "../Alert";
import { useMutation, useQuery } from "@apollo/client";
import {
    ADD_TEACHER_TO_CLASS,
    DELETE_TEACHER_FROM_CLASS
} from "./mutations";
import { GET_ALL_CLASSES } from "./queries";
import { GET_ALL_TEACHERS } from "../Teacher/queries"

export function SelectsTeachers({ item, handleUpdateItem, handleChangeItem }) {
    const [DelTeachFromClass, { loading, error }] = useMutation(DELETE_TEACHER_FROM_CLASS, {
        refetchQueries: [GET_ALL_CLASSES],
    });

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
                {
                    item.assigned_teachers.map((itemAT) => (
                        <tr key={Number(itemAT.id)}>
                            <td>{`${itemAT.teacher.surname} ${itemAT.teacher.name}`}</td>
                            <td>{itemAT.teacher.cathedra.name}</td>
                            <td className="p-0">
                                <XCircle
                                    className="m-1"
                                    type="button"
                                    onClick={(e) => {
                                        if (item.id) { // При редактировании
                                            DelTeachFromClass({ variables: { id: Number(itemAT.id) } }).then((res) => {
                                                handleUpdateItem(item);
                                                CreateNotification(res.data.DeleteTeacherFromClass)
                                            })
                                        }
                                        else { // При добавлении
                                            let arrAT = item.assigned_teachers.filter(at => Number(at.id) !== Number(itemAT.id))
                                            handleChangeItem("assigned_teachers", arrAT)
                                        }
                                    }
                                    }>
                                </XCircle >
                            </td>
                        </tr>
                    )
                    )
                }
            </tbody>
        </Table>
    )
}

export function AddTeacherToClass({
    item,
    handleUpdateItem,
    handleChangeItem,
    statusAddTeacherToClass,
    counterTeachers,
    validatedSelectedTeacher,
    selectedTeacher,
    handleChangeViewSelect,
    handleChangeSelectedItem,
    handleValidationSelectedItem,
    handleIncCounter,
}) {
    const query = useQuery(GET_ALL_TEACHERS);
    const [AddTeachToClass, { loading, error }] = useMutation(ADD_TEACHER_TO_CLASS, {
        refetchQueries: [GET_ALL_CLASSES],
    });
    if (query.loading) return "Loading...";
    if (query.error) return `Error! ${error}`;
    let options = [];
    query.data.GetAllTeachers.forEach(element => {
        options.push({ label: `${element.surname} ${element.name} ${element.cathedra.name}`, value: Number(element.id) })
    })
    if (loading) return "Loading...";
    if (error) return `Error! ${error}`;

    if (statusAddTeacherToClass) { // Если открыт селект
        return (
            <Form.Group as={Row} className="my-2 mx-2 px-0">
                <Form.Label className="col-auto px-1">Виберiть викладача</Form.Label>
                <Col className="px-1">
                    <Select options={options} placeholder="Викладач" onChange={(e) => {
                        const [surname, name] = e.label.split(" ", 2);
                        const cathedraname = e.label.slice(surname.length + name.length + 2);
                        handleChangeSelectedItem("selectedTeacher", { id: e.value, name, surname, cathedra: {name: cathedraname} });
                        handleValidationSelectedItem("validatedSelectedTeacher", { status: true });
                    }}></Select>
                    {!validatedSelectedTeacher.status && (
                        <div className="text-danger">{validatedSelectedTeacher.message}</div>
                    )}
                </Col>
                <Col className="col-auto px-1">
                    <Button onClick={(e) => {
                        if (selectedTeacher) { //Если полe в селекте не пустое
                            const checkSelectedTeachers = item.assigned_teachers.filter(at => Number(at.teacher.id) === Number(selectedTeacher.id))
                            if (!checkSelectedTeachers.length) { // Проверка не добавлена ли эта кафедра уже в массив
                                if (item.id) { // Если редактирование элемента
                                    AddTeachToClass({ variables: { id_teacher: Number(selectedTeacher.id), id_class: Number(item.id) } }).then((res) => {
                                        handleUpdateItem(item);
                                        CreateNotification(res.data.AddTeacherToClass);
                                        handleChangeViewSelect("statusAddTeacherToClass", false);
                                        handleChangeSelectedItem("selectedTeacher", null);
                                    }
                                    )
                                }
                                else { // Создание элемента
                                    let arrAT = item.assigned_teachers;
                                    arrAT.push({
                                        id: counterTeachers,
                                        teacher: selectedTeacher,
                                    })
                                    handleChangeItem("assigned_teachers", arrAT);
                                    handleIncCounter("counterTeachers");
                                    handleChangeViewSelect("statusAddTeacherToClass", false);
                                    handleChangeSelectedItem("selectedTeacher", null);
                                }
                            }
                            else {
                                handleValidationSelectedItem("validatedSelectedTeacher", { status: false, message: "Викладач вже додан!" });
                            }
                        }
                        else {
                            handleValidationSelectedItem("validatedSelectedTeacher", { status: false, message: "Викладач не вибран!" });
                        }
                    }}>Зберегти</Button>
                </Col>
            </Form.Group >
        )
    }
    else {
        return <Button onClick={(e) => handleChangeViewSelect("statusAddTeacherToClass", true)}>Додати викладача</Button>
    }

}