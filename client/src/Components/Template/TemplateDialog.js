import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useMutation } from '@apollo/client';

function Confirm({ item, mutation, handleClose, refetch }) {
    const [mutateFunction, {loading, error }] = useMutation(mutation, {
        refetchQueries: [
            refetch
        ]
    });
    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

    return (
        <Button variant="primary" onClick={(e) => {
            mutateFunction({ variables: { id: Number(item.id) } }).then((res) => {
                handleClose();
            })
        }
        }>
            Видалити
        </Button>
    )
};

class TemplateDialog extends React.Component {

    handleClose = () => {
        this.props.handleCloseDialog();
    };


    render() {
        const { isopen, item, mutation, refetch } = this.props;

        return (
            <>
                <Modal centered size="lg" show={isopen} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Підтвердіть видалення запису</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Відмінити
                        </Button>
                        <Confirm refetch={refetch} item={item} mutation={mutation} handleClose={this.handleClose}></Confirm>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default TemplateDialog;