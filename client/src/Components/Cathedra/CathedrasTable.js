import React from "react"
import {Table} from "react-bootstrap";
import ModalCathedra from "./ModalCathedra.js";
import {XCircle, PencilSquare} from "react-bootstrap-icons";
import withHocs from "./CathedrasTableHoc.js"
import CathedrasSearch from "./CathedrasSearch.js"

class CathedrasTable extends React.Component{
    
    state = {
        openModal: false,
        name: "",
    }

    handleSearchCathedra = (event) =>{
        this.setState({name: event.target.value},() => {
            const {data} = this.props;
            const {name} = this.state;
            data.fetchMore({
                variables: {name},
                updateQuery: (previousResult, {fetchMoreResult}) => {
                    return {
                        GetAllCathedras: [...fetchMoreResult.GetAllCathedras]
                    }
                }
            }
            )
        }
        );
    }

    handleOpenModal = () => {this.setState({openModal: true})};
    handleCloseModal = () => {this.setState({openModal: false})};

    handleClick = ({currentTarget}, data) => {
        this.setState({
            data,
        })
    }


    render(){
        const {name} = this.state;
        const {data = {}} = this.props;
        const {GetAllCathedras = []} = data;
        
        return(
            <div className="container-fluid w-100">
                <CathedrasSearch handleSearch={this.handleSearchCathedra} name={name}></CathedrasSearch>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Назва кафедри</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        GetAllCathedras.map(cathedra => {
                        return(
                            <tr key={cathedra.id} >
                                <td> {cathedra.name} </td>
                                <td className="col-2">
                                    <PencilSquare className="mx-1" type="button"  />
                                    <XCircle className="mx-1" type="button"  />
                                </td>
                            </tr>
                        )
                        })
                    }
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default withHocs(CathedrasTable);