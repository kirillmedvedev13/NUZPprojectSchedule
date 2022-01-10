import React from "react"
import {Table} from "react-bootstrap";
import ExchangeCathedras from "./ExchangeCathedras.js";
import ModalCathedra from "./ModalCathedra.js";

class CathedrasTable extends React.Component{
    
    state = {
        showModal: false,
        name: "",
        id: 0,
    }

    handleOpenModal = (id,name) =>{
        this.setState({showModal: true, id, name})
    }

    handleSaveModal = (new_name) =>{
        this.setState({showModal: false, id: 0, name: ""})
    }

    render(){
        return(
            <div className="container-fluid w-100">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Назва кафедри</th>
                        </tr>
                    </thead>
                    <tbody>
                        <ExchangeCathedras handleOpenModal={this.handleOpenModal}/>
                    </tbody>
                </Table>
                <ModalCathedra showModal={this.state.showModal} handleSave={this.handleSaveModal} id={this.state.id} name={this.state.name}/>
            </div>
        );
    }
}

export default CathedrasTable;