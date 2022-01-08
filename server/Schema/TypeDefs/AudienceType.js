import { GraphQLID, GraphQLString, GraphQLObjectType, GraphQLInt, GraphQLList } from "graphql";
import Type_classType from "./Type_classType.js";

const AudienceType = new GraphQLObjectType({
  name: "Audience",
  fields: () => ({
    id: { type: GraphQLID },
    type_class: { type: Type_classType },
    name: { type: GraphQLString },
    capacity: { type: GraphQLInt },
  }),
});

export default AudienceType;
