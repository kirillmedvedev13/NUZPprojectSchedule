import React from "react";
import { Button, Modal } from "react-bootstrap";
import withHocs from "./CathedraDialogHoc"
import withHocsCathedras from "./CathedrasTableHoc"

 class CathedraDialog extends React.Component{

  handleClose = () => { 
    this.props.handleCloseDialog(); 
  };

  handleConfirm = () => {
    const { selectedValue,handleCloseDialog, DeleteCathedra, filters, fetchCathedras, data} = this.props;
    const { id } = selectedValue;
    if(id)
      DeleteCathedra({ id }).then(() => {
        fetchCathedras(data,filters);
      })
    handleCloseDialog();
  };

    render(){
    const { open, selectedValue = {}} = this.props;
    const {name} = selectedValue;
    
    return (
        <>
          <Modal size="lg" show={open} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Видалити кафедру {name}?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Відмінити
              </Button>
              <Button variant="primary" onClick={this.handleConfirm}>
                Видалити
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
}

export default withHocsCathedras(withHocs(CathedraDialog));