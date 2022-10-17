import GetDataFromDB from "../Service/GetDataFromDB.js";
import ParseScheduleFromDB from "../Service/ParseScheduleFromDB.js";
import AddClassToSchedule from "./AddClassToScheduleNew.js";
import MessageType from "../../Schema/TypeDefs/MessageType.js";
import { GraphQLInt } from "graphql";
import db from "../../database.js";

export const RUN_SA = {
  type: MessageType,
  args: {
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { id_cathedra }) {
    let { max_day, max_pair, classes, recommended_schedules, audiences } =
      await GetDataFromDB(id_cathedra);
    let scheduleForGroups = new Map();
    let scheduleForTeachers = new Map();
    let scheduleForAudiences = new Map();
    let schedule = {
      scheduleForGroups,
      scheduleForTeachers,
      scheduleForAudiences,
    };
    // Получения расписания для груп учителей если они есть  в других кафедрах
    let db_schedule = await ParseScheduleFromDB(id_cathedra);
    if (db_schedule) {
      for (let teach of db_schedule.schedule_teacher) {
        AddClassToSchedule(schedule.max_day, max_pair, teach.schedule.class, audiences, true)
      }
    }
    for (let clas of classes) {
      AddClassToSchedule(schedule, max_day, max_pair, clas, audiences);
    }
    let arrClass = new Set();
    for (let group of schedule.scheduleForGroups.values()) {
      for (let i = 0; i < max_day; i++) {
        for (let j = 0; j < max_pair; j++) {
          for (let k = 1; k <= 3; k++) {
            for (let h = 0; h < group[i][j][k].clas.length; h++) {
              // Вставка уникальных занятий
              arrClass.add(
                JSON.stringify({
                  day_week: i + 1,
                  number_pair: j + 1,
                  pair_type: k,
                  id_class: group[i][j][k].clas[h].id,
                  id_audience: group[i][j][k].ids_audience[h],
                })
              );
            }
          }
        }
      }
    }
    let arr = [];
    arrClass.forEach((sched) => arr.push(JSON.parse(sched)));
    let isBulk = await db.schedule.bulkCreate(arr);
    if (isBulk)
      return {
        successful: true,
        message: `Success`,
      };
    else return { successful: false, message: `Some error` };
  },
};
