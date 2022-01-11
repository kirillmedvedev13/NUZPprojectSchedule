import React from "react"
import CathedrasTable from "./CathedrasTable"
import ModalCathedra from "./ModalCathedra";
import CathedraDialog from "./CathedraDialog";

class Cathedra extends React.Component{
    state = {
        openModal: false,
        openDialog: false,
        name: '',
    }

    handleOpenDialog = (data, filters) => { 
        this.setState({ 
            openDialog: true ,
            ...data,
            filters
        }); 
    };

    handleCloseDialog = () => { 
        this.setState({ 
            openDialog: false ,
            name: '', 
            id: null, 
        }); 
    };

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

    fetchCathedras = (data, variables) => {
        data.fetchMore({
            variables,
            updateQuery: (previousResult, { fetchMoreResult }) => {
                return {
                    GetAllCathedras: [...fetchMoreResult.GetAllCathedras]
                }
            }
        })
    }

    render(){
        const { name, id, openModal, filters, openDialog} = this.state;
        return(
            <div>
                <CathedraDialog fetchCathedras={this.fetchCathedras} filters={filters} selectedValue={{id, name}} open={openDialog} handleCloseDialog={this.handleCloseDialog}></CathedraDialog>
                <ModalCathedra fetchCathedras={this.fetchCathedras} handleChange={this.handleChange} filters={filters} selectedValue={{ name, id }} open={openModal} handleCloseModal={this.handleCloseModal}/>
                <CathedrasTable handleOpenDialog={this.handleOpenDialog} handleOpenModal={this.handleOpenModal} fetchCathedras={this.fetchCathedras}/>
            </div>
        )
    }
}

export default Cathedra;