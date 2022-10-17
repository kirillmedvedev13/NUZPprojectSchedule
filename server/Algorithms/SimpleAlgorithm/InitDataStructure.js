export default function InitDataStructure(max_day, max_pair) {
    let day_weeks = [];
    for (let i = 0; i < max_day; i++) {
        let number_pairs = [];
        for (let j = 0; j < max_pair; j++) {
            if (j === 0)
                number_pairs.push({
                    1: { clas: [], isAvailable: true },
                    2: { clas: [], isAvailable: true },
                    3: { clas: [], isAvailable: true },
                    firstPairType: null,
                });
            else
                number_pairs.push({
                    1: { clas: [], isAvailable: true },
                    2: { clas: [], isAvailable: true },
                    3: { clas: [], isAvailable: true },
                });
        }
        day_weeks.push(number_pairs);
    }
    return day_weeks;
}