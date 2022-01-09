import React from "react"
import {Table} from "react-bootstrap";
import ExchangeCathedras from "./ExchangeCathedras.js";

class CathedrasTable extends React.Component{
    

    render(){
        return(
            <>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Назва кафедри</th>
                        </tr>
                    </thead>
                    <tbody>
                        <ExchangeCathedras />
                    </tbody>
                </Table>
            </>
        );
    }
}

export default CathedrasTable;