import React from "react";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_INFO } from "../queries";
import GetLabelForAlgoritms from "./GetLabelForAlgoritms";

export default function SelectAlgoritm({ handleChangeState }) {
  const { error, loading, data } = useQuery(GET_INFO);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = GetLabelForAlgoritms();
  return (
    <Select
      className="col-12 my-2"
      options={options}
      placeholder="Алгоритм"
      defaultValue={options[0]}
      onChange={(e) => {
        handleChangeState("algorithm", e.value);
      }}
    />
  );
}
