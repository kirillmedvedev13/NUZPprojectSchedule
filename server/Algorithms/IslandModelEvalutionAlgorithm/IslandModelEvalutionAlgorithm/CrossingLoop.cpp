#include "EvalutionAlgorithm.h"

void EvalutionAlgorithm::CrossingLoop(){
    thread_pool worker_pool(thread::hardware_concurrency());
    for (int i = 0; i < population_size; i += 2)
    {
        if (GetRndDouble() < p_crossover)
        {
            worker_pool.push_task([this, i]()
            {
                Crossing(i, i + 1);
            });
        }
    }
    worker_pool.wait_for_tasks();
}
