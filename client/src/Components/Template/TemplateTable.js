import React from "react"
import { Table, Button} from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { useQuery } from "@apollo/client";
import _ from 'lodash';

function DataTable({ filters, tableinfo }) {
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
                        <td>{_.get(item, row.namecol)}</td>
                    )}
                    <td className="col-2">
                        <PencilSquare className="mx-1" type="button" />
                        <XCircle className="mx-1" type="button" />
                    </td>
                </tr>
            ))}
        </tbody>
    )
}

class TemplateTable extends React.Component {

    render() {
        const { filters, tableinfo } = this.props;
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
                    <DataTable filters={filters} tableinfo={tableinfo}></DataTable>
                </Table>
            </div>
        );
    }
}

export default TemplateTable;