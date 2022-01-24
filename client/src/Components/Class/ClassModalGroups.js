import { XCircle } from "react-bootstrap-icons"
import { Button, Row, Col, Table, Form } from "react-bootstrap";
import Select from "react-select";
import { CreateNotification } from "../Alert";
import { useMutation, useQuery } from "@apollo/client";
import {
    ADD_GROUP_TO_CLASS,
    DELETE_GROUP_FROM_CLASS
} from "./mutations";
import { GET_ALL_CLASSES } from "./queries";
import { GET_ALL_GROUPS } from "../Group/queries"

export function SelectsGroups({ item, handleUpdateItem, handleChangeItem }) {
    const [DelGroupFromClass, { loading, error }] = useMutation(DELETE_GROUP_FROM_CLASS, {
        refetchQueries: [GET_ALL_CLASSES],
    });

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
                {
                    item.assigned_groups.map((itemAG) => (
                        <tr key={Number(itemAG.id)}>
                            <td>{itemAG.group.name}</td>
                            <td className="p-0">
                                <XCircle
                                    className="m-1"
                                    type="button"
                                    onClick={(e) => {
                                        if (item.id) { // При редактировании
                                            DelGroupFromClass({ variables: { id: Number(itemAG.id) } }).then((res) => {
                                                handleUpdateItem(item);
                                                CreateNotification(res.data.DeleteGroupFromClass)
                                            })
                                        }
                                        else { // При добавлении
                                            let arrAG = item.assigned_groups.filter(ag => Number(ag.id) !== Number(itemAG.id))
                                            handleChangeItem("assigned_groups", arrAG)
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

export function AddGroupToClass({
    item,
    handleUpdateItem,
    handleChangeItem,
    statusAddGroupToClass,
    counterGroups,
    validatedSelectedGroup,
    selectedGroup,
    handleChangeViewSelect,
    handleChangeSelectedItem,
    handleValidationSelectedItem,
    handleIncCounter,
}) {
    const query = useQuery(GET_ALL_GROUPS);
    const [AddGroupToClass, { loading, error }] = useMutation(ADD_GROUP_TO_CLASS, {
        refetchQueries: [GET_ALL_CLASSES],
    });
    if (query.loading) return "Loading...";
    if (query.error) return `Error! ${error}`;
    let options = [];
    query.data.GetAllGroups.forEach(element => {
        options.push({ label: element.name , value: Number(element.id) })
    })
    if (loading) return "Loading...";
    if (error) return `Error! ${error}`;

    if (statusAddGroupToClass) { // Если открыт селект
        return (
            <Form.Group as={Row} className="my-2 mx-2 px-0">
                <Form.Label className="col-auto px-1">Виберiть групу</Form.Label>
                <Col className="px-1">
                    <Select options={options} placeholder="Група" onChange={(e) => {
                        handleChangeSelectedItem("selectedGroup", { id: e.value, name: e.label });
                        handleValidationSelectedItem("validatedSelectedGroup", { status: true });
                    }}></Select>
                    {!validatedSelectedGroup.status && (
                        <div className="text-danger">{validatedSelectedGroup.message}</div>
                    )}
                </Col>
                <Col className="col-auto px-1">
                    <Button onClick={(e) => {
                        if (selectedGroup) { //Если полe в селекте не пустое
                            const checkSelectedGroups = item.assigned_groups.filter(ag => Number(ag.group.id) === Number(selectedGroup.id))
                            if (!checkSelectedGroups.length) { // Проверка не добавлена ли эта кафедра уже в массив
                                if (item.id) { // Если редактирование элемента
                                    AddGroupToClass({ variables: { id_group: Number(selectedGroup.id), id_class: Number(item.id) } }).then((res) => {
                                        handleUpdateItem(item);
                                        CreateNotification(res.data.AddGroupToClass);
                                        handleChangeViewSelect("statusAddGroupToClass", false);
                                        handleChangeSelectedItem("selectedGroup", null);
                                    }
                                    )
                                }
                                else { // Создание элемента
                                    let arrAG = item.assigned_groups;
                                    arrAG.push({
                                        id: counterGroups,
                                        group: selectedGroup,
                                    })
                                    handleChangeItem("assigned_groups", arrAG);
                                    handleIncCounter("counterGroups");
                                    handleChangeViewSelect("statusAddGroupToClass", false);
                                    handleChangeSelectedItem("selectedGroup", null);
                                }
                            }
                            else {
                                handleValidationSelectedItem("validatedSelectedGroup", { status: false, message: "Група вже додана!" });
                            }
                        }
                        else {
                            handleValidationSelectedItem("validatedSelectedGroup", { status: false, message: "Група не вибрана!" });
                        }
                    }}>Зберегти</Button>
                </Col>
            </Form.Group >
        )
    }
    else {
        return <Button onClick={(e) => handleChangeViewSelect("statusAddGroupToClass", true)}>Додати групу</Button>
    }

}