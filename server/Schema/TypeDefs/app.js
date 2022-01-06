import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { GET_ALL_TEACHERS } from "../Queries/Teacher.js";
import {
  CREATE_TEACHER,
  DELETE_TEACHER,
  UPDATE_TEACHER,
} from "../Mutations/Teacher.js";
import { GET_ALL_CATHEDRAS } from "../Queries/Cathedra.js";
import {
  CREATE_CATHEDRA,
  DELETE_CATHEDRA,
  UPDATE_CATHEDRA,
} from "../Mutations/Cathedra.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    GetAllTeachers: GET_ALL_TEACHERS,
    GetAllCathedras: GET_ALL_CATHEDRAS,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    CreateTeacher: CREATE_TEACHER,
    DeleteTeacher: DELETE_TEACHER,
    UpdateTeacher: UPDATE_TEACHER,
    CreateCathedra: CREATE_CATHEDRA,
    DeleteCathedra: DELETE_CATHEDRA,
    UpdateCathedra: UPDATE_CATHEDRA,
  },
});

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
export default Schema;
