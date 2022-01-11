import { Fragment } from "react";
import NaviBar from "./Components/Navbar/Navibar";
import React from "react";
import ModalAuthorization from "./Components/Authorization/ModalAuthorization";

class App extends React.Component {
  state = {
    openLogin: false,
    userID: null,
  };

  loginSuccess = (data) => {
    this.setState({
      ...data,
    });
  };
  handleOpenModalLogin = () => {
    this.setState({
      openLogin: true,
    });
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
        <NaviBar open={this.handleOpenModalLogin} />
        {this.props.children}
      </Fragment>
    );
  }
}

export default App;
