import React from "react";
import { Button, Modal, Form, Row } from "react-bootstrap";
import withHocs from "./ModalCathedraHoc.js"
import withHocsCathedras from "./CathedrasTableHoc"

class ModalCathedra extends React.Component {

  handleClose = () => { this.props.handleCloseModal(); };

  handleSave = () => {
    const { filters, selectedValue, handleCloseModal, CreateCathedra, UpdateCathedra, data } = this.props;
    const { id, name } = selectedValue;
    const query = id ? UpdateCathedra : CreateCathedra;
    query({ id, name }, filters).then(() => data.fetchMore({
      variables: filters,
      updateQuery: (previousResult, { fetchMoreResult }) => {
        return {
          GetAllCathedras: [...fetchMoreResult.GetAllCathedras]
        }
      }
    })
    );
    handleCloseModal();
  };

  render() {
    const { open, handleChange, selectedValue = {} } = this.props;
    const { id, name } = selectedValue;

    return (
      <>
        <Modal size="lg" show={open} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Редагування кафедри</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} className="my-2 mx-2" >
                <Form.Label className="col-auto">Назва кафедри</Form.Label>
                <Form.Control className="col" type="text" value={name} onChange={handleChange('name')} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Закрити
            </Button>
            <Button variant="primary" onClick={this.handleSave}>
              {id ? "Оновити кафедру" : "Додати кафедру"}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}


export default withHocsCathedras(withHocs(ModalCathedra));