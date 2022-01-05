import { GraphQLID, GraphQLString, GraphQLObjectType } from "graphql";

const TeacherType = new GraphQLObjectType({
  name: "Teacher",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    patronymic: { type: GraphQLString },
  }),
});

export default TeacherType;
