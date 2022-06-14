import React from "react";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_ALL_DISCIPLINES } from "../Discipline/queries";

export default function SelectDiscipline({
  item,
  handleChangeItem,
  handleChangeState,
}) {
  const { error, loading, data } = useQuery(GET_ALL_DISCIPLINES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllDisciplines.forEach((discipline) => {
    discipline.assigned_disciplines.forEach((assigned_discipline) => {
      options.push({
        label: `${discipline.name} - ${assigned_discipline.specialty.name} - ${assigned_discipline.semester} семестр`,
        value: +assigned_discipline.id,
      });
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
        handleChangeItem("assigned_discipline", { id: +e.value });
      }}
    />
  );
}
