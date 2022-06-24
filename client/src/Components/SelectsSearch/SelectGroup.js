import { GET_ALL_GROUPS } from "../Group/queries";
import { useQuery } from "@apollo/client";
import Select from "react-select";

export default function SelectGroup({ handleChangeFilters }) {
    const { error, loading, data } = useQuery(GET_ALL_GROUPS);
    if (loading) return "Loading...";
    if (error) return `Error! ${error}`;
    let options = [];
    data.GetAllGroups.forEach((item) => {
        options.push({
            label: item.specialty.cathedra.short_name + "-" + item.name,
            value: +item.id,
        });
    });
    return (
        <Select
            className="col-12"
            isClearable
            options={options}
            placeholder="Група"
            onChange={(e) => {
                handleChangeFilters("id_group", e ? +e.value : null);
            }}
        />
    );
}