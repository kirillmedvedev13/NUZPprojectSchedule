import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import Assigned_disciplineType from "./Assigned_disciplineType.js"

export const DisciplineType = new GraphQLObjectType({
  name: "Discipline",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    assigned_disciplines: { type: new GraphQLList(Assigned_disciplineType) },
  }),
});
