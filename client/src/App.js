import { Fragment } from "react";
import NaviBar from "./Components/Navbar/Navibar";
import React from "react";
import ModalAuthorization from "./Components/Authorization/ModalAuthorization";
import { AuthContext } from "./Components/Authorization/AuthContext";

class App extends React.Component {
  state = {
    openLogin: false,
    isLoggin: false,
    userID: null,
  };
  loginSuccess = (data, token) => {
    this.setState({
      ...data,
    });
    this.context.setToken(token);
  };
  handleOpenModalLogin = () => {
    if (this.state.isLoggin) {
      this.setState({ isLoggin: false, userID: null });
      this.context.logOut();
    } else {
      const res = this.context.loadData();
      res.then((data) => {
        if (!data) {
          this.setState({
            openLogin: true,
          });
        } else {
          if (data.isAuth.successful) {
            alert(data.isAuth.message);
            this.setState({ isLoggin: true, userID: data.id });
            this.context.setUser(data.id);
          } else {
            this.setState({
              openLogin: true,
            });
          }
        }
      });
    }
  };
  handleCloseModalLogin = () => {
    this.setState({
      openLogin: false,
      userID: null,
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
        />
        {this.props.children}
      </Fragment>
    );
  }
}
App.contextType = AuthContext;
export default App;
