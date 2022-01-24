import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { GET_ALL_CLASSES } from "./queries";
import { DELETE_CLASS } from "./mutations";
import { CreateNotification } from "../Alert";

function Confirm({ item, handleClose }) {
  const [DeleteClass, { loading, error }] = useMutation(DELETE_CLASS, {
    refetchQueries: [GET_ALL_CLASSES],
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <Button
      variant="primary"
      onClick={(e) => {
        DeleteClass({ variables: { id: Number(item.id) } }).then((res) => {
          CreateNotification(res.data.DeleteClass);
          handleClose();
        });
      }}
    >
      Видалити запис
    </Button>
  );
}

class ClassDialog extends React.Component {
  handleClose = () => {
    this.props.handleCloseDialog();
  };

  render() {
    const { isopen, item } = this.props;

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
            <Confirm item={item} handleClose={this.handleClose}></Confirm>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ClassDialog;
