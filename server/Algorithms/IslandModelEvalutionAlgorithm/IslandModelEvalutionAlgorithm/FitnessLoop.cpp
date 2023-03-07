#include "EvalutionAlgorithm.h"

void EvalutionAlgorithm::FitnessLoop(thread_pool &worker_pool){
    for (int i = 0; i < population_size; i++)
    {
        auto &ind = this->populations[i];
        worker_pool.push_task([this,&ind, &i]()
        {

            Fitness(ind, i);
        });
    }
    worker_pool.wait_for_tasks();
}
