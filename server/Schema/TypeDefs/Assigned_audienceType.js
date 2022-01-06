import { GraphQLID,  GraphQLObjectType  } from "graphql";

const Assigned_audienceType = new GraphQLObjectType({
  name: "Assigned_audience",
  fields: () => ({
    id: { type: GraphQLID },
    audienceId: { type: GraphQLID },
    cathedraId: { type: GraphQLID },
  }),
});

export default Assigned_audienceType;
