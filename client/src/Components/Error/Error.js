import React from "react";
import { Alert } from "react-bootstrap";

class Error extends React.Component {
  render() {
    return (
      <div>
        <Alert className="mx-2 my-2 text-center" variant="danger">
          Сторінку не знайдено
        </Alert>
      </div>
    );
  }
}
export default Error;
