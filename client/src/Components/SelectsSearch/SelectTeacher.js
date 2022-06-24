import { GET_ALL_TEACHERS } from "../Teacher/queries";
import { useQuery } from "@apollo/client";
import Select from "react-select";

export default function SelectTeacher({ handleChangeFilters }) {
    const { error, loading, data } = useQuery(GET_ALL_TEACHERS);
    if (loading) return "Loading...";
    if (error) return `Error! ${error}`;
    let options = [];
    data.GetAllTeachers.forEach((item) => {
        options.push({
            label: item.surname + " " + item.name,
            value: +item.id,
        });
    });
    return (
        <Select
            className="col-12"
            isClearable
            options={options}
            placeholder="Викладач"
            onChange={(e) => {
                handleChangeFilters("id_teacher", e ? +e.value : null);
            }}
        />
    );
}