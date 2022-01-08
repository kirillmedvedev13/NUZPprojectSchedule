import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from "graphql";
import AudienceType from "./AudienceType.js";
import ClassType from "./ClassType.js";

export const Recommended_audienceType = new GraphQLObjectType({
  name: "Recommended_audience",
  fields: () => ({
    id: { type: GraphQLID },
    audience: { type: AudienceType },
    class: { type: ClassType },
  }),
});
