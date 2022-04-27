import GetAudienceForClass from "./GetAudienceForClass.js";
import GetRndInteger from "./GetRndInteger.js";
import GetPairTypeForClass from "./GetPairTypeForClass.js";

export default function (classes, population_size, max_day, max_pair, audiences) {
    let populations = new Array(population_size);
    for (let i = 0; i < population_size; i++) {
        let schedule = [];
        classes.forEach(clas => {
            const info = GetPairTypeForClass(clas);
            for (let j = 0; j < info.num_input; j++) {
                let isPut = false;
                while (!isPut) {
                    const day_week = GetRndInteger(1, max_day);
                    const number_pair = GetRndInteger(1, max_pair);
                    const id_audience = GetAudienceForClass(clas, audiences);
                    wrongSchedules = schedule.filter(sch => {
                        if(sch.number_pair === number_pair && sch.id_day_week === day_week){
                            if( (info.pair_type === 1 || info.pair_type === 2) && sch.id_pair_type === 3){
                                return true;
                            }
                            if(info.pair_type === 3 && (sch.id_pair_type === 1 || sch.id_pair_type === 2)){
                                return true;
                            }
                        }
                            return false;
                    })
                    clas.assigned_groups.map(ag => {
                        schedule.push({ number_pair, id_day_week: day_week, id_pair_type: info.pair_type, id_audience, id_assigned_group: ag.id });
                    })
                }
            }
        });
        populations[i] = schedule;
    }
    return populations;
}