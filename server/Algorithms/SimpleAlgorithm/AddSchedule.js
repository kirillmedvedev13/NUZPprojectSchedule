export default function AddSchedule(
    temp,
    day_week,
    number_pair,
    pair_type,
    max_pair,
    clas,
    id_audience = null
) {
    // Добавление аудитории, для вставки в базу данных
    if (id_audience)
        if (temp[day_week][number_pair][pair_type].ids_audience)
            temp[day_week][number_pair][pair_type].ids_audience.push(id_audience);
        else temp[day_week][number_pair][pair_type].ids_audience = [id_audience];
    temp[day_week][number_pair][pair_type].clas.push(clas);
    temp[day_week][number_pair][pair_type].isAvailable = false;
    temp[day_week][number_pair][3].isAvailable = false;
    if (pair_type === 3) {
        temp[day_week][number_pair][1].isAvailable = false;
        temp[day_week][number_pair][2].isAvailable = false;
    }
    // Проход числитель
    let total_top = new Array(max_pair)
    for (let h = 0; h < max_pair; h++) {
        // Если текущая пара уже есть то не проверять
        if (temp[day_week][h][1].clas.length || temp[day_week][h][3].clas.length)
            continue;
        let next_pair = null;
        let prev_pair = null;
        for (let k = h + 1; k < max_pair; k++) {
            if (temp[day_week][k][1].clas.length || temp[day_week][k][3].clas.length) {
                next_pair = k;
                break;
            }
        }
        for (let k = h - 1; k >= 0; k--) {
            if (temp[day_week][k][1].clas.length || temp[day_week][k][3].clas.length) {
                prev_pair = k;
                break;
            }
        }
        // Проверка на первую пара в этот день
        if (next_pair === null && prev_pair === null) {
            temp[day_week][h][1].isAvailable = true;
            total_top[h] = true;
            continue;
        }
        // Проверка на вставку вниз расписания
        if (prev_pair === null && next_pair - h < 2) {
            temp[day_week][h][1].isAvailable = true;
            total_top[h] = true;
            continue;
        }
        // Проверка на вставку вверх расписания
        if (next_pair === null && h - prev_pair < 2) {
            temp[day_week][h][1].isAvailable = true;
            total_top[h] = true;
            continue;
        }
        // Проверка на вставку между парами
        if (next_pair !== null && prev_pair !== null) {
            if (next_pair - h < 2 && h - prev_pair < 2) {
                temp[day_week][h][1].isAvailable = true;
                total_top[h] = true;
                continue;
            }
        }
        temp[day_week][h][1].isAvailable = false;
        total_top[h] = false;
    }
    // Проход знаменателю
    let total_bot = new Array(max_pair)
    for (let h = 0; h < max_pair; h++) {
        // Если текущая пара уже есть то не проверять
        if (temp[day_week][h][2].clas.length || temp[day_week][h][3].clas.length)
            continue;
        let next_pair = null;
        let prev_pair = null;
        for (let k = h + 1; k < max_pair; k++) {
            if (temp[day_week][k][2].clas.length || temp[day_week][k][3].clas.length) {
                next_pair = k;
                break;
            }
        }
        for (let k = h - 1; k >= 0; k--) {
            if (temp[day_week][k][2].clas.length || temp[day_week][k][3].clas.length) {
                prev_pair = k;
                break;
            }
        }
        // Проверка на первую пара в этот день
        if (next_pair === null && prev_pair === null) {
            temp[day_week][h][2].isAvailable = true;
            total_bot[h] = true;
            continue;
        }
        // Проверка на вставку вниз расписания
        if (prev_pair === null && next_pair - h < 2) {
            temp[day_week][h][2].isAvailable = true;
            total_bot[h] = true;
            continue;
        }
        // Проверка на вставку вверх расписания
        if (next_pair === null && h - prev_pair < 2) {
            temp[day_week][h][2].isAvailable = true;
            total_bot[h] = true;
            continue;
        }
        // Проверка на вставку между парами
        if (next_pair !== null && prev_pair !== null) {
            if (next_pair - h < 2 && h - prev_pair < 2) {
                temp[day_week][h][2].isAvailable = true;
                total_bot[h] = true;
                continue;
            }
        }
        temp[day_week][h][2].isAvailable = false;
        total_bot[h] = false;
    }
    // Проверка общий пар
    for (let h = 0; h < max_pair; h++) {
        temp[day_week][h][3].isAvailable = Boolean(total_bot[h] & total_top[h]);
    }
    return temp;
}