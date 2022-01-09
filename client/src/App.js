import { Component, Fragment } from "react";
import NavBar from "./Components/Navbar/Navbar";

const App = ({children}) =>  (
  <Fragment>
    <NavBar />
    {children}
  </Fragment>
)

export default App;
