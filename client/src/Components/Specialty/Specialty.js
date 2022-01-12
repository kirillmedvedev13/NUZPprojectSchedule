import React from "react"
import TemplateSearch from "../Template/TemplateSearch"
import TemplateTable from "../Template/TemplateTable";
import { GetAllSpecialties } from "./queries";
import { GetAllCathedras } from "../Cathedra/queries"
import update from 'react-addons-update'

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
        const tableinfo = {
            rows: [
                {
                    headname: "Назва спеціалізації",
                    namecol: "name",
                },
                {
                    headname: "Назва кафедри",
                    namecol: "cathedra.name",
                }
            ],
            query: {
                name: "GetAllSpecialties",
                gql: GetAllSpecialties,
            }
        }
        const searchinfo = [
            {
                type: "input",
                namefilter: "name",
                typeValue: String,
                placeholder: "Спеціальність",
            },
            {
                type: "select",
                namefilter: "id_cathedra",
                typeValue: Number,
                placeholder: "Кафедра",
                query: {
                    name: "GetAllCathedras",
                    gql: GetAllCathedras,
                }
            }
        ]
        return (
            <>
                <TemplateSearch searchinfo={searchinfo} handleChangeFilters={this.handleChangeFilters}></TemplateSearch>
                <TemplateTable filters={filters} tableinfo={tableinfo}></TemplateTable>
            </>
        )
    }
}

export default Specialty;