import { GraphQLID, GraphQLObjectType, GraphQLInt } from "graphql";
import { DisciplineType } from "./DisciplineType.js";
import { SpecialtyType } from "./SpecialtyType.js";

const Assigned_disciplineType = new GraphQLObjectType({
  name: "Assigned_discipline",
  fields: () => ({
    id: { type: GraphQLID },
    discipline: { type: DisciplineType },
    specialty: { type: SpecialtyType },
    semester: { type: GraphQLInt },
  }),
});
export const Assigned_disciplineInput = new GraphQLObjectType({
  name: "Assigned_discipline",
  fields: () => ({
    specialty: { type: SpecialtyType },
    semester: { type: GraphQLInt },
  }),
});

export default Assigned_disciplineType;
