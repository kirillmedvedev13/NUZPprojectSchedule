import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { DELETE_AUDIENCE } from "./mutations";
import { CreateNotification } from "../Alert";

function ConfirmButton({ item, handleClose }) {
  const [DeleteAudience, { loading, error }] = useMutation(DELETE_AUDIENCE);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <Button
      variant="primary"
      onClick={(e) => {
        DeleteAudience({ variables: { id: Number(item.id) } }).then((res) => {
          CreateNotification(res.data.DeleteAudience);
          handleClose();
        });
      }}
    >
      Видалити запис
    </Button>
  );
}

class AudienceDialog extends React.Component {
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
            <Modal.Title>Підтвердіть видалення запису {item.name}</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Відмінити
            </Button>
            <ConfirmButton
              item={item}
              handleClose={this.handleClose}
            ></ConfirmButton>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default AudienceDialog;
