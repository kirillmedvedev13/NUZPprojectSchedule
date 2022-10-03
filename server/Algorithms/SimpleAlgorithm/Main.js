import { GetDataFromDB } from "../Services/GetDataFromDB.js";
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
      penaltyGrWin,
      penaltyTeachWin,
      penaltyLateSc,
      penaltyEqSc,
      penaltySameTimesSc,
      penaltySameRecSc,
      classes,
      recommended_schedules,
      audiences,
      groups,
      teachers,
    } = GetDataFromDB(id_cathedra);
    let schedule = null;
    if (id_cathedra) {
      let scheduleForGroups = new Map();
      let scheduleForTeachers = new Map();
      let scheduleForAudiences = new Map();
      schedule = {
        scheduleForGroups,
        scheduleForTeachers,
        scheduleForAudiences,
      };
      await ParseScheduleFromDB(schedule, id_cathedra, max_day, max_pair);
    }
    for (let clas in classes) {
      AddClassToSchedule(schedule, clas);
    }
  },
};
