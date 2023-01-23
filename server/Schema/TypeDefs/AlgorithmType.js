import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

export default new GraphQLObjectType({
  name: "Info",
  fields: () => ({
    name: { type: GraphQLString },
    label: { type: GraphQLString },
    params: { type: GraphQLString },
    results: { type: GraphQLString },
  }),
});
