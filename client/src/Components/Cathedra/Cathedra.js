import React from "react"
import CathedrasTable from "./CathedrasTable"
import ModalCathedra from "./ModalCathedra";

class Cathedra extends React.Component{
    state = {
        openModal: false,
        name: '',
    }

    handleOpenModal = (data) => {
        console.log(data);
        this.setState({
          openModal: true,
          ...data,
        });
    };

    handleCloseModal = () => { 
        this.setState({ 
            name: '', 
            id: null, 
            openModal: false 
        }); 
    };

    handleChange = (name) => (event) => { 
        this.setState({
            [name]: event.target.value 
        }); 
    };


    render(){
        const { name, id, openModal } = this.state;

        return(
            <div>
                <ModalCathedra handleChange={this.handleChange} selectedValue={{ name, id }} open={openModal} handleCloseModal={this.handleCloseModal}/>
                <CathedrasTable handleOpenModal={this.handleOpenModal} onClose={this.handleCloseModal}/>
            </div>
        )
    }
}

export default Cathedra;