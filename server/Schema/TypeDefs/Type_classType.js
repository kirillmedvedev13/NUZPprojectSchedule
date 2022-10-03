import { GraphQLID, GraphQLString, GraphQLObjectType } from "graphql";

export default new GraphQLObjectType({
  name: "Type_class",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});
