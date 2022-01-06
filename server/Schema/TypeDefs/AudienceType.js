import { GraphQLID, GraphQLString, GraphQLObjectType, GraphQLInt } from "graphql";

const AudienceType = new GraphQLObjectType({
  name: "Audience",
  fields: () => ({
    id: { type: GraphQLID },
    audience_number: { type: GraphQLString },
    type: { type: GraphQLString },
    capacity: { type: GraphQLInt },
  }),
});

export default AudienceType;
