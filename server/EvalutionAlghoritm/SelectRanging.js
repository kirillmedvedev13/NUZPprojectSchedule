
export default function SelectRanging(populations, size) {
  const N = populations.length;
  let p_populations = Array(N);
  let p_cur = 0;
  let sum_index = 0;
  populations.forEach((p, i) => sum_index += i + 1);
  for (let i = 0; i < N; i++) {
    p_populations[i] = (i + 1) / sum_index;
    p_cur = p_populations[i];
  }
  let new_populations = new Array(size);
  for (let i = 0; i < size; i++) {
    let left = 0;
    let right = N - 1;
    let middle;
    let rand = Math.random();
    while (left <= right) {
      middle = Math.floor((left + right) / 2);
      if ((right === N - 1 && (left === N - 2 || left === right)) || (left === 0 && (right === 1 || right === 0)))
        console.log(p_populations[middle], " ", p_populations[middle + 1])
      if (rand >= p_populations[middle] && rand <= p_populations[middle]) {
        new_populations[i] = JSON.parse(JSON.stringify(populations[middle]));
        break;
      }
      else if (rand < p_populations[middle]) {
        right = middle - 1;
      }
      else if (rand >= p_populations[middle + 1]) {
        left = middle + 1;
      }
    }
  }
  return new_populations;
}
