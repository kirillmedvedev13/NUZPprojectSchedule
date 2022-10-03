import { GraphQLID, GraphQLString, GraphQLObjectType } from "graphql";
import MessageType from "./MessageType.js";

export default new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    accessToken: { type: GraphQLString },
    isAuth: { type: MessageType },
  }),
});