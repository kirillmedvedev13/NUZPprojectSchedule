import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { SpecialtyType } from "./SpecialtyType.js";

export const DisciplineType = new GraphQLObjectType({
  name: "Discipline",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    specialty: { type: SpecialtyType },
  }),
});
