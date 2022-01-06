import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { GET_ALL_TEACHERS } from "../Queries/Teacher.js";
import { CREATE_TEACHER, DELETE_TEACHER, UPDATE_TEACHER}  from "../Mutations/Teacher.js";
import { GET_ALL_AUDIENCES } from "../Queries/Audience.js";
import { CREATE_AUDIENCE, DELETE_AUDIENCE, UPDATE_AUDIENCE } from "../Mutations/Audience.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    GetAllTeachers: GET_ALL_TEACHERS,
    GetAllAudiences: GET_ALL_AUDIENCES,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    CreateTeacher: CREATE_TEACHER,
    DeleteTeacher: DELETE_TEACHER,
    UpdateTeacher: UPDATE_TEACHER,
    CreateAudience: CREATE_AUDIENCE,
    DeleteAudience: DELETE_AUDIENCE,
    UpdateAudience: UPDATE_AUDIENCE,
  },
});

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
export default Schema;
