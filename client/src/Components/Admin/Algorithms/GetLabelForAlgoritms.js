export default function GetLabelForAlgoritms(value = null) {
  let options = [
    { label: "Алгоритм простого перебору", value: "simple_algorithm" },
    { value: "simulated_annealing", label: "Алгоритм імітації отжига" },
    { value: "evolution_algorithm", label: "Генетичний алгоритм" },
  ];
  if (!value) return options;
  let object = options.find((obj) => obj.value === value);
  return object;
}
