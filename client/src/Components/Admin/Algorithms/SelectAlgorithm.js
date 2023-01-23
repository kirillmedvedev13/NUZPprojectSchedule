import React from "react";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_INFO } from "../queries";
import GetLabelForAlgoritms from "./GetLabelForAlgoritms";

export default function SelectAlgoritm({ data, handleChangeState }) {
  const { error, loading, data } = useQuery(GET_INFO);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  let options = data.GetAllAlgorithm.map((obj) => {
    return { value: obj.name, label: obj.label };
  });

  return (
    <Select
      className="col-12 my-2"
      options={options}
      placeholder="Алгоритм"
      defaultValue={options[0]}
      onChange={(e) => {
        let params = JSON.parse(
          data.findOne((obj) => obj.name === e.value).params
        );
        let results = data.map((obj) => {
          return obj.results;
        });
        handleChangeState("nameAlgorithm", e.value);
        handleChangeState("params", params);
        handleChangeState("results", results);
      }}
    />
  );
}
