import AddSchedule from "./AddSchedule.js";
import InitDataStructure from "./InitDataStructure.js";
import AddSchedule from "./AddSchedule.js";

export default function AddClassToScheduleOld(schedule, schedule_record, max_day, max_pair) {
    let { schedule_group, schedule_teacher, schedule_audience } = schedule_record;
    // Вставка занятий для групп
    for (let gr of schedule_group) {
        let temp_group = schedule.scheduleForGroups.get(ag.id);
        // Если для группы нету расписания
        if (!temp_group) {
            temp_group = InitDataStructure(max_day, max_pair);
        }
        // Если занятия были в базе
        for (const sc of gr.schedule) {
            temp_group = AddSchedule(
                temp_group,
                sc.day_week - 1,
                sc.number_pair - 1,
                sc.pair_type,
                max_pair,
                sc.clas,
                sc.id_audience
            );
        }
        schedule.scheduleForGroups.set(ag.id, temp_group);
    }
    // Вставка занятий для учителей
    for (let teach of schedule_teacher) {
        let temp_teacher = schedule.scheduleForTeachers.get(teach.id);
        // Если для группы нету расписания
        if (!temp_teacher) {
            temp_teacher = InitDataStructure(max_day, max_pair);
        }
        // Если занятия были в базе
        for (const sc of teach.schedule) {
            temp_teacher = AddSchedule(
                temp_teacher,
                sc.day_week - 1,
                sc.number_pair - 1,
                sc.pair_type,
                max_pair,
                sc.clas,
                sc.id_audience
            );
        }
        schedule.scheduleForGroups.set(teach.id, temp_teacher);
    }
    // Вставка занятий для аудиторий
    for (let aud of schedule_audience) {
        let temp_audience = schedule.scheduleForAudiences.get(aud.id);
        // Если для группы нету расписания
        if (!temp_audience) {
            temp_audience = InitDataStructure(max_day, max_pair);
        }
        // Если занятия были в базе
        for (const sc of aud.schedule) {
            temp_audience = AddSchedule(
                temp_audience,
                sc.day_week - 1,
                sc.number_pair - 1,
                sc.pair_type,
                max_pair,
                sc.clas,
                sc.id_audience
            );
        }
        schedule.scheduleForGroups.set(aud.id, temp_audience);
    }
}