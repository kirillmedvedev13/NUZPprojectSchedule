#include "TypeDefs.h"
#include "BS_thread_pool.hpp"
#include <vector>

using namespace std;
using namespace BS;

class EvalutionAlgorithm{
    int population_size;
    int max_generations;
    double p_crossover;
    double p_mutation;
    double p_elitism;
    double penaltySameRecSc;
    double penaltyGrWin;
    double penaltyTeachWin;
    double penaltySameTimesSc;
    int num_elit;
    int number_pool;
    int max_day;
    int max_pair;
    vector<clas> classes;
    vector<audience> audiences;
    base_schedule bs;
    vector <individ> populations;
    bestIndivid bestPopulation;

public:
    EvalutionAlgorithm(json data);
    vector <individ> Init();
    vector<int> GetPairTypeForClass(const clas& clas_);
    int GetRndInteger(int offset, int range);
    double GetRndDouble();
    int GetIdAudienceForClass(const clas& clas);
    void Fitness(individ &i_schedule,const int &index);
    void FitnessLoop(thread_pool &worker_pool);
    void SortSchedule(vector<schedule*>& i_schedule);
    void Crossing(const int &index1,const int &index2);
    void CrossingLoop(thread_pool &worker_pool);
    void Mutation(const int &index);
    void MutationLoop(thread_pool &worker_pool);
    void Selection();
    double MeanFitnessValue();
    void MinFitnessValue();
    void SortPopulations();
    bestIndivid GetBestPopulation();
};
