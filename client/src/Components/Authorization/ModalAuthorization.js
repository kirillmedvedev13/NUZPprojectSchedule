import React from "react";
import { Button, Modal, Form, Row } from "react-bootstrap";
import withHocs from "./ModalAuthorizationHoc.js";

class ModalAuthorization extends React.Component {
  state = {
    email: null,
    password: null,
  };
  handleChange = (event) => {
    this.setState({
      [event.target.type]: event.target.value,
    });
  };
  handleClose = () => {
    this.props.handleCloseModal();
  };

  handleLogin = () => {
    const { email, password } = this.state;
    const { handleCloseModal, data, login } = this.props;
    data
      .fetchMore({
        variables: { email, password },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            GetUser: fetchMoreResult.GetUser,
          };
        },
      })
      .then((res) => {
        if (!res.data.GetUser.isAuth.successfull) {
          alert(res.data.GetUser.isAuth.message);
        } else {
          login({ userID: res.GetUser.id });
          this.handleClose();
        }
      });
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
                <Form.Control
                  className="col"
                  type="email"
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group
                as={Row}
                className="my-2 mx-2"
                controlId="formPassword"
              >
                <Form.Label className="col-auto">Password: </Form.Label>
                <Form.Control
                  className="col"
                  type="password"
                  onChange={this.handleChange}
                />
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
