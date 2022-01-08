import { GraphQLID, GraphQLString, GraphQLObjectType } from "graphql";

const Type_classType = new GraphQLObjectType({
  name: "Type_class",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});

export default Type_classType;
