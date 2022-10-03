import { GraphQLID, GraphQLInt, GraphQLObjectType } from "graphql";
import AudienceType from "./AudienceType.js";
import CathedraType from "./CathedraType.js";

export default new GraphQLObjectType({
  name: "Assigned_audience",
  fields: () => ({
    id: { type: GraphQLID },
    audience: { type: AudienceType },
    cathedra: { type: CathedraType },
  }),
});

