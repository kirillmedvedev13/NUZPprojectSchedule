import { GraphQLID, GraphQLObjectType, GraphQLInt } from "graphql";
import DisciplineType from "./DisciplineType.js";
import SpecialtyType from "./SpecialtyType.js";

export default new GraphQLObjectType({
  name: "Assigned_discipline",
  fields: () => ({
    id: { type: GraphQLID },
    discipline: { type: DisciplineType },
    specialty: { type: SpecialtyType },
    semester: { type: GraphQLInt },
  }),
});
