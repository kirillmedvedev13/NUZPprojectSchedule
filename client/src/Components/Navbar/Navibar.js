import React, { Fragment } from "react";
import { Navbar, Container, Nav, Button, Dropdown } from "react-bootstrap";
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
                    className=" text-white-50 bg-dark"
                    to="/cathedras"
                    href="/cathedras"
                  >
                    Кафедри
                  </Nav.Link>
                  <Nav.Link
                    className=" text-white-50 bg-dark"
                    to="/teachers"
                    href="/teachers"
                  >
                    Викладачі
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
                    to="/groups"
                    href="/groups"
                  >
                    Групи
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    className="text-white-50 bg-dark"
                    to="/audiences"
                  >
                    Аудиторії
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

                  <Dropdown className="text-white-50 bg-dark ">
                    <Dropdown.Toggle as={Nav.Link}>
                      Адміністрування
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="text-white-50 bg-dark">
                      <Dropdown.Item
                        as={Nav.Link}
                        className="my-1 text-white-50 bg-dark"
                        href="/admin_algorithms"
                        to="/admin_algorithms"
                      >
                        Запуск алгоритмів
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Nav.Link}
                        href="/admin_schedule_data"
                        to="/admin_schedule_data"
                        className=" my-1 text-white-50 bg-dark"
                      >
                        Оцінка поточного розкладу
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Nav.Link}
                        className="my-1 text-white-50 bg-dark"
                        href="/admin_general_values"
                        to="/admin_general_values"
                      >
                        Загальні дані
                      </Dropdown.Item>

                      <Dropdown.Item
                        as={Nav.Link}
                        className="my-1 text-white-50 bg-dark"
                        href="/admin_management_data"
                        to="/admin_management_data"
                      >
                        Видалення даних
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Nav.Link}
                        className="my-1 text-white-50 bg-dark"
                        href="/admin_submit_data_sheet"
                        to="/admin_submit_data_sheet"
                      >
                        Завантаження відомостей
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
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
