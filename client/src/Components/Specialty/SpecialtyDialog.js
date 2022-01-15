import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useMutation } from '@apollo/client';
import {GET_ALL_SPECIALTIES} from "./queries"
import {DELETE_SPECIALTY} from "./mutations"
import {CreateNotification} from "../Alert"

function Confirm({ item, handleClose}) {
    const [DeleteSpecialty, {loading, error }] = useMutation(DELETE_SPECIALTY, {
        refetchQueries: [
            GET_ALL_SPECIALTIES
        ]
    });
    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

    return (
        <Button variant="primary" onClick={(e) => {
            DeleteSpecialty({ variables: { id: Number(item.id) } }).then((res) => {
                CreateNotification(res.data.DeleteSpecialty)
                handleClose();
            })
        }
        }>
            Видалити запис
        </Button>
    )
};

class SpecialtyDialog extends React.Component {

    handleClose = () => {
        this.props.handleCloseDialog();
    };


    render() {
        const { isopen, item,  } = this.props;

        return (
            <>
                <Modal centered size="lg" show={isopen} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Підтвердіть видалення запису {item.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Відмінити
                        </Button>
                        <Confirm item={item} handleClose={this.handleClose}></Confirm>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default SpecialtyDialog;