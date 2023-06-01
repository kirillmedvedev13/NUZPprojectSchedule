import { Fragment } from "react";
import NaviBar from "./Components/Navbar/Navibar";
import React from "react";
import ModalAuthorization from "./Components/Authorization/ModalAuthorization";
import { AuthContext } from "./Components/Authorization/AuthContext";
import { NotificationContainer } from "react-notifications";
import { CreateNotification } from "./Components/Alert";
import Schedule from "./Components/Schedule/Schedule";
import Error from "./Components/Error/Error";
import Cathedra from "./Components/Cathedra/Cathedra";
import Audience from "./Components/Audience/Audience";
import Specialty from "./Components/Specialty/Specialty";
import Discipline from "./Components/Discipline/Discipline";
import Class from "./Components/Class/Class";
import Group from "./Components/Group/Group";
import Teacher from "./Components/Teacher/Teacher";
import { Routes, Route } from "react-router-dom";
import GeneralValues from "./Components/Admin/GeneralValues/GeneralValues";
import ScheduleData from "./Components/Admin/ScheduleData/ScheduleData";
import SubmitDataSheet from "./Components/Admin/SubmitDataSheet/SubmitDataSheet";
import ManagementData from "./Components/Admin/ManagementData/ManagementData";
import Algorithms from "./Components/Admin/Algorithms/Algorithms";

class App extends React.Component {
  state = {
    openLogin: false,
    isLoggin: false,
    userID: "",
    userEmail: "",
  };

  loginSuccess = (data, token) => {
    this.setState({
      ...data,
    });
    this.context.setUser(data.userId, data.userEmail);
    this.context.setToken(token);
  };

  alert = CreateNotification;

  componentDidMount() {
    const res = this.context.loadData();

    res.then((data) => {
      if (data) {
        if (data.isAuth.successful) {
          this.setState({
            isLoggin: true,
            userId: data.id,
            userEmail: data.email,
          });
          this.context.setUser(data.id, data.email);
        }
      }
    });
  }

  handleOpenModalLogin = () => {
    if (this.state.isLoggin) {
      this.setState({ isLoggin: false, userID: null, userEmail: null });
      this.context.logOut();
      CreateNotification({ successful: true, message: "Успішний вихід" });
    } else {
      this.setState({
        openLogin: true,
      });
    }
  };

  handleCloseModalLogin = () => {
    this.setState({
      openLogin: false,
    });
  };

  render() {
    return (
      <Fragment>
        <ModalAuthorization
          open={this.state.openLogin}
          handleCloseModal={this.handleCloseModalLogin}
          login={this.loginSuccess}
        />
        <NaviBar
          open={this.handleOpenModalLogin}
          isLoggin={this.state.isLoggin}
          email={this.state.userEmail}
        />
        <Routes>
          <Route
            exact
            path="/"
            element={<Schedule title="Розклад"></Schedule>}
          />
          <Route
            path="/schedules"
            element={<Schedule title="Розклад"></Schedule>}
          />
          {this.state.isLoggin && (
            <Fragment>
              <Route
                path="/cathedras"
                element={<Cathedra title="Кафедри"></Cathedra>}
              />
              <Route
                path="/audiences"
                element={<Audience title="Аудиторії"></Audience>}
              />
              <Route
                path="/specialties"
                element={<Specialty title="Спеціальності"></Specialty>}
              />
              <Route
                path="/disciplines"
                element={<Discipline title="Дисципліни"></Discipline>}
              />
              <Route
                path="/classes"
                element={<Class title="Заняття"></Class>}
              />
              <Route path="/groups" element={<Group title="Групи"></Group>} />
              <Route
                path="/teachers"
                element={<Teacher title="Викладачі"></Teacher>}
              />
              <Route
                path="/admin_general_values"
                element={<GeneralValues title="Загальні дані"></GeneralValues>}
              />
              <Route
                path="/admin_management_data"
                element={
                  <ManagementData title="Видалення даних"></ManagementData>
                }
              />
              <Route
                path="/admin_submit_data_sheet"
                element={
                  <SubmitDataSheet title="Завантаження відомостей"></SubmitDataSheet>
                }
              />
              <Route
                path="/admin_schedule_data"
                element={<ScheduleData title="Оцінка розкладу"></ScheduleData>}
              />
              <Route
                path="/admin_algorithms"
                element={<Algorithms title="Запуск алгоритмів"></Algorithms>}
              />
            </Fragment>
          )}
          <Route path="*" title="Помилка" element={<Error></Error>} />
        </Routes>
        <NotificationContainer />
      </Fragment>
    );
  }
}
App.contextType = AuthContext;
export default App;
