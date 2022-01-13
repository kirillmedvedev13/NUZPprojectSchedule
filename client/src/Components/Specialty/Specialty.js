import React from "react"
import TemplateSearch from "../Template/TemplateSearch"
import TemplateTable from "../Template/TemplateTable";
import update from 'react-addons-update'
import {searchinfo, tableinfo, mutations} from "./config"

class Specialty extends React.Component {
    state = {
        filters: {
            name: "",
            id_cathedra: null
        }
    }

    handleChangeFilters = (name, value) => {
        this.setState(PrevState => ({
            filters: update(PrevState.filters, { $merge: { [name]: value } })
        })
        )
    }

    render() {
        const { filters } = this.state;

        return (
            <>
                <TemplateSearch searchinfo={searchinfo} handleChangeFilters={this.handleChangeFilters}></TemplateSearch>
                <TemplateTable filters={filters} tableinfo={tableinfo} mutations={mutations}></TemplateTable>
            </>
        )
    }
}

export default Specialty;