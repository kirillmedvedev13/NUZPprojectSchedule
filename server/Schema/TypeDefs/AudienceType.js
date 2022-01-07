import { GraphQLID, GraphQLString, GraphQLObjectType, GraphQLInt, GraphQLList } from "graphql";
import CathedraType from "./CathedraType.js";

const AudienceType = new GraphQLObjectType({
  name: "Audience",
  fields: () => ({
    id: { type: GraphQLID },
    audience_number: { type: GraphQLString },
    type: { type: GraphQLString },
    capacity: { type: GraphQLInt },
    cathedra: {type: new GraphQLList(CathedraType)}
  }),
});

export default AudienceType;
