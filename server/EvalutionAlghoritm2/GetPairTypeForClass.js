import GetRndInteger from "./GetRndInteger.js";

export default function (clas) {
    let r;
    switch (clas.times_per_week) {
        // Занятие 1 раз в 2 недели: 1) 1 раз по числ или знам
        case 0.5:
        case 1:
            return [GetRndInteger(1, 2)];
        // Занятие 1 раз в неделю: 1) общая пара, 2) 2 раза по числ или знаменателю
        case 2:
            r = Math.random();
            if (r <= 0.75)
                return [3];
            if (r <= 1)
                return [GetRndInteger(1, 2), GetRndInteger(1, 2)];

        // Занятие 3 раза в 2 недели: 1) общая пара + числ/знам, 2) числ/знам + числ/знам + числ/знам
        case 2.5:
        case 3:
            r = Math.random();
            if (r <= 0.75)
                return [3, GetRndInteger(1, 2)];
            if (r <= 1)
                return [GetRndInteger(1, 2), GetRndInteger(1, 2), GetRndInteger(1, 2)];
    }
    // 0.5 - 1 пара в 2 денели
    // 1 - 1 пара в 2 денели
    // 2 - 2 пары в 2 денели
    // 2.5 - 3 пары в 2 недели
    // 3 - 3 пары в 2 денели
    // 4 - 4 пары в 2 недели
}
