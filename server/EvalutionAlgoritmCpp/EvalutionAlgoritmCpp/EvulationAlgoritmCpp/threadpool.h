#ifndef THREADPOOL_H
#define THREADPOOL_H

#include <functional>
#include <mutex>
#include <vector>
#include<queue>
#include <thread>
#include <condition_variable>

using namespace std;

class ThreadPool
{
    void ThreadLoop();
    bool should_terminate = false;           // Tells threads to stop looking for jobs
    mutex queue_mutex;                  // Prevents data races to the job queue
    condition_variable mutex_condition; // Allows threads to wait on new jobs or termination
    vector<thread> threads;
    queue<function<void()>> jobs;

public:
    ThreadPool();
    void Start();
    void QueueJob(const function<void()>&job);
    void Stop();
    bool Busy();
};

#endif // THREADPOOL_H
