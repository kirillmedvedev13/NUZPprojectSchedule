import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_CATHEDRAS } from "../Cathedra/queries";
import Select from "react-select";
export default function SelectCathedras({
  item,
  handleChangeItem,
  handleChangeState,
}) {
  const { error, loading, data } = useQuery(GET_ALL_CATHEDRAS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllCathedras.forEach((selectitem) => {
    options.push({ label: selectitem.name, value: +selectitem.id });
  });
  return (
    <Select
      required
      options={options}
      placeholder="Кафедра"
      defaultValue={
        item.id ? { label: item.cathedra.name, value: +item.cathedra.id } : null
      }
      onChange={(e) => {
        handleChangeState("validationCathedra", true);
        handleChangeItem("cathedra", data.GetAllCathedras.find(c => +c.id === +e.value));
      }}
    />
  );
}
