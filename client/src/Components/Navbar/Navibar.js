import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Style from "./Style";

class NaviBar extends React.Component {
  render() {
    const { open, isLoggin, email } = this.props;
    return (
      <Style>
        <Navbar variant="dark" bg="dark" expand="lg">
          <Container fluid>
            <Navbar.Brand>NUZP-Розклад</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-between ">
              <Nav className="mx-0 align-items-center">
                <Link className="mx-1" to="/schedules">
                  Розклад
                </Link>
                <Link className="mx-1" to="/audiences">
                  Аудиторії
                </Link>
                <Link className="mx-1" to="/cathedras">
                  Кафедри
                </Link>
                <Link className="mx-1" to="/specialties">
                  Спеціальності
                </Link>
                <Link className="mx-1" to="/disciplines">
                  Дисципліни
                </Link>
                <Link className="mx-1" to="/classes">
                  Заняття
                </Link>
                <Link className="mx-1" to="/groups">
                  Групи
                </Link>
                <Link className="mx-1" to="/teachers">
                  Вчителі
                </Link>
                <Link className="mx-1" to="/admin">
                  Адмін
                </Link>
              </Nav>
              <Nav className="mx-2 ">
                <Navbar.Brand>{isLoggin ? email : ""}</Navbar.Brand>
                <Button
                  className="mx-1  my-1 align-self-center"
                  variant="success"
                  onClick={open}
                >
                  {isLoggin ? "Вийти" : "Увійти"}
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
