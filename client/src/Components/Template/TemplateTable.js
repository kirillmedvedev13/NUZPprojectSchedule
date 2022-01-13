import React from "react"
import { Table, Button} from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { useQuery } from "@apollo/client";
import _ from 'lodash';
import TemplateDialog from "./TemplateDialog";

function DataTable({ filters, tableinfo, handleChangeSelected, handleOpenDialog}) {
    const { loading, error, data } = useQuery(tableinfo.query.gql, {
        variables: filters,
    });
    if (loading) return null;
    if (error) return `Error! ${error}`;
    return (
        <tbody>
            {data[tableinfo.query.name].map(item => (
                <tr key={item.id} >
                    {tableinfo.rows.map(row => 
                        <td>{_.get(item, row.nameatr)}</td>
                    )}
                    <td className="col-2" onClick={(e) => handleChangeSelected(item)}>
                        <PencilSquare className="mx-1" type="button" />
                        <XCircle className="mx-1" type="button" onClick={(e) => handleOpenDialog()}/>
                    </td>
                </tr>
            ))}
        </tbody>
    )
}

class TemplateTable extends React.Component {
    state = {
        openDialog: false
    }

    handleChangeSelected = (item) => {
        this.setState({selecteditem: item})
    }

    handleOpenDialog = () => {
        this.setState({
            openDialog: true,
        })
    }

    handleCloseDialog = () => {
        this.setState({
            openDialog: false,
        })
    }

    render() {
        const { filters, tableinfo, mutations } = this.props;
        const {selecteditem} = this.state;
        return (
            <div className="container-fluid w-100">
                <div className="row px-2 py-2 justify-content-end"><Button variant="primary" className="col-auto" >Додати запис</Button></div>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {tableinfo.rows.map(header => {
                                return <th>{header.headname}</th>
                            })}
                        </tr>
                    </thead>
                    <DataTable filters={filters} tableinfo={tableinfo} handleChangeSelected={this.handleChangeSelected} handleOpenDialog={this.handleOpenDialog}></DataTable>
                </Table>

                <TemplateDialog refetch={tableinfo.query.gql} isopen={this.state.openDialog} item={selecteditem} mutation={mutations.delete} handleCloseDialog={this.handleCloseDialog}></TemplateDialog>
            </div>
        );
    }
}

export default TemplateTable;