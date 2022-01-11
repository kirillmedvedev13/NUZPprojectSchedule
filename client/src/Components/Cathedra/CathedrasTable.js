import React from "react"
import { Table } from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import withHocs from "./CathedrasTableHoc.js"
import CathedrasSearch from "./CathedrasSearch.js"

class CathedrasTable extends React.Component {

    state = {
        openDialog: false,
        name: "",
    }

    handleSearchCathedra = (event) => {
        this.setState({ name: event.target.value });
        const { data } = this.props;
        console.log(event)
        if (event.target.value.length > 2 || event.target.value.length === 0) {
            data.fetchMore({
                variables: { name: event.target.value },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    return {
                        GetAllCathedras: [...fetchMoreResult.GetAllCathedras]
                    }
                }
            })
        }
    }

    handleDialogOpen = () => { this.setState({ openDialog: true }); };
    handleDialogClose = () => { this.setState({ openDialog: false }); };


    handleEdit = (data) => (event) => {
        this.props.handleOpenModal(data);
    };

    handleDelete = () => {
        this.handleDialogOpen();
    };

    render() {
        const { name } = this.state;
        const { data = {} } = this.props;
        const { GetAllCathedras = [] } = data;

        return (
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
                                return (
                                    <tr key={cathedra.id} >
                                        <td> {cathedra.name} </td>
                                        <td className="col-2">
                                            <PencilSquare className="mx-1" type="button" onClick={this.handleEdit(cathedra)} />
                                            <XCircle className="mx-1" type="button" />
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