import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { GetAllTeachers } from "./Queries/Teacher.js";
import { CreateTeacher, DeleteTeacher, UpdateTeacher} from "./Mutations/Teacher.js";
import { GetAllAudiences } from "./Queries/Audience.js";
import { CreateAudience, DeleteAudience, UpdateAudience, AddCathedraToAudience, DeleteCathedraFromAudience } 
from "./Mutations/Audience.js";
import { GetAllCathedras } from "./Queries/Cathedra.js";
import { CreateCathedra, DeleteCathedra, UpdateCathedra} from "./Mutations/Cathedra.js";
import { GetAllSpecialties } from "./Queries/Specialty.js";
import { CreateSpecialty, DeleteSpecialty, UpdateSpecialty} from "./Mutations/Specialty.js";
import { GetAllTypeClasses } from "./Queries/Type_class.js";
import { GetAllGroups } from "./Queries/Group.js";
import { CreateGroup, UpdateGroup, DeleteGroup } from "./Mutations/Group.js";
import { GetAllDisciplines } from "./Queries/Discipline.js";
import { CreateDiscipline, UpdateDiscipline, DeleteDiscipline, AddDisciplineToSpecialty, DeleteDisciplineFromSpecialty} 
from "./Mutations/Discipline.js";
import { GetAllClasses } from "./Queries/Class.js";
import { GetAllScheduleGroups, GetAllScheduleAudiences, GetAllScheduleTeachers, GetAllSchedules} from "./Queries/Schedule.js";
import {
  CreateClass,
  UpdateClass,
  DeleteClass,
  AddGroupToClass,
  DeleteGroupFromClass,
  AddRecAudienceToClass,
  AddRecScheduleToClass,
  DeleteRecAudienceFromClass,
  DeleteRecScheduleFromClass,
  AddTeacherToClass,
  DeleteTeacherFromClass,
} from "./Mutations/Class.js";
import { LoginUser, LogoutUser, ReloginUser } from "./Mutations/User.js";
import { SetClasses } from "./Mutations/Admin.js";
import { DeleteAllData } from "./Mutations/Admin.js";
import { GetInfo } from "./Queries/Info.js";
import { UpdateInfo } from "./Mutations/Info.js";
import { CalcFitness } from "./Mutations/Fitness.js";
import { GetAllAssignedDisciplines } from "./Queries/Assigned_Discipline.js";
import { GetAllAlgorithm } from "./Queries/Algorithm.js";
import { RunAlgorithm, UpdateAlgorithm } from "./Mutations/Algorithm.js";
import { DeleteResults } from "./Mutations/Results_algorithm.js";

const RootQuery = new GraphQLObjectType({
  name: "Queries",
  fields: {
    GetAllTeachers,
    GetAllAudiences,
    GetAllCathedras,
    GetAllSpecialties,
    GetAllTypeClasses,
    GetAllGroups,
    GetAllDisciplines,
    GetAllClasses,
    GetAllScheduleGroups,
    GetAllScheduleAudiences,
    GetAllScheduleTeachers,
    GetAllSchedules,
    GetAllAssignedDisciplines,
    GetInfo,
    GetAllAlgorithm,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    CreateTeacher,
    DeleteTeacher,
    UpdateTeacher,

    CreateAudience,
    DeleteAudience,
    UpdateAudience,
    AddCathedraToAudience,
    DeleteCathedraFromAudience,

    CreateCathedra,
    DeleteCathedra,
    UpdateCathedra,

    CreateGroup,
    UpdateGroup,
    DeleteGroup,

    CreateSpecialty,
    DeleteSpecialty,
    UpdateSpecialty,

    CreateDiscipline,
    UpdateDiscipline,
    DeleteDiscipline,
    AddDisciplineToSpecialty,
    DeleteDisciplineFromSpecialty,

    CreateClass,
    UpdateClass,
    DeleteClass,
    AddTeacherToClass,
    AddRecAudienceToClass,
    AddRecScheduleToClass,
    AddGroupToClass,
    DeleteTeacherFromClass,
    DeleteRecAudienceFromClass,
    DeleteRecScheduleFromClass,
    DeleteGroupFromClass,

    LoginUser,
    LogoutUser,
    ReloginUser,
    SetClasses,
    DeleteAllData,
    UpdateInfo,
    CalcFitness,
    DeleteResults,

    UpdateAlgorithm,
    RunAlgorithm,
  },
});

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
export default Schema;
