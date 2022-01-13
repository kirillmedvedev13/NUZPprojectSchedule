import { GetAllSpecialties } from "./queries";
import { GetAllCathedras } from "../Cathedra/queries"
import { CreateSpecialty, UpdateSpecialty, DeleteSpecialty } from "./mutations"

export const tableinfo = {
    rows: [
        {
            headname: "Назва спеціалізації",
            nameatr: "name",
        },
        {
            headname: "Назва кафедри",
            nameatr: "cathedra.name",
        }
    ],
    query: {
        name: "GetAllSpecialties",
        gql: GetAllSpecialties,
    }
}
export const searchinfo = [
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
            nameatr: "name",
        }
    }
]

export const mutations = {
    create: CreateSpecialty,
    update: UpdateSpecialty,
    delete: DeleteSpecialty,
}