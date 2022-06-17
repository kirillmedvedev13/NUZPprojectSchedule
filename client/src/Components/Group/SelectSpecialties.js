import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_SPECIALTIES } from "../Specialty/queries";
import Select from "react-select";
export default function SelectSpecialties({
  item,
  handleChangeItem,
  handleChangeState,
}) {
  const { error, loading, data } = useQuery(GET_ALL_SPECIALTIES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllSpecialties.forEach((selectitem) => {
    options.push({ label: selectitem.name, value: +selectitem.id });
  });
  return (
    <Select
      required
      options={options}
      placeholder="Спеціальність"
      defaultValue={
        item.id
          ? { label: item.specialty.name, value: +item.specialty.id }
          : null
      }
      onChange={(e) => {
        handleChangeItem("specialty", data.GetAllSpecialties.find(s => +s.id === +e.value));
        handleChangeState("validatedSpecialty", true);
      }}
    />
  );
}
