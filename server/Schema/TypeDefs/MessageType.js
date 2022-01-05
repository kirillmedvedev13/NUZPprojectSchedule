import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";

const MessageType = new GraphQLObjectType({
  name: "Message",
  fields: () => ({
    successful: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  }),
});

export default MessageType;
