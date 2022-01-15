import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_SPECIALTIES } from "../Specialty/queries";
import { UPDATE_GROUP, CREATE_GROUP } from "./mutations";
import { GET_ALL_GROUPS } from "./queries";
import Select from "react-select"
import {CreateNotification} from "../Alert"

function Save({ item, handleCloseModal, handleValidation, handleValidationSpecialty }) {
    const mutation = item.id ? UPDATE_GROUP : CREATE_GROUP
    const [mutateFunction, { loading, error }] = useMutation(mutation, {
        refetchQueries: [
            GET_ALL_GROUPS
        ]
    });
    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
    const variables = item.id ?
        { variables: { id: Number(item.id), name: item.name, number_students: Number(item.number_students), semester: Number(item.semester) ,id_specialty: Number(item.id_specialty) } }
        :
        { variables: { name: item.name, number_students: Number(item.number_students), semester: Number(item.semester) ,id_specialty: Number(item.id_specialty)} }
    return (
        <Button variant="primary" onClick={(e) => {
            if (item.name && item.number_students && item.semester && item.id_specialty){
                mutateFunction(variables).then((res) => {
                    CreateNotification(item.id ? res.data.UpdateGroup : res.data.CreateGroup)
                    handleCloseModal();
                })
            }
            else{
                handleValidation(true);
                if(item.id_specialty)
                {
                    handleValidationSpecialty(true)
                }
                else{
                    handleValidationSpecialty(false)
                }
            }
        }
        }>
            {item.id ? "Оновити" : "Додати"}
        </Button>
    )
}

function SelectSpecialties({ item, handleChangeItem, handleValidationSpecialty}) {
    const { error, loading, data } = useQuery(GET_ALL_SPECIALTIES);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error}`;
    let options = [];
    data.GetAllSpecialties.forEach((selectitem) => {
        options.push({ label: selectitem.name, value: Number(selectitem.id) })
    })
    return (
        <Select required options={options} placeholder="Спеціальність" defaultValue={item.id ? { label: item.specialty.name, value: Number(item.specialty.id) } : null}
            onChange={(e) => {
                handleValidationSpecialty(true);
                handleChangeItem("id_specialty", Number(e.value))
                e.value = item.id_specialty;
            }} />
    )
}

class GroupModal extends React.Component {

    state = {
        validated: false,
        isValidSpecialty: true,
    }

    handleClose = () => {
        this.props.handleCloseModal();
    };

    handleValidation = (status) => {
        this.setState({ validated: status });
    }

    handleValidationSpecialty = (status) => {
        this.setState({ isValidSpecialty: status });
    }

    render() {
        const { isopen, handleChangeItem, item } = this.props;
        return (
            <>
                <Modal size="lg" show={isopen} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{item.id ? `Редагувати запис групи ${item.name}` : "Створити запис групи"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={this.state.validated}>
                            <Form.Group as={Row} className="my-2 mx-2">
                                <Form.Label className="col-2">
                                    Назва групи
                                </Form.Label>
                                <Col>
                                    <Form.Control required placeholder="Група" value={item.name} onChange={(e) => {
                                        handleChangeItem("name", e.target.value);
                                    }
                                    }>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Назва не повинна бути пуста
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group >
                            <Form.Group as={Row} className="my-2 mx-2">
                                <Form.Label className="col-2">
                                    Кількість студентів
                                </Form.Label>
                                <Col>
                                    <Form.Control required placeholder="Кількість студентів" value={item.number_students} onChange={(e) => {
                                        handleChangeItem("number_students", e.target.value);
                                    }
                                    }>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Поле не повинно бути пустим
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group >
                            <Form.Group as={Row} className="my-2 mx-2">
                                <Form.Label className="col-2">
                                    Семестр
                                </Form.Label>
                                <Col>
                                    <Form.Control required placeholder="Семестр" value={item.semester} onChange={(e) => {
                                        handleChangeItem("semester", e.target.value);
                                    }
                                    }>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Семестр не повинен бути пустим
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group >
                            <Form.Group as={Row} className="my-2 mx-2">
                                <Form.Label className="col-2">
                                    Назва спеціальності
                                </Form.Label>
                                <Col>
                                    <SelectSpecialties handleValidationSpecialty={this.handleValidationSpecialty} handleChangeItem={handleChangeItem} item={item}></SelectSpecialties>
                                    {
                                        !this.state.isValidSpecialty && (
                                            <div className="text-danger">
                                                Спеціальність не вибрана
                                            </div>
                                        )
                                    }
                                </Col >
                            </Form.Group >
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Закрити
                        </Button>
                        <Save item={item} handleCloseModal={this.handleClose} handleValidationSpecialty={this.handleValidationSpecialty} handleValidation={this.handleValidation}></Save>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default GroupModal;
