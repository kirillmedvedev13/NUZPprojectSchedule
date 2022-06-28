import React from "react";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_ALL_CATHEDRAS } from "../Cathedra/queries";

export default function SelectCathedra({ setCathedra, id_cathedra }) {
  const { error, loading, data } = useQuery(GET_ALL_CATHEDRAS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllCathedras.forEach((item) => {
    options.push({ label: item.name, value: +item.id });
  });
  return (
    <Select
      className="col-12 my-2"
      isClearable
      options={options}
      placeholder="Кафедра"
      defaultValue={() => {
        let cathedra = data.GetAllCathedras.find(item => +item.id === +id_cathedra)
        if (cathedra)
          return { label: cathedra.name, value: + cathedra.id }
      }}
      onChange={(e) => {
        setCathedra(e ? +e.value : null);
      }}
    />
  );
}
