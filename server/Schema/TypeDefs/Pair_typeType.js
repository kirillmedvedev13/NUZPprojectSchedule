import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

const Pair_typeType = new GraphQLObjectType({
  name: "Pair_type",
  fields: () => ({ id: { type: GraphQLID }, parity: { type: GraphQLString } }),
});
export default Pair_typeType;
