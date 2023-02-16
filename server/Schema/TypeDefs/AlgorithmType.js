import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import Results_algorithmType from "../TypeDefs/Results_algorithmType.js";

export default new GraphQLObjectType({
  name: "Algorithm",
  fields: () => ({
    name: { type: GraphQLString },
    label: { type: GraphQLString },
    params: { type: GraphQLString },
    results_algorithms: { type: new GraphQLList(Results_algorithmType) },
  }),
});
