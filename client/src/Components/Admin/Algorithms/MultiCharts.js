import GetLabelForAlgoritms from "./GetLabelForAlgoritms";
import { Container } from "react-bootstrap";
import React from "react";
import {
  LineChart,
  Label,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function GetDataForCharts(results) {
  const dataForCharts = [];
  let dataFromInfo = JSON.parse(results);
  for (let algorithm in dataFromInfo) {
    let data = {};
    data["name"] = GetLabelForAlgoritms(algorithm).label;
    let arr = [];
    for (let elem of dataFromInfo[algorithm]) {
      let temp = {};
      temp["time"] = +elem[0] / 1000;
      temp["fitness"] = elem[1];
      arr.push(temp);
    }
    data["data"] = arr;
    dataForCharts.push(data);
  }

  return dataForCharts;
}
export default class MultiCharts extends React.Component {
  render() {
    let { results } = this.props;
    let colors = ["red", "green", "blue"];
    let dataForCharts = GetDataForCharts(results);
    return (
      <LineChart width={500} height={300}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" type="number" allowDuplicatedCategory={false}>
          <Label
            style={{
              textAnchor: "middle",
              fontSize: "100%",
            }}
            offset={-5}
            position="insideBottom"
            value={"Час"}
          />
        </XAxis>
        <YAxis dataKey="fitness" type="number">
          <Label
            style={{
              textAnchor: "middle",
              fontSize: "100%",
            }}
            angle="-90"
            position="insideLeft"
            value={"Фітнес"}
          />
        </YAxis>
        <Tooltip />
        <Legend align="center" />
        {dataForCharts.map((algorithm, i) => (
          <Line
            dot={false}
            strokeWidth={3}
            stroke={i < colors.length ? colors[i] : colors[i % colors.length]}
            dataKey="fitness"
            data={algorithm.data}
            name={algorithm.name}
            key={algorithm.name}
          />
        ))}
      </LineChart>
    );
  }
}
