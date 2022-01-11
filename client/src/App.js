import { Fragment } from "react";
import NaviBar from "./Components/Navbar/Navibar";
import React from "react";
import ModalAuthorization from "./Components/Authorization/ModalAuthorization";

class App extends React.Component {
  state = {
    openLogin: false,
    userID: null,
    jwtToken: null,
  };
  handleOpenModalLogin = (data) => {
    this.setState({
      openLogin: true,
      ...data,
    });
  };
  handleCloseModalLogin = (data) => {
    this.setState({
      openLogin: false,
      userID: null,
      jwtToken: null,
    });
  };
  render() {
    console.log(this);
    return (
      <Fragment>
        <ModalAuthorization
          open={this.state.openLogin}
          handleCloseModal={this.handleCloseModalLogin}
        />
        <NaviBar open={this.handleOpenModalLogin} />
        {this.props.children}
      </Fragment>
    );
  }
}

export default App;
