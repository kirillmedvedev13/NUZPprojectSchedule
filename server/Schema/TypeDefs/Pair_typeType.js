import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

const Pair_typeType = new GraphQLObjectType({
  name: "Day_week",
  fields: () => ({ id: { type: GraphQLID }, parity: { type: GraphQLString } }),
});
export default Pair_typeType;
