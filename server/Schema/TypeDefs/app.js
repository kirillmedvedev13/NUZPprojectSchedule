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
import { GET_ALL_CLASSES } from "../Queries/Class.js";
import {
  GET_ALL_SCHEDULE_GROUPS,
  GET_ALL_SCHEDULE_AUDIENCES,
  GET_ALL_SCHEDULE_TEACHERS,
} from "../Queries/Schedule.js";
import {
  CREATE_CLASS,
  UPDATE_CLASS,
  DELETE_CLASS,
  ADD_GROUP_TO_CLASS,
  DELETE_GROUP_FROM_CLASS,
  ADD_RECOMMENDED_AUDIENCE_TO_CLASS,
  DELETE_RECOMMENDED_AUDIENCE_FROM_CLASS,
  ADD_TEACHER_TO_CLASS,
  DELETE_TEACHER_FROM_CLASS,
} from "../Mutations/Class.js";
import { LOGIN_USER, LOGOUT_USER, RELOGIN_USER } from "../Mutations/User.js";
import { SET_CLASSES } from "../Mutations/Admin.js";
import { DELETE_ALL_DATA } from "../Mutations/Admin.js";
import { RUN_EA } from "../../EvalutionAlghoritm/Main.js";
import { GET_INFO } from "../Queries/Info.js";
import { UPDATE_INFO } from "../Mutations/Info.js";
import { GET_FITNESS } from "../Queries/Fitness.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    GetAllTeachers: GET_ALL_TEACHERS,
    GetAllAudiences: GET_ALL_AUDIENCES,
    GetAllCathedras: GET_ALL_CATHEDRAS,
    GetAllSpecialties: GET_ALL_SPECIALTY,
    GetAllTypeClasses: GET_ALL_TYPE_CLASSES,
    GetAllGroups: GET_ALL_GROUPS,
    GetAllDisciplines: GET_ALL_DISCIPLINES,
    GetAllClasses: GET_ALL_CLASSES,
    GetAllScheduleGroups: GET_ALL_SCHEDULE_GROUPS,
    GetAllScheduleAudiences: GET_ALL_SCHEDULE_AUDIENCES,
    GetAllScheduleTeachers: GET_ALL_SCHEDULE_TEACHERS,
    GetInfo: GET_INFO,
    GetFitness: GET_FITNESS,
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
    UpdateClass: UPDATE_CLASS,
    DeleteClass: DELETE_CLASS,
    AddTeacherToClass: ADD_TEACHER_TO_CLASS,
    AddRecAudienceToClass: ADD_RECOMMENDED_AUDIENCE_TO_CLASS,
    AddGroupToClass: ADD_GROUP_TO_CLASS,
    DeleteTeacherFromClass: DELETE_TEACHER_FROM_CLASS,
    DeleteRecAudienceFromClass: DELETE_RECOMMENDED_AUDIENCE_FROM_CLASS,
    DeleteGroupFromClass: DELETE_GROUP_FROM_CLASS,
    LoginUser: LOGIN_USER,
    LogoutUser: LOGOUT_USER,
    ReloginUser: RELOGIN_USER,
    SetClasses: SET_CLASSES,
    DeleteAllData: DELETE_ALL_DATA,
    UpdateInfo: UPDATE_INFO,
    RunEA: RUN_EA,
  },
});

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
export default Schema;
