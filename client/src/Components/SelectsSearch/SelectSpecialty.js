import { GET_ALL_SPECIALTIES } from "../Specialty/queries";
import { useQuery } from "@apollo/client";
import Select from "react-select";

export default function SelectSpecialty({ handleChangeFilters }) {
    const { error, loading, data } = useQuery(GET_ALL_SPECIALTIES);
    if (loading) return "Loading...";
    if (error) return `Error! ${error}`;
    let options = [];
    data.GetAllSpecialties.forEach((item) => {
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
            placeholder="Спеціальність"
            onChange={(e) => {
                handleChangeFilters("id_specialty", e ? +e.value : null);
            }}
        />
    );
}