import { Fragment, useContext } from "react";
import NaviBar from "./Components/Navbar/Navibar";
import React from "react";
import ModalAuthorization from "./Components/Authorization/ModalAuthorization";
import { AuthContext } from "./Components/Authorization/AuthContext";
import { NotificationContainer } from "react-notifications";
import { CreateNotification } from "./Components/Alert";
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
      CreateNotification({ successful: true, message: "You're logged out" });
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
        <NotificationContainer />
        {this.props.children}
      </Fragment>
    );
  }
}
App.contextType = AuthContext;
export default App;
