import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export default new GraphQLObjectType({
  name: "Cathedra",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    short_name: { type: GraphQLString },
  }),
})
