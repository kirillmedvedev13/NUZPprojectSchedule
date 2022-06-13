import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { DELETE_CATHEDRA } from "./mutations";
import { CreateNotification } from "../Alert";

function Confirm({ item, handleClose }) {
  const [DeleteTeacher, { loading, error }] = useMutation(DELETE_CATHEDRA);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <Button
      variant="primary"
      onClick={(e) => {
        DeleteTeacher({ variables: { id: +item.id } }).then((res) => {
          CreateNotification(res.data.DeleteCathedra);
          handleClose();
        });
      }}
    >
      Видалити запис
    </Button>
  );
}

class CathedraDialog extends React.Component {
  handleClose = () => {
    this.props.handleCloseDialog();
    this.props.refetch();
  };

  render() {
    const { isopen, item } = this.props;

    return (
      <>
        <Modal centered size="lg" show={isopen} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Підтвердіть видалення запису {item.name} </Modal.Title>
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

export default CathedraDialog;
