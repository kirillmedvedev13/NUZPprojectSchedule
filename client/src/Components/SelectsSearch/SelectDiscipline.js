import { GET_ALL_DISCIPLINES } from "../Discipline/queries";
import { useQuery } from "@apollo/client";
import Select from "react-select";

export default function SelectDiscipine({ handleChangeFilters }) {
    const { error, loading, data } = useQuery(GET_ALL_DISCIPLINES);
    if (loading) return "Loading...";
    if (error) return `Error! ${error}`;
    let options = [];
    data.GetAllDisciplines.forEach((item) => {
        options.push({
            label: item.name,
            value: +item.id,
        });
    });
    return (
        <Select
            className="col-12"
            isClearable
            options={options}
            placeholder="Дисципліна"
            onChange={(e) => {
                handleChangeFilters("id_discipline", e ? +e.value : null);
            }}
        />
    );
}