import React from "react";
import Select from "react-select";

function GetLabelForResults(params, params_value) {
  let label = "";
  params = JSON.parse(params);
  params_value = JSON.parse(params_value);

  for (let i = 0; i < params.length - 1; i++) {
    label += `${params[i].short}: ${params_value[params[i].name]}, `;
  }
  if (params.length)
    label += `${params[params.length - 1].short}: ${
      params_value[params[params.length - 1].name]
    }, `;
  else label = "Без параметрів";
  return label;
}

export default function SelectAlgoritm({ handleChangeState, arrAlgorithm }) {
  let options = arrAlgorithm.map((obj) => {
    return { value: obj.name, label: obj.label };
  });

  return (
    <Select
      className="col-12 my-2"
      options={options}
      placeholder="Алгоритм"
      onChange={(e) => {
        let params = JSON.parse(
          arrAlgorithm.find((obj) => obj.name === e.value).params
        );
        let results_algorithms = [];
        arrAlgorithm.forEach((obj) => {
          if (obj.name === e.value) {
            obj.results_algorithms.forEach((res) => {
              results_algorithms.push({
                name: res.params_value,
                label: GetLabelForResults(obj.params, res.params_value),
                results: res.results,
              });
            });
          }
        });
        handleChangeState("nameAlgorithm", e.value);
        handleChangeState("label", e.label);
        handleChangeState("params", params);
        handleChangeState("results_algorithms", results_algorithms);
      }}
    />
  );
}
