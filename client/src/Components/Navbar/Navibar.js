import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Style from "./Style";

class NaviBar extends React.Component {
  render() {
    return (
      <Style>
        <Navbar variant="dark" bg="dark" expand="lg">
          <Container fluid>
            <Navbar.Brand>NUZP-Розклад</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-between ">
              <Nav className="m-0 align-items-center">
                <Nav.Link>
                  <Link to="/schedules">Розклад</Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/cathedras">Кафедри</Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/audiences">Аудиторії</Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/specialties">Спеціальності</Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/disciplines">Дисципліни</Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/classes">Заняття</Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/groups">Групи</Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/teachers">Вчителі</Link>
                </Nav.Link>
              </Nav>
              <Nav className="mx-2 ">
                <Button
                  className="mx-1  my-1 align-self-center"
                  variant="success"
                >
                  Увійти
                </Button>
                <Button
                  className="mx-1  my-1 align-self-center"
                  variant="secondary"
                >
                  Зареєструватися
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Style>
    );
  }
}
export default NaviBar;
