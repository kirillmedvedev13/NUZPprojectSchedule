import React from "react";
import Select from "react-select";

export default function SelectAlgoritm({ data, handleChangeState }) {

  let options = data.map((obj) => {
    return { value: obj.name, label: obj.label };
  });

  return (
    <Select
      className="col-12 my-2"
      options={options}
      placeholder="Алгоритм"
      onChange={(e) => {
        let params = JSON.parse(
          data.find((obj) => obj.name === e.value).params
        );
        handleChangeState("nameAlgorithm", e.value);
        handleChangeState("label", e.label);
        handleChangeState("params", params);

      }}
    />
  );
}
