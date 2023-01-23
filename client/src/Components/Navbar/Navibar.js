import React, { Fragment } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

class NaviBar extends React.Component {
  render() {
    const { open, isLoggin, email } = this.props;
    return (
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand>NUZP-Розклад</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-between ">
            <Nav
              variant="tabs"
              activeKey={`/${window.location.pathname.split("/", 2)?.at(1)}`}
              className="mx-0 align-items-center"
            >
              <Nav.Link
                className="text-white-50 bg-dark"
                to="/schedules"
                href="/schedules"
              >
                Розклад
              </Nav.Link>
              {isLoggin && (
                <Fragment>
                  <Nav.Link
                    as={Link}
                    className="text-white-50 bg-dark"
                    to="/audiences"
                  >
                    Аудиторії
                  </Nav.Link>
                  <Nav.Link
                    className=" text-white-50 bg-dark"
                    to="/cathedras"
                    href="/cathedras"
                  >
                    Кафедри
                  </Nav.Link>
                  <Nav.Link
                    className=" text-white-50 bg-dark"
                    to="/specialties"
                    href="/specialties"
                  >
                    Спеціальності
                  </Nav.Link>
                  <Nav.Link
                    className="text-white-50 bg-dark"
                    to="/disciplines"
                    href="/disciplines"
                  >
                    Дисципліни
                  </Nav.Link>
                  <Nav.Link
                    className=" text-white-50 bg-dark"
                    to="/classes"
                    href="/classes"
                  >
                    Заняття
                  </Nav.Link>
                  <Nav.Link
                    className="text-white-50 bg-dark"
                    to="/groups"
                    href="/groups"
                  >
                    Групи
                  </Nav.Link>
                  <Nav.Link
                    className=" text-white-50 bg-dark"
                    to="/teachers"
                    href="/teachers"
                  >
                    Викладачі
                  </Nav.Link>
                  <Nav.Link
                    className="text-white-50 bg-dark"
                    to="/admin_schedule_data"
                    href="/admin_schedule_data"
                  >
                    Адмін
                  </Nav.Link>
                </Fragment>
              )}
            </Nav>
            <Nav className="mx-2 ">
              <Navbar.Brand className="align-self-center">
                {isLoggin ? email : ""}
              </Navbar.Brand>
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
    );
  }
}
export default NaviBar;
