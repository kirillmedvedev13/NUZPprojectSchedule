import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";

export default new GraphQLObjectType({
  name: "Message",
  fields: () => ({
    successful: { type: GraphQLBoolean },
    message: { type: GraphQLString },
    data: { type: GraphQLString }
  }),
});

