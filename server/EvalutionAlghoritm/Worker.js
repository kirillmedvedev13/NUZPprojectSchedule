import workerpool from "workerpool"
import Crossing from "./Crossing.js";
import Fitness from "./Fitness.js";
import Mutation from "./Mutation.js";
import SelectRanging from "./SelectRanging.js";
import SelectTournament from "./SelectTournament.js";

function workCrossing(schedule1, schedule2, classes) {
    return Crossing(schedule1, schedule2, classes);
}

function workFitness(schedule,
    mapTeacherAndAG,
    mapGroupAndAG,
    penaltyGrWin,
    penaltyLateSc,
    penaltyEqSc,
    penaltySameTimesSc,
    penaltyTeachWin) {
    return Fitness(schedule,
        mapTeacherAndAG,
        mapGroupAndAG,
        penaltyGrWin,
        penaltyLateSc,
        penaltyEqSc,
        penaltySameTimesSc,
        penaltyTeachWin);
}

function workMutation(schedule,
    p_genes,
    max_day,
    max_pair,
    audiences) {
    return Mutation(schedule,
        p_genes,
        max_day,
        max_pair,
        audiences);
}

function workSelectRanging(p_populations) {
    return SelectRanging(p_populations)
}

function workSelectTournament(population1, population2, population3) {
    return SelectTournament(population1, population2, population3);
}

workerpool.worker({
    workCrossing,
    workFitness,
    workMutation,
    workSelectRanging,
    workSelectTournament
})