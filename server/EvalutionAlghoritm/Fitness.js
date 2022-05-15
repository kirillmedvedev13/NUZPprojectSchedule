import { parentPort, workerData } from "worker_threads";
import fitness from "./FitnessFunction.js";

parentPort.on("message", (param) => {
  const { index, schedule } = JSON.parse(param);
  const value = fitness(schedule, workerData);
  const res = {
    value,
    index,
  };
  parentPort.postMessage(res);
});
