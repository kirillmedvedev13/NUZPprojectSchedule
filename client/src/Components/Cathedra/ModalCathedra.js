import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

export default function ModalUpdateCathedra({showModal, handleSave, name}){
    const [show, setShow] = useState(showModal);
    const handleClose = () => setShow(false);

    return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Редагування кафедри</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {name}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSave("55")}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
}