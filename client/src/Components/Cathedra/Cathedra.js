import React from "react"
import CathedrasTable from "./CathedrasTable"
import ModalCathedra from "./ModalCathedra";

class Cathedra extends React.Component{
    state = {
        openModal: false,
        name: '',
    }

    handleOpenModal = (data, filters) => {
        this.setState({
          openModal: true,
          ...data,
          filters
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
        const { name, id, openModal, filters} = this.state;
        return(
            <div>
                <ModalCathedra handleChange={this.handleChange} filters={filters} selectedValue={{ name, id }} open={openModal} handleCloseModal={this.handleCloseModal}/>
                <CathedrasTable handleOpenModal={this.handleOpenModal} />
            </div>
        )
    }
}

export default Cathedra;