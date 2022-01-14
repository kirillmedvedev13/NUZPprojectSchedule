import React, { useState } from "react";
import { Button, Modal, Form, Row } from "react-bootstrap";
import { LoginUser } from "./mutations";
import { useMutation } from "@apollo/client";

function ModalAuthorization(props) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loginUser, { data, error }] = useMutation(LoginUser);
  const { open } = props;

  const handleChange = (event) => {
    if (event.target.type === "email") {
      setEmail(event.target.value);
    } else setPassword(event.target.value);
  };
  const handleClose = () => {
    props.handleCloseModal();
  };

  const handleLogin = () => {
    const { login } = props;
    loginUser({ variables: { email, password } }).then((data) => {
      const user = data.data.LoginUser;
      if (!user.isAuth.successful) {
        alert(user.isAuth.message);
        return;
      } else {
        alert(user.isAuth.message);
        login(
          { openLogin: false, userID: user.id, isLoggin: true },
          user.accessToken
        );
        handleClose();
      }
    });
  };

  return (
    <>
      <Modal size="lg" show={open} onHide={handleClose}>
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
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Row} className="my-2 mx-2" controlId="formPassword">
              <Form.Label className="col-auto">Password: </Form.Label>
              <Form.Control
                className="col"
                type="password"
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрити
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Авторизоватися
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ModalAuthorization;
