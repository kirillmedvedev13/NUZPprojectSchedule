import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export default new GraphQLObjectType({
  name: "Results_algorithm",
  fields: () => ({
    id: { type: GraphQLID },
    params_value: { type: GraphQLString },
    name_algorithm: { type: GraphQLString },
    results: { type: GraphQLString },
  }),
});
