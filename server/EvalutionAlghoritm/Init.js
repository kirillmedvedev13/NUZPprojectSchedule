import GetAudienceForClass from "./GetAudienceForClass.js";
import GetRndInteger from "./GetRndInteger.js";
import GetPairTypeForClass from "./GetPairTypeForClass.js";

export default function(classes, population_size, max_day, max_pair, audiences){
    let populations = new Array(population_size);
    for (let i = 0; i < population_size; i++){
        let schedule = [];
        classes.forEach(clas => {
                const info = GetPairTypeForClass(clas);
                for (let j = 0; j < info.num_input; j++){
                    const day_week = GetRndInteger(1,max_day);
                    const number_pair = GetRndInteger(1,max_pair);
                    const id_audience = GetAudienceForClass(clas, audiences);
                    clas.assigned_groups.map(ag => {
                        schedule.push({number_pair, id_day_week: day_week, id_pair_type: info.pair_type, id_audience, id_assigned_group: ag.id});
                    })
            }
        });
        populations[i] = schedule;
    }
    return populations;
}