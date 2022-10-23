export default function AddVertex(graph, clas, id_audience) {
  //каждая вершина графа это одно занятие
  //вершина содержит обьект занятие, аудитория и список смежных вершин
  if (!graph[clas.id]) graph[clas.id] = { clas, id_audience, vertices: [] };
  for (let vertex in graph) {
    if (+vertex === +clas.id) continue;
    if (IsEdge(graph[+vertex], graph[+clas.id]))
      //ребро добавляется между занятиями если пересикается аудитория или хотя бы один учитель или одна группа
      AddEdge(graph, +vertex, +clas.id);
  }
}

function AddEdge(graph, vertex1, vertex2) {
  if (!graph[vertex1].vertices.includes(vertex2))
    graph[vertex1].vertices.push(vertex2);
  if (!graph[vertex2].vertices.includes(vertex1))
    graph[vertex2].vertices.push(vertex1);
}

function IsEdge(vertex1, vertex2) {
  if (vertex1.id_audience === vertex2.id_audience) return true;
  for (let at1 of vertex1.clas.assigned_teachers) {
    let res = vertex2.clas.assigned_teachers.find(
      (at2) => at2.id_teacher === at1.id_teacher
    );
    if (res) return true;
  }
  for (let ag1 of vertex1.clas.assigned_groups) {
    let res = vertex2.clas.assigned_groups.find(
      (ag2) => ag2.id_group === ag1.id_group
    );
    if (res) return true;
  }
}
