import { Fragment } from "react";
import NaviBar from "./Components/Navbar/Navibar";
import React from "react";



class App extends React.Component{
  state = {
    openLogin: false,
  }
  render(){
    console.log(this)
      return(
        <Fragment>
          <NaviBar />
          {this.props.children}
      </Fragment>
      )
  }
}


export default App;
