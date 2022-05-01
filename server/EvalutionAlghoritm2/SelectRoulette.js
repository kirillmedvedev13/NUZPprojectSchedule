export default function SelectRoulette(populations) {
    let sumFitness = 0;
    populations.forEach(individ => {
        sumFitness += individ.fitnessValue;
    })
    let new_populations = [];
    let p_populations = Array(populations.length);
    let p_current = 0;
    for (let i = 0; i < populations.length; i++) {
        p_populations[i] = p_current + populations[i].fitnessValue / sumFitness;
        p_current = p_populations[i];
    }
    for (let i = 0; i < populations.length; i++) {
        let rand = Math.random();
        let index = 0;
        while (rand >= p_populations[index]) {
            index++;
        }
        new_populations.push(populations[index]);
    }
    return new_populations;
}