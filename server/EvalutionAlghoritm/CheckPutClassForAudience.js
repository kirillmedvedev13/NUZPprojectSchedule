export default function (id_audience, schedule, day_week, number_pair, pair_type) {
    const isSuitableTime = schedule.find(sch => {
        if (sch.id_audience === id_audience && sch.day_week === day_week && sch.number_pair === number_pair) {
            // Если нужно вставить занятие по числ, то проверяется знам в расписании 
            if (pair_type === 1 && sch.pair_type === 2)
                return false;
            // Если нужно вставить по знамен, то проверяется на числитель
            if (pair_type === 2 && sch.pair_type === 1)
                return false;

            return true;
        }
        return false;
    })
    // Если в это время нету пар для аудитории, то возвращается тру
    if (!isSuitableTime) return true
    else return false
}