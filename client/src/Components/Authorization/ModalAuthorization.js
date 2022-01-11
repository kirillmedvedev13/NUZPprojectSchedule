import React from "react";
import { Button, Modal, Form, Row } from "react-bootstrap";
import withHocs from "./ModalAuthorizationHoc.js";

class ModalAuthorization extends React.Component {
  handleClose = () => {
    this.props.handleCloseModalLogin();
  };
  handleLogin = () => {
    const { handleCloseModal, data } = this.props;

    handleCloseModal();
  };
  render() {
    const { open } = this.props;
    return (
      <>
        <Modal size="lg" show={open} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Авторизація</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="my-2 mx-2" controlId="formEmail">
                <Form.Label className="col-auto">Email address: </Form.Label>
                <Form.Control className="col" type="email" />
              </Form.Group>
              <Form.Group
                as={Row}
                className="my-2 mx-2"
                controlId="formPassword"
              >
                <Form.Label className="col-auto">Password: </Form.Label>
                <Form.Control className="col" type="password" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Закрити
            </Button>
            <Button variant="primary" onClick={this.handleLogin}>
              Авторизоватися
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
export default withHocs(ModalAuthorization);
