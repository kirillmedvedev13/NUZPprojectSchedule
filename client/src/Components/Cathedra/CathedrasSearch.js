import {Form, Row, Col} from "react-bootstrap"
import {Search} from "react-bootstrap-icons"
import React from "react";

class CathedrasSearch extends React.Component {

    render() {
      const { handleSearch, name} = this.props;
  
      return (
        <Form className="my-2 mx-2">
            <Form.Group as={Row} >
                <Form.Label column className="col-auto justify-content-center"><Search className="align-self-center"></Search></Form.Label>
                <Col className="px-0"><Form.Control onChange={handleSearch} value={name} type="text" placeholder="Назва кафедри" /></Col>
            </Form.Group>
        </Form>
      );
    }
  };

  export default CathedrasSearch;
