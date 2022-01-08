import { GraphQLID, GraphQLInt, GraphQLObjectType } from "graphql";
import AudienceType from "./AudienceType.js";
import CathedraType from "./CathedraType.js";

const Assigned_audienceType = new GraphQLObjectType({
  name: "Assigned_audience",
  fields: () => ({
    id: { type: GraphQLID },
    audience: { type: AudienceType },
    cathedra: { type: CathedraType },
  }),
});

export default Assigned_audienceType;
