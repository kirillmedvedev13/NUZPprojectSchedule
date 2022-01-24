import { XCircle } from "react-bootstrap-icons"
import { Button, Row, Col, Table, Form } from "react-bootstrap";
import Select from "react-select";
import { CreateNotification } from "../Alert";
import { useMutation, useQuery } from "@apollo/client";
import {
    ADD_RECOMMENDED_AUDIENCE_TO_CLASS,
    DELETE_RECOMMENDED_AUDIENCE_FROM_CLASS,
} from "./mutations";
import { GET_ALL_CLASSES } from "./queries";
import { GET_ALL_AUDIENCES } from "../Audience/queries"

export function SelectsRecAudience({ item, handleUpdateItem, handleChangeItem }) {
    const [DelRecAudienceFromClass, { loading, error }] = useMutation(DELETE_RECOMMENDED_AUDIENCE_FROM_CLASS, {
        refetchQueries: [GET_ALL_CLASSES],
    });

    if (loading) return "Loading...";
    if (error) return `Error! ${error}`;

    return (
        <Table striped bordered hover className="my-2">
            <thead>
                <tr>
                    <th>Аудиторія</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    item.recommended_audiences.map((itemRA) => (
                        <tr key={Number(itemRA.id)}>
                            <td>{itemRA.audience.name}</td>
                            <td className="p-0">
                                <XCircle
                                    className="m-1"
                                    type="button"
                                    onClick={(e) => {
                                        if (item.id) { // При редактировании
                                            DelRecAudienceFromClass({ variables: { id: Number(itemRA.id) } }).then((res) => {
                                                handleUpdateItem(item);
                                                CreateNotification(res.data.DeleteRecAudienceFromClass)
                                            })
                                        }
                                        else { // При добавлении
                                            let arrRA = item.recommended_audiences.filter(ra => Number(ra.id) !== Number(itemRA.id))
                                            handleChangeItem("recommended_audiences", arrRA)
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

export function AddRecAudienceToClass({
    item,
    handleUpdateItem,
    handleChangeItem,
    statusAddRecAudienceToClass,
    counterRecAudiences,
    validatedSelectedRecAudience,
    selectedRecAudience,
    handleChangeViewSelect,
    handleChangeSelectedItem,
    handleValidationSelectedItem,
    handleIncCounter,
}) {
    const query = useQuery(GET_ALL_AUDIENCES);
    const [AddRecAudienceToClass, { loading, error }] = useMutation(ADD_RECOMMENDED_AUDIENCE_TO_CLASS, {
        refetchQueries: [GET_ALL_CLASSES],
    });
    if (query.loading) return "Loading...";
    if (query.error) return `Error! ${error}`;
    let options = [];
    query.data.GetAllAudiences.forEach(element => {
        options.push({ label: element.name, value: Number(element.id) })
    })
    if (loading) return "Loading...";
    if (error) return `Error! ${error}`;

    if (statusAddRecAudienceToClass) { // Если открыт селект
        return (
            <Form.Group as={Row} className="my-2 mx-2 px-0">
                <Form.Label className="col-auto px-1">Виберiть аудиторію</Form.Label>
                <Col className="px-1">
                    <Select options={options} placeholder="Аудиторія" onChange={(e) => {
                        handleChangeSelectedItem("selectedRecAudience", { id: e.value, name: e.label });
                        handleValidationSelectedItem("validatedSelectedRecAudience", { status: true });
                    }}></Select>
                    {!validatedSelectedRecAudience.status && (
                        <div className="text-danger">{validatedSelectedRecAudience.message}</div>
                    )}
                </Col>
                <Col className="col-auto px-1">
                    <Button onClick={(e) => {
                        if (selectedRecAudience) { //Если полe в селекте не пустое
                            const checkSelectedRecAudience = item.recommended_audiences.filter(ra => Number(ra.audience.id) === Number(selectedRecAudience.id))
                            if (!checkSelectedRecAudience.length) { // Проверка не добавлена ли эта кафедра уже в массив
                                if (item.id) { // Если редактирование элемента
                                    AddRecAudienceToClass({ variables: { id_audience: Number(selectedRecAudience.id), id_class: Number(item.id) } }).then((res) => {
                                        handleUpdateItem(item);
                                        CreateNotification(res.data.AddRecAudienceToClass);
                                        handleChangeViewSelect("statusAddRecAudienceToClass", false);
                                        handleChangeSelectedItem("selectedRecAudience", null);
                                    }
                                    )
                                }
                                else { // Создание элемента
                                    let arrRA = item.recommended_audiences;
                                    arrRA.push({
                                        id: counterRecAudiences,
                                        audience: selectedRecAudience,
                                    })
                                    handleChangeItem("recommended_audiences", arrRA);
                                    handleIncCounter("counterRecAudience");
                                    handleChangeViewSelect("statusAddRecAudienceToClass", false);
                                    handleChangeSelectedItem("selectedRecAudience", null);
                                }
                            }
                            else {
                                handleValidationSelectedItem("validatedSelectedRecAudience", { status: false, message: "Аудиторію вже додано!" });
                            }
                        }
                        else {
                            handleValidationSelectedItem("validatedSelectedRecAudience", { status: false, message: "Аудиторія не вибрана!" });
                        }
                    }}>Зберегти</Button>
                </Col>
            </Form.Group >
        )
    }
    else {
        return <Button onClick={(e) => handleChangeViewSelect("statusAddRecAudienceToClass", true)}>Додати аудиторію</Button>
    }

}