import { GraphQLID, GraphQLString, GraphQLObjectType } from "graphql";
import MessageType from "./MessageType.js";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    jwtToken: { type: GraphQLString },
    isAuth: { type: MessageType },
  }),
});

export default UserType;
