#include "threadpool.h"

ThreadPool::ThreadPool()
{
}
void ThreadPool::Start()
{
    const uint32_t num_threads = thread::hardware_concurrency(); // Max # of threads the system supports
    threads.resize(num_threads);
    for (uint32_t i = 0; i < num_threads; i++)
    {
        threads.at(i) = thread(&ThreadPool::ThreadLoop, this);
    }
}
void ThreadPool::ThreadLoop()
{
    while (true)
    {
        function<void()> job;
        {
            unique_lock<mutex> lock(queue_mutex);
            mutex_condition.wait(lock, [this]
                                 { return !jobs.empty() || should_terminate; });
            if (should_terminate)
            {
                return;
            }
            job = jobs.front();
            jobs.pop();
        }
        job();
    }
}
void ThreadPool::QueueJob(const function<void()> &job)
{
    {
        unique_lock<std::mutex> lock(queue_mutex);
        jobs.push(job);
    }
    mutex_condition.notify_one();
}
bool ThreadPool::Busy()
{
    bool poolbusy;
    {
        unique_lock<mutex> lock(queue_mutex);
        poolbusy = jobs.empty();
    }
    return poolbusy;
}
void ThreadPool::Stop()
{
    {
        unique_lock<std::mutex> lock(queue_mutex);
        should_terminate = true;
    }
    mutex_condition.notify_all();
    for (thread &active_thread : threads)
    {
        active_thread.join();
    }
    threads.clear();
}
