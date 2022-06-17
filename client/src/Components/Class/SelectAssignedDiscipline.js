import React from "react";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_ALL_ASSIGNED_DISCIPLINES } from "./queries";

export default function SelectAssignedDiscipline({
  item,
  handleChangeItem,
  handleChangeState,
}) {
  const { error, loading, data } = useQuery(GET_ALL_ASSIGNED_DISCIPLINES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllAssignedDisciplines.forEach((ad) => {
    options.push({
      label: `${ad.discipline.name} - ${ad.specialty.name} - ${ad.semester} семестр`,
      value: +ad.id,
    });
  });
  return (
    <Select
      required
      options={options}
      placeholder="Дисциплiна"
      defaultValue={
        item.id
          ? {
            label: `${item.assigned_discipline.discipline.name} - ${item.assigned_discipline.specialty.name} - ${item.assigned_discipline.semester} семестр`,
            value: +item.assigned_discipline.id,
          }
          : null
      }
      onChange={(e) => {
        handleChangeState("validatedSelectedGroup", true);
        handleChangeItem("assigned_discipline", data.GetAllAssignedDisciplines.find(ad => +ad.id === +e.value));
      }}
    />
  );
}
