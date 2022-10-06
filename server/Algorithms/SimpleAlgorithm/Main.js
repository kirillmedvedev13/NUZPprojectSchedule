import { GetDataFromDB } from "../Service/GetDataFromDB.js";
import { ParseScheduleFromDB } from "./ParseScheduleFromDB.js";
import AddClassToSchedule from "./AddClassToSchedule.js";
export const RUN_SA = {
  type: MessageType,
  args: {
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { id_cathedra }) {
    let {
      max_day,
      max_pair,
      classes,
      recommended_schedules,
      audiences
    } = GetDataFromDB(id_cathedra);
    let scheduleForGroups = new Map();
    let scheduleForTeachers = new Map();
    let scheduleForAudiences = new Map();
    let schedule = {
      scheduleForGroups,
      scheduleForTeachers,
      scheduleForAudiences,
    };
    if (id_cathedra) {
      await ParseScheduleFromDB(schedule, id_cathedra, max_day, max_pair,);
    }
    for (let clas in classes) {
      AddClassToSchedule(schedule, max_day, max_pair, clas, audiences);
    }
  },
};
