import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import { SpecialtyType } from "./SpecialtyType.js";

export const DisciplineType = new GraphQLObjectType({
  name: "Discipline",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    specialties: { type: new GraphQLList(SpecialtyType) },
  }),
});
