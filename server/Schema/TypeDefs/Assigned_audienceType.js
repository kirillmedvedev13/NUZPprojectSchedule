import { GraphQLID,  GraphQLObjectType  } from "graphql";
import AudienceType from "./AudienceType.js";
import CathedraType from "./CathedraType.js";

const Assigned_audienceType = new GraphQLObjectType({
  name: "Assigned_audience",
  fields: () => ({
    id: { type: GraphQLID },
    id_audience: { type: GraphQLID },
    id_cathedra: { type: GraphQLID },
  }),
});

export default Assigned_audienceType;
