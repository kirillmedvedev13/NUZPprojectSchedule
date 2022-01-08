import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { GET_ALL_TEACHERS } from "../Queries/Teacher.js";
import {
  CREATE_TEACHER,
  DELETE_TEACHER,
  UPDATE_TEACHER,
} from "../Mutations/Teacher.js";
import { GET_ALL_AUDIENCES } from "../Queries/Audience.js";
import {
  CREATE_AUDIENCE,
  DELETE_AUDIENCE,
  UPDATE_AUDIENCE,
  ADD_AUDIENCE_TO_CATHEDRA,
  DELETE_AUDIENCE_FROM_CATHEDRA,
} from "../Mutations/Audience.js";
import { GET_ALL_CATHEDRAS } from "../Queries/Cathedra.js";
import {
  CREATE_CATHEDRA,
  DELETE_CATHEDRA,
  UPDATE_CATHEDRA,
} from "../Mutations/Cathedra.js";
import { GET_ALL_SPECIALTY } from "../Queries/Specialty.js";
import {
  CREATE_SPECIALTY,
  DELETE_SPECIALTY,
  UPDATE_SPECIALTY,
} from "../Mutations/Specialty.js";
import { GET_WEEKS_DAY } from "../Queries/Day_week.js";
import { GET_ALL_TYPE_CLASSES } from "../Queries/Type_class.js";
import { GET_ALL_GROUPS } from "../Queries/Group.js";
import {
  CREATE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
} from "../Mutations/Group.js";
import { GET_ALL_DISCIPLINES } from "../Queries/Discipline.js";
import {
  CREATE_DISCIPLINE,
  UPDATE_DISCIPLINE,
  DELETE_DISCIPLINE,
  ADD_DISCIPLINE_TO_SPECIALTY,
  DELETE_DISCIPLINE_FROM_SPECIALTY,
} from "../Mutations/Discipline.js";
import { CREATE_CLASS } from "../Mutations/Class.js";
import { GET_ALL_CLASSES } from "../Queries/Class.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    GetAllTeachers: GET_ALL_TEACHERS,
    GetAllAudiences: GET_ALL_AUDIENCES,
    GetAllCathedras: GET_ALL_CATHEDRAS,
    GetAllSpecialties: GET_ALL_SPECIALTY,
    GetWeeksDay: GET_WEEKS_DAY,
    GetAllTypeClasses: GET_ALL_TYPE_CLASSES,
    GetAllGroups: GET_ALL_GROUPS,
    GetAllDisciplines: GET_ALL_DISCIPLINES,
    GetAllClasses: GET_ALL_CLASSES,
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
    CreateCathedra: CREATE_CATHEDRA,
    DeleteCathedra: DELETE_CATHEDRA,
    UpdateCathedra: UPDATE_CATHEDRA,
    CreateSpecialty: CREATE_SPECIALTY,
    CreateGroup: CREATE_GROUP,
    UpdateGroup: UPDATE_GROUP,
    DeleteGroup: DELETE_GROUP,
    DeleteSpecialty: DELETE_SPECIALTY,
    UpdateSpecialty: UPDATE_SPECIALTY,
    CreateDiscipline: CREATE_DISCIPLINE,
    UpdateDiscipline: UPDATE_DISCIPLINE,
    DeleteDiscipline: DELETE_DISCIPLINE,
    AddDisciplineToSpecialty: ADD_DISCIPLINE_TO_SPECIALTY,
    AddAudienceToCathedra: ADD_AUDIENCE_TO_CATHEDRA,
    DeleteDisciplineFromSpecialty: DELETE_DISCIPLINE_FROM_SPECIALTY,
    DeleteAudienceFromCathedra: DELETE_AUDIENCE_FROM_CATHEDRA,
    CreateClass: CREATE_CLASS,
  },
});

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
export default Schema;
