import { parentPort } from "worker_threads"

parentPort.on("message", (param) => {
  const res = SelectRanging(param);
  parentPort.postMessage(res);
})

function SelectRanging({ p_populations }) {
  let left = 0;
  let right = p_populations.length;
  let middle;
  let rand = Math.random();
  while (left <= right) {
    middle = Math.floor((left + right) / 2);
    if (rand >= p_populations[middle] && rand < p_populations[middle + 1]) {
      break;
    }
    else if (rand < p_populations[middle]) {
      right = middle - 1;
    }
    else if (rand >= p_populations[middle + 1]) {
      left = middle + 1;
    }
  }
  return middle;
}
