import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client"
import { GetAllCathedras } from "../Cathedra/queries";
import { UPDATE_SPECIALTY, CREATE_SPECIALTY } from "./mutations";
import { GET_ALL_SPECIALTIES } from "./queries";
import Select from "react-select"
import {CreateNotification} from "../Alert"

function Save({ item, handleCloseModal, handleValidation, handleValidationCathedra }) {
    const mutation = item.id ? UPDATE_SPECIALTY : CREATE_SPECIALTY
    const [mutateFunction, { loading, error }] = useMutation(mutation, {
        refetchQueries: [
            GET_ALL_SPECIALTIES
        ]
    });
    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
    const variables = item.id ?
        { variables: { id: Number(item.id), name: item.name, id_cathedra: Number(item.id_cathedra) } }
        :
        { variables: { name: item.name, id_cathedra: Number(item.id_cathedra) } }
    return (
        <Button variant="primary" onClick={(e) => {
            if (!item.name)
                handleValidation(true);
            if (!item.id_cathedra) {
                handleValidationCathedra(false);
            }
            if (item.name && item.id_cathedra) {
                handleValidation(true, false);
                mutateFunction(variables).then((res) => {
                    CreateNotification(item.id ? res.data.UpdateSpecialty : res.data.CreateSpecialty)
                    handleCloseModal();
                })
            }
        }
        }>
            {item.id ? "Оновити" : "Додати"}
        </Button>
    )
}

function SelectCathedras({ item, handleChangeItem, handleValidationCathedra }) {
    const { error, loading, data } = useQuery(GetAllCathedras);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error}`;
    let options = [];
    data.GetAllCathedras.forEach((selectitem) => {
        options.push({ label: selectitem.name, value: Number(selectitem.id) })
    })
    return (
        <Select required options={options} placeholder="Кафедра" defaultValue={item.id ? { label: item.cathedra.name, value: Number(item.cathedra.id) } : null}
            onChange={(e) => {
                handleValidationCathedra(true);
                handleChangeItem("id_cathedra", Number(e.value))
                e.value = item.id_cathedra;
            }} />
    )
}

class SpecialtyModal extends React.Component {

    state = {
        validated: false,
        isValidCathedra: true,
    }
    handleClose = () => {
        this.props.handleCloseModal();
    };

    handleValidation = (status) => {
        this.setState({ validated: status });
    }

    handleValidationCathedra = (status) => {
        this.setState({ isValidCathedra: status });
    }

    render() {
        const { isopen, handleChangeItem, item } = this.props;
        return (
            <>
                <Modal size="lg" show={isopen} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{item.id ? "Редагувати запис спеціальності" : "Створити запис спеціальності"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={this.state.validated}>
                            <Form.Group as={Row} className="my-2 mx-2">
                                <Form.Label className="col-2">
                                    Назва спеціальності
                                </Form.Label>
                                <Col>
                                    <Form.Control required placeholder="Спеціальність" value={item.name} onChange={(e) => {
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
                                    Назва кафедри
                                </Form.Label>
                                <Col>
                                    <SelectCathedras handleValidationCathedra={this.handleValidationCathedra} handleChangeItem={handleChangeItem} item={item}></SelectCathedras>
                                    {
                                        !this.state.isValidCathedra && (
                                            <div className="text-danger">
                                                Кафедра не вибрана
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
                        <Save item={item} handleCloseModal={this.handleClose} handleValidationCathedra={this.handleValidationCathedra} handleValidation={this.handleValidation}></Save>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default SpecialtyModal;
