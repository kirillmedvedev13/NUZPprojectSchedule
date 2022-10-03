import {
  GraphQLID,
  GraphQLObjectType,
} from "graphql";
import AudienceType from "./AudienceType.js";
import ClassType from "./ClassType.js";

export default new GraphQLObjectType({
  name: "Recommended_audience",
  fields: () => ({
    id: { type: GraphQLID },
    audience: { type: AudienceType },
    class: { type: ClassType },
  }),
});
