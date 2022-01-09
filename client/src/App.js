import { Fragment } from "react";
import NaviBar from "./Components/Navbar/Navibar";

const App = ({children}) =>  (
  <Fragment>
    <NaviBar />
    {children}
  </Fragment>
)

export default App;
