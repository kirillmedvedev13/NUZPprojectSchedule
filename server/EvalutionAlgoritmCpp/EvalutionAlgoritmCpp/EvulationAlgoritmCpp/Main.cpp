#include <iostream>
#include "json.hpp"
#include "Init.h"
#include "Fitness.h"
#include "BS_thread_pool.hpp"
#include "TypeDefs.h"
#include <fstream>
#include <vector>
#include <cstring>
#include <cstdlib>
using namespace std;
using namespace nlohmann;
using namespace BS;

int main(int argc, const char *argv[])
{

    /* if (argc > 0)
     {
         try
         {
             json j_complete = json::parse(argv[1]);
             cout
                 << setw(4) << j_complete << endl;
         }
         catch (json::parse_error &ex)
         {
             std::cerr << "parse error at byte " << ex.byte << std::endl;
         }
     }*/
    try
    {

        ifstream fileData("data.json");
        if (!fileData.is_open())
        {

            cout << "File is not open" << endl;
            return 1;
        }
        json data = json::parse(fileData);
        const json info = data["info"]["dataValues"];
        const int max_day = info["max_day"];
        const int max_pair = info["max_pair"];
        int population_size = info["population_size"];
        const int max_generations = info["max_generations"];
        const double p_crossover = info["p_crossover"];
        const double p_mutation = info["p_mutation"];
        const double p_genes = info["p_genes"];
        const double penaltyGrWin = info["penaltyGrWin"];
        const double penaltyTeachWin = info["penaltyTeachWin"];
        const double penaltyLateSc = info["penaltyLateSc"];
        const double penaltyEqSc = info["penaltyEqSc"];
        const double penaltySameTimesSc = info["penaltySameTimesSc"];
        const double p_elitism = info["p_elitism"];
        const double penaltySameRecSc = info["penaltySameRecSc"];

        vector <clas> classes = vector <clas>();
        for (json cl : data["classes"]) {
            clas new_cl(cl);
            classes.push_back(cl);
        }
        vector <recommended_schedule>  recommended_schedules = vector <recommended_schedule>();
        for (json rc : data["recommended_schedules"]) {
            recommended_schedule new_rc(rc);
            recommended_schedules.push_back(new_rc);
        }
        vector <group> groups = vector < group>();
        for(json gr: data["groups"]){
            group new_gr(gr);
            groups.push_back(gr);
        }
           
        vector<audience> audiences =  vector<audience>();
        for (json aud : data["audiences"]) {
            audience new_aud(aud);
            audiences.push_back(new_aud);
        }
        vector <teacher> teachers =  vector <teacher>();
        for (json teach : data["teachers"]) {
            teacher new_teach(teach);
            teachers.push_back(new_teach);
        }

        json base_schedule = NULL;
        vector <individ> populations = vector <individ>();
        thread_pool worker_pool;
        timer Timer;

        Timer.start();
        cout<<"Init starts"<<endl;
        multi_future<vector<individ>> multiFuture = worker_pool.parallelize_loop(0, population_size, [classes, max_day, max_pair, audiences, base_schedule](const int a, const int b)
            {
        	   vector<individ> temp;
               for(int i=a;i<b;i++)
               {
                   temp.push_back(Init(classes, max_day, max_pair, audiences, base_schedule));
               }
                return temp;
            });
        for(vector<individ> temp :multiFuture.get())
        {
            populations.insert(populations.end(), temp.begin(), temp.end());
        }
        /*for (int i = 0; i < population_size; i++) {
            worker_pool.push_task([&populations,classes, max_day, max_pair, audiences, base_schedule]()
            {
                    individ i_schedule = Init(classes, max_day, max_pair, audiences, base_schedule);
                    populations.push_back(i_schedule);
            });
        }*/
        Timer.stop();
        cout << "The elapsed time was " << Timer.ms() << " ms.\n";

        Timer.start();
        cout<<"Fitness starts"<<endl;
        multi_future<void> multiFuture1 = worker_pool.parallelize_loop(0, population_size, [&populations,recommended_schedules, max_day, penaltySameRecSc, penaltyGrWin, penaltySameTimesSc, penaltyTeachWin](const int a,const int b)
        {
	        for(int i =a;i<b;i++)
	        {
                Fitness(populations[i], recommended_schedules, max_day, penaltySameRecSc, penaltyGrWin, penaltySameTimesSc, penaltyTeachWin);
	        }
        });
        /*for (individ& i_schedule : populations)
        {
           worker_pool.push_task([&i_schedule,recommended_schedules,max_day, penaltySameRecSc, penaltyGrWin, penaltySameTimesSc, penaltyTeachWin]()
                {
                   
                    Fitness(i_schedule, recommended_schedules, max_day, penaltySameRecSc, penaltyGrWin, penaltySameTimesSc, penaltyTeachWin);
                });
           
            
        }
         worker_pool.wait_for_tasks();
        */
        multiFuture1.get();
        cout<<"Fitness ends"<<endl;
        Timer.stop();
        cout << "The elapsed time was " << Timer.ms() << " ms.\n";
        
    }
    catch (json::type_error &ex)
    {
        std::cout << ex.what() << '\n';

    }
   

    return 0;
}
