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
import DeleteData from "./Components/Admin/DeleteData/DeleteData";
import Algorithms from "./Components/Admin/Algorithms/Alghorithms";

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
          <Route exact path="/" element={<Schedule></Schedule>} />
          <Route path="/schedules" element={<Schedule></Schedule>} />
          {this.state.isLoggin && (
            <Fragment>
              <Route path="/cathedras" element={<Cathedra></Cathedra>} />
              <Route path="/audiences" element={<Audience></Audience>} />
              <Route path="/specialties" element={<Specialty></Specialty>} />
              <Route path="/disciplines" element={<Discipline></Discipline>} />
              <Route path="/classes" element={<Class></Class>} />
              <Route path="/groups" element={<Group></Group>} />
              <Route path="/teachers" element={<Teacher></Teacher>} />
              <Route
                path="/admin/general_values"
                element={<GeneralValues></GeneralValues>}
              />
              <Route
                path="/admin/delete_data"
                element={<DeleteData></DeleteData>}
              />
              <Route
                path="/admin/submit_data_sheet"
                element={<SubmitDataSheet></SubmitDataSheet>}
              />
              <Route
                path="/admin/schedule_data"
                element={<ScheduleData></ScheduleData>}
              />
              <Route
                path="/admin/algorithms"
                element={<Algorithms></Algorithms>}
              />
            </Fragment>
          )}
          <Route path="*" element={<Error></Error>} />
        </Routes>
        <NotificationContainer />
      </Fragment>
    );
  }
}
App.contextType = AuthContext;
export default App;
