export default function GraphColoring(graph, numberVertex) {
  //исп алгоритм жадной раскраски

  let availableColors = [];
  let resultColoring = {};
  for (let vertex in graph) {
    resultColoring[+vertex] = -1;
  }
  for (let i = 0; i < numberVertex; i++) availableColors.push(true);
  for (let vertex in graph) {
    //если вершина имеет цвет пропускаем
    if (resultColoring[+vertex] !== -1) continue;
    //проходим по смежным вершинам и устанавливаем их цвета как недоступные
    graph[+vertex].vertices.forEach((v) => {
      if (resultColoring[v] != -1) availableColors[resultColoring[v]] = false;
    });
    //для текущей вершины ищем первый доступный цвет
    for (let i = 0; i < availableColors.length; i++) {
      if (availableColors[i]) {
        resultColoring[+vertex] = i;
        break;
      }
    }
    //обнуляем цвета
    for (let i = 0; i < availableColors.length; i++) {
      if (!availableColors[i]) availableColors[i] = true;
    }
  }
  return resultColoring;
}
