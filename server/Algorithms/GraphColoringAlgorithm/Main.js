import { GraphQLInt } from "graphql";
import MessageType from "../../Schema/TypeDefs/MessageType.js";
import GetIdAudienceForClass from "../Service/GetIdAudienceForClass.js";
import AddVertex from "./AddVertex.js";
import GetDataFromDB from "../Service/GetDataFromDB.js";
import GraphColoring from "./GraphColoring.js";

export const RUN_SA = {
  type: MessageType,
  args: {
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { id_cathedra }) {
    let { max_day, max_pair, classes, recommended_schedules, audiences } =
      await GetDataFromDB(id_cathedra);
    let numberVertex = classes.length;
    let MainGraph = {};
    for (let clas of classes) {
      let id_audience = GetIdAudienceForClass(clas, audiences);
      AddVertex(MainGraph, clas, id_audience);
    }
    GraphColoring(MainGraph, numberVertex);
    console.log();
  },
};
