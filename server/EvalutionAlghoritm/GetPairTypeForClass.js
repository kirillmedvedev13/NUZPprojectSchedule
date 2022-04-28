import GetRndInteger from "./GetRndInteger.js";

export default function(clas){
    switch(clas.times_per_week){
        // Занятие 1 раз в 2 недели: 1) 1 раз по числ или знам
        case 0.5:
            return [GetRndInteger(1,2)];
        // Занятие 1 раз в неделю: 1) общая пара, 2) 2 раза по числ или знаменателю
        case 1:
            switch(GetRndInteger(1,2)){
                case 1: 
                    return [3];
                case 2:
                    return [GetRndInteger(1,2),GetRndInteger(1,2)];
            }
    }
}