import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import CathedraType from "./CathedraType.js";

export const SpecialtyType = new GraphQLObjectType({
  name: "Specialty",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    cathedra: { type: CathedraType },
  }),
});
