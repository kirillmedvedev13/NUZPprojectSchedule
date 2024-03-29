import React, { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { LoginUser } from "./mutations";
import { useMutation } from "@apollo/client";
import { CreateNotification } from "../Alert";

function ModalAuthorization(props) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loginUser] = useMutation(LoginUser);
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
        CreateNotification(user.isAuth);

        return;
      } else {
        CreateNotification(user.isAuth);
        login(
          {
            openLogin: false,
            userId: user.id,
            userEmail: user.email,
            isLoggin: true,
          },
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
          <Form.Group as={Row} className="my-2 mx-2 justify-content-between">
            <Form.Label className="col-md-2 my-2">Почта: </Form.Label>
            <Col className="col-md-10 my-1">
              <Form.Control
                className="col"
                type="email"
                onChange={handleChange}
              />
            </Col>
            <Form.Label className="col-md-2 my-2">Пароль: </Form.Label>{" "}
            <Col className="col-md-10 my-1">
              <Form.Control
                className="col"
                type="password"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Row className="w-100 justify-content-end mx-3">
            <Button
              className="col-md-3 mx-2 my-2"
              variant="secondary"
              onClick={handleClose}
            >
              Закрити
            </Button>

            <Button
              className="col-md-3 mx-2 my-2"
              variant="primary"
              onClick={handleLogin}
            >
              Авторизуватися
            </Button>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ModalAuthorization;
