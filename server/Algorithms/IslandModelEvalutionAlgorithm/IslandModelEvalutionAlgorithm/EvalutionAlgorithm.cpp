#include "EvalutionAlgorithm.h"

EvalutionAlgorithm::EvalutionAlgorithm(json data){
    this->max_day = data["max_day"];
    this->max_pair = data["max_pair"];
    const json evolution_values = data["params"];
    this->population_size = evolution_values["population_size"];
    this->max_generations = evolution_values["max_generations"];
    this->p_crossover = evolution_values["p_crossover"];
    this->p_mutation = evolution_values["p_mutation"];
    this->p_elitism = evolution_values["p_elitism"];

    const json general_values = data["general_values"];
    this->penaltySameRecSc = general_values["penaltySameRecSc"];
    this->penaltyGrWin = general_values["penaltyGrWin"];
    this->penaltyTeachWin = general_values["penaltyTeachWin"];
    this->penaltySameTimesSc = general_values["penaltySameTimesSc"];
    this->num_elit = population_size * p_elitism;

    this->classes = vector<clas>();
    for (json cl : data["classes"])
    {
        classes.push_back(clas(cl, population_size));
    }

    this->audiences = vector<audience>();
    for (json &aud : data["audiences"])
    {
        audience new_aud(aud);
        audiences.push_back(new_aud);
    }

    this->bs = base_schedule(data["base_schedule"]["schedule_group"], data["base_schedule"]["schedule_teacher"], data["base_schedule"]["schedule_audience"]);

    populations = Init();

    bestPopulation = bestIndivid();



}
