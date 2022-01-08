import { GraphQLID, GraphQLObjectType } from "graphql";
import { DisciplineType } from "./DisciplineType.js";
import { SpecialtyType } from "./SpecialtyType.js";

const Assigned_disciplineType = new GraphQLObjectType({
  name: "Assigned_discipline",
  fields: () => ({
    id: { type: GraphQLID },
    discipline: { type: DisciplineType },
    specialty: { type: SpecialtyType },
  }),
});

export default Assigned_disciplineType;
