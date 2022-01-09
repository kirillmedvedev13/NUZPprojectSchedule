import { Fragment } from "react";
import NaviBar from "./Components/Navbar/Navibar";

const App = ({element}) =>  (
  <Fragment>
    <NaviBar />
    {element}
  </Fragment>
)

export default App;
