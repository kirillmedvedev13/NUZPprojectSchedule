import React, { useState } from "react";
import { Button, Modal, Form, } from "react-bootstrap";
import { LoginUser } from "./mutations";
import { useMutation } from "@apollo/client";
import { CreateNotification } from "../Alert";
import { Table } from "react-bootstrap";

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
          <Form>
            <Table borderless>
              <tbody>
                <tr>
                  <td>
                    <Form.Label className="col-auto">Почта: </Form.Label>
                  </td>
                  <td>
                    <Form.Control
                      className="col"
                      type="email"
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Form.Label className="col-auto">Пароль: </Form.Label>{" "}
                  </td>
                  <td>
                    <Form.Control
                      className="col"
                      type="password"
                      onChange={handleChange}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрити
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Авторизуватися
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ModalAuthorization;
