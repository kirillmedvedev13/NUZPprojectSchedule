#include "EvalutionAlgorithm.h"

void EvalutionAlgorithm::MutationLoop(thread_pool &worker_pool){
    for (int i = 0; i < population_size; i++)
    {
        if (GetRndDouble() <= p_mutation)
        {
            worker_pool.push_task([this, i]()
            {
                Mutation(i);
            });
        }
    }
    worker_pool.wait_for_tasks();
}
