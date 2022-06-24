import { useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_ALL_AUDIENCES } from "../Audience/queries";

export default function SelectAudience({ handleChangeFilters }) {
    const { error, loading, data } = useQuery(GET_ALL_AUDIENCES);
    if (loading) return "Loading...";
    if (error) return `Error! ${error}`;
    let options = [];
    data.GetAllAudiences.forEach((item) => {
        options.push({
            label: item.name,
            value: Number(item.id),
        });
    });
    return (
        <Select
            className="col-12"
            isClearable
            options={options}
            placeholder="Аудиторія"
            onChange={(e) => {
                handleChangeFilters("id_audience", e ? Number(e.value) : null);
            }}
        />
    );
}