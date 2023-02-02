import React from "react";
import { Button, Container } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  Label,
  Legend,
} from "recharts";

function getAxisYDomain(from, to, ref, offset, initialData) {
  const refData = initialData.map((obj) => {
    return { name: obj.name, data: obj.data.slice(from - 1, to) };
  });

  debugger;
  let topArr = [];
  let bottomArr = [];
  refData.forEach((obj) => {
    let top = Number.MIN_VALUE;
    let bottom = Number.MAX_VALUE;
    obj.data.forEach((elem) => {
      if (elem[ref] > top) top = elem[ref];
      if (elem[ref] < bottom) bottom = elem[ref];
    });
    topArr.push((top | 0) + offset);
    bottomArr.push((bottom | 0) - offset);
  });
  console.log(topArr);
  return { topArr, bottomArr };
}

function GetDataForCharts(results) {
  const dataForCharts = [];
  for (let algorithm of results) {
    let data = {};
    data["name"] = algorithm.label;
    let arr = [];
    for (let elem of JSON.parse(algorithm.results)) {
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

const initialState = (initialData) => {
  return {
    data: initialData,
    left: "dataMin",
    right: "dataMax",
    refAreaLeft: "",
    refAreaRight: "",
    topArr: "dataMax+1",
    bottomArr: "dataMin-1",
    animation: true,
  };
};

export default class MultiCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState(GetDataForCharts(this.props.results));
  }

  zoom = (initialData) => {
    let { refAreaLeft, refAreaRight } = this.state;
    const { data } = this.state;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      this.setState(() => ({
        refAreaLeft: "",
        refAreaRight: "",
      }));
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    // yAxis domain
    const { topArr, bottomArr } = getAxisYDomain(
      refAreaLeft,
      refAreaRight,
      "fitness",
      1,
      initialData
    );

    this.setState(() => ({
      refAreaLeft: "",
      refAreaRight: "",
      data: data,
      left: refAreaLeft,
      right: refAreaRight,
      bottomArr,
      topArr,
    }));
  };

  zoomOut = () => {
    const { data } = this.state;
    console.log(data);
    this.setState(() => ({
      data: data,
      refAreaLeft: "",
      refAreaRight: "",
      left: "dataMin",
      right: "dataMax",
      topArr: "dataMax+1",
      bottomArr: "dataMin",
    }));
  };

  render() {
    const { data, left, right, refAreaLeft, refAreaRight, topArr, bottomArr } =
      this.state;
    let colors = ["red", "green", "blue", "brown"];
    let initialData = GetDataForCharts(this.props.results);
    return (
      <>
        <div className="d-flex justify-content-end my-2">
          <Button onClick={this.zoomOut.bind(this)}>Zoom Out</Button>
        </div>
        <Container>
          <LineChart
            width={0.8 * window.screen.width}
            height={0.5 * window.screen.height}
            onMouseDown={(e) => this.setState({ refAreaLeft: e.activeLabel })}
            onMouseMove={(e) =>
              this.state.refAreaLeft &&
              this.setState({ refAreaRight: e.activeLabel })
            }
            onMouseUp={this.zoom.bind(this, initialData)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              allowDataOverflow
              dataKey="time"
              type="number"
              allowDuplicatedCategory={false}
              domain={[left, right]}
            >
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
            <YAxis
              allowDataOverflow
              dataKey="fitness"
              type="number"
              domain={[left, right]}
            >
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
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                yAxisId="1"
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
              />
            ) : null}
            <Legend align="center" />
            {this.state.data.map((algorithm, i) =>
              algorithm.data.length ? (
                <Line
                  dot={false}
                  strokeWidth={3}
                  stroke={
                    i < colors.length ? colors[i] : colors[i % colors.length]
                  }
                  dataKey="fitness"
                  data={algorithm.data}
                  name={algorithm.name}
                  key={algorithm.name}
                  animationDuration={300}
                />
              ) : null
            )}
          </LineChart>
        </Container>
      </>
    );
  }
}
