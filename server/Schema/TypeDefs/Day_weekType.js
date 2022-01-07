import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

const Day_weekType = new GraphQLObjectType({
  name: "Day_week",
  fields: () => ({ id: { type: GraphQLID }, name: { type: GraphQLString } }),
});
export default Day_weekType;
