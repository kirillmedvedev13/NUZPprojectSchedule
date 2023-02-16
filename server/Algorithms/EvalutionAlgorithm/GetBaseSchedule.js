import ParseScheduleFromDB from "../Service/GetBaseSchedule.js";
import AddClassToSchedule from "./AddClassToSchedule.js";
export default async function GetBaseSchedule(base_schedule, id_cathedra) {
  let scheduleForGroups = new Map();
  let scheduleForTeachers = new Map();
  let scheduleForAudiences = new Map();
  base_schedule = {
    scheduleForGroups,
    scheduleForTeachers,
    scheduleForAudiences,
  };
  let result = await ParseScheduleFromDB(id_cathedra);
  if (!result) return null;
  let schedule_audience = result.schedule_audience;
  for (let aud of schedule_audience) {
    for (const sc of aud.schedule) {
      AddClassToSchedule(
        base_schedule,
        sc.class,
        sc.day_week,
        sc.number_pair,
        sc.pair_type,
        sc.id_audience
      );
    }
  }
}
