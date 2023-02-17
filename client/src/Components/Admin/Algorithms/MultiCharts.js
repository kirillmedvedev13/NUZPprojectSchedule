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
    let data = obj.data.filter((point) => {
      console.log();
      return point.time >= from && point.time <= to;
    });
    return { name: obj.name, data };
  });

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

const getMaxRightTop = (initialData) => {
  let maxLen = 0;
  let maxTop = 0,
    maxRight = 0;
  initialData.forEach((obj) => {
    obj.data.forEach((point) => {
      if (maxTop < point.fitness) maxTop = point.fitness;
      if (maxRight < point.time) maxRight = point.time;
    });
  });
  return { maxRight, maxTop };
};
const initialState = (initialData) => {
  const { maxRight, maxTop } = getMaxRightTop(initialData);
  return {
    data: initialData,
    left: 0,
    right: maxRight,
    refAreaLeft: "",
    refAreaRight: "",
    topArr: maxTop,
    bottomArr: 0,
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
    const { maxRight, maxTop } = getMaxRightTop(data);
    this.setState(() => ({
      data: data,
      refAreaLeft: "",
      refAreaRight: "",
      left: 0,
      right: maxRight,
      topArr: maxTop,
      bottomArr: 0,
    }));
  };

  render() {
    const { data, left, right, refAreaLeft, refAreaRight, topArr, bottomArr } =
      this.state;
    const nameAlgorithm = this.props.nameAlgorithm;

    let colors = ["red", "green", "blue", "brown"];
    let initialData = GetDataForCharts(this.props.results);
    console.log(initialData);

    return (
      <>
        <div
          className="d-flex justify-content-end mx-5 my-2"
          id={`button ${nameAlgorithm} ${JSON.stringify(data)}`}
        >
          <Button onClick={this.zoomOut.bind(this)}>Zoom Out</Button>
        </div>
        <div
          className="d-flex justify-content-center mx-5"
          id={`form ${nameAlgorithm} ${JSON.stringify(data)}`}
        >
          <LineChart
            key={`LineChart ${nameAlgorithm} ${JSON.stringify(data)}`}
            width={0.8 * window.screen.width}
            height={0.5 * window.screen.height}
            onMouseDown={(e) => this.setState({ refAreaLeft: e.activeLabel })}
            onMouseMove={(e) =>
              this.state.refAreaLeft &&
              this.setState({ refAreaRight: e.activeLabel })
            }
            onMouseUp={this.zoom.bind(this, initialData)}
          >
            <CartesianGrid
              key={`grid ${nameAlgorithm} ${JSON.stringify(data)}`}
              strokeDasharray="3 3"
            />
            <XAxis
              key={`xaxis ${nameAlgorithm} ${JSON.stringify(data)}`}
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
                value={"Час, c"}
              />
            </XAxis>
            <YAxis
              key={`yaxis ${nameAlgorithm} ${JSON.stringify(data)}`}
              allowDataOverflow
              dataKey="fitness"
              type="number"
              domain={() => {
                let top = Number.MIN_VALUE;
                let bottom = Number.MAX_VALUE;
                if (topArr?.length) {
                  topArr.map((elem, i) => {
                    if (top < elem) top = elem;
                    if (bottom > bottomArr[i]) bottom = bottomArr[i];
                  });
                } else {
                  return [bottomArr, topArr];
                }
                return [bottom, top];
              }}
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
            <Tooltip id={`tooltip ${nameAlgorithm} ${JSON.stringify(data)}`} />

            <Legend
              align="center"
              key={`leg ${nameAlgorithm} ${JSON.stringify(data)}`}
            />
            {data.map((algorithm, i) =>
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
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                key={`ReferenceArea ${nameAlgorithm} ${JSON.stringify(data)}`}
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
              />
            ) : null}
          </LineChart>
        </div>
      </>
    );
  }
}
