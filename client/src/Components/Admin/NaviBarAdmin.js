import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class NaviBarAdmin extends React.Component {
  render() {
    return (
      <Navbar variant="dark" bg="dark">
        <Nav
          activeKey={window.location.pathname}
          style={{ borderBottom: 0 }}
          className="mx-0 align-items-center"
          variant="tabs"
        >
          <Nav.Link
            as={Link}
            className="mx-1 text-white-50 bg-dark"
            href="/admin_schedule_data"
            to="/admin_schedule_data"
          >
            Дані про поточний розклад
          </Nav.Link>
          <Nav.Link
            as={Link}
            className="mx-1 text-white-50 bg-dark"
            href="/admin_general_values"
            to="/admin_general_values"
          >
            Загальні дані
          </Nav.Link>
          <Nav.Link
            as={Link}
            className="mx-1 text-white-50 bg-dark"
            href="/admin_algorithms"
            to="/admin_algorithms"
          >
            Алгоритми
          </Nav.Link>
          <Nav.Link
            as={Link}
            className="mx-1 text-white-50 bg-dark"
            href="/admin_delete_data"
            to="/admin_delete_data"
          >
            Видалення даних
          </Nav.Link>
          <Nav.Link
            as={Link}
            className="mx-1 text-white-50 bg-dark"
            href="/admin_submit_data_sheet"
            to="/admin_submit_data_sheet"
          >
            Завантаження відомостей
          </Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}
