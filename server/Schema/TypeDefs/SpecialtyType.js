import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";
import CathedraType from "./CathedraType.js";

export default new GraphQLObjectType({
  name: "Specialty",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    code: { type: GraphQLInt },
    cathedra: { type: CathedraType },
  }),
});
