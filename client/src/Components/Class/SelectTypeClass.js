import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_TYPE_CLASSES } from "./queries";
import Select from "react-select";

export default function SelectTypeClass({
  item,
  handleChangeItem,
  handleChangeState,
}) {
  const { error, loading, data } = useQuery(GET_ALL_TYPE_CLASSES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = [];
  data.GetAllTypeClasses.forEach((selectitem) => {
    options.push({ label: selectitem.name, value: +selectitem.id });
  });
  return (
    <Select
      required
      options={options}
      placeholder="Тип аудиторії"
      defaultValue={
        item.id
          ? { label: item.type_class.name, value: +item.type_class.id }
          : null
      }
      onChange={(e) => {
        handleChangeState("validatedTypeClass", true);
        handleChangeItem("type_class", { id: +e.value });
        e.value = item.type_class.id;
      }}
    />
  );
}
