import { parentPort, workerData } from "worker_threads";
import fitness from "./FitnessFunction.js";

parentPort.on("message", (param) => {
  const { schedule } = JSON.parse(param);
  const value = fitness(schedule, workerData);
  parentPort.postMessage(value);
});
