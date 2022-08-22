#include <iostream>
#include "json.hpp"
#include "Init.h"
#include "Fitness.h"
#include "Crossing.h"
#include "Mutation.h"
#include "SortPopulations.h"
#include "SelectRanging.h"
#include "GetRndDouble.h"
#include "GetRndInteger.h"
#include "MinFitnessValue.h"
#include "MeanFitnessValue.h"
#include "BS_thread_pool.hpp"
#include "TypeDefs.h"
#include <fstream>
#include <vector>
#include <cstring>
#include <cstdlib>
#include <mutex>
//using namespace std;
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
        
        cout << "Enter data" << endl;
        string data = "123";
       // cin >> data;
        cout << data;
        return 0;
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
        string type_select = data["type_select"];
        type_select = "ranging";
        const int num_elit = population_size * p_elitism;

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
        for (int i = 0; i < population_size; i++) {
            worker_pool.push_task( [&classes, &max_day, &max_pair, &audiences, &base_schedule, &populations]()
                {
                        auto temp = Init(classes, max_day, max_pair, audiences, base_schedule);
                        unique_lock<mutex> ul(mutex);
                        populations.push_back(temp);
                });
        }
        cout << "Init ends" << endl;
        Timer.stop();
        cout << "The elapsed time was " << Timer.ms() << " ms.\n";
        int countIter = 0;
        individ bestPopulation=individ();
        map<string, double> temp;
        bestPopulation.fitnessValue = fitness(INT_MAX, temp, temp, temp,0);

        while(countIter<max_generations && bestPopulation.fitnessValue.fitnessValue!= 0)
        {
            Timer.start();
            cout << "Crossing starts" << endl;
            multi_future<void> multiFutureCros = worker_pool.parallelize_loop(0, population_size, [&populations, &classes,&p_crossover](const int a, const int b)
            {
	            for(int i=a;i<b;i++)
	            {
                    if (GetRndDouble() < p_crossover)
                    {
	                    int r1 = GetRndInteger(a, b-1);
						int r2= GetRndInteger(a, b-1);
						while(r1==r2)
						{
							r1 = GetRndInteger(a, b-1);
							r2 = GetRndInteger(a, b-1);
						}
						Crossing(populations[r1], populations[r2], classes);
                    }
	            }
            });
            multiFutureCros.get();
            cout << "Crossing ends" << endl;
            Timer.stop();
            cout << "The elapsed time was " << Timer.ms()<< " ms.\n";

            
            Timer.start();
            cout << "Mutation starts" << endl;
            multi_future<void> multiFutureMuta = worker_pool.parallelize_loop(0, population_size, [&populations,&p_genes,& max_day,& max_pair, &audiences, &classes, &p_mutation](const int a, const int b)
            {
	            for(int i=a;i<b;i++)
	            {
                    if (GetRndDouble() < p_mutation)
                    {
                        Mutation(populations[i], p_genes, max_day, max_pair, audiences, classes);
                    }
	            }
            });
            multiFutureMuta.get();
            cout << "Mutation ends" << endl;
            Timer.stop();
            cout << "The elapsed time was " << Timer.ms() << " ms.\n";


            Timer.start();
            cout << "Fitness starts" << endl;
            multi_future<void> multiFutureFitness = worker_pool.parallelize_loop(0, population_size, [&populations, &recommended_schedules, &max_day, &penaltySameRecSc, &penaltyGrWin, &penaltySameTimesSc, &penaltyTeachWin](const int a, const int b)
                {
                    for (int i = a; i < b; i++)
                    {
                        Fitness(populations[i], recommended_schedules, max_day, penaltySameRecSc, penaltyGrWin, penaltySameTimesSc, penaltyTeachWin);
                    }
                });
            multiFutureFitness.get();
            cout << "Fitness ends" << endl;
            Timer.stop();
            cout << "The elapsed time was " << Timer.ms() << " ms.\n";

            
            Timer.start();
            cout << "Selection starts" << endl;
            SortPopulations(populations);
            vector<individ> elite;
            for(int i = 0;i<num_elit;i++)
            {
                elite.push_back(populations[i]);
            }
            multi_future<vector<individ>> multiFutureSelect = worker_pool.parallelize_loop(0, population_size, [&type_select,&populations](const int a, const int b)
            {
                    vector<individ> new_pops;
                    int length = b - a;
                    if (type_select == "ranging")
                    {
                        vector<double> p_populations;
                        double p_cur = 0;
                        for(int i = 0;i<length;i++)
                        {
                            double a1 = GetRndDouble() + 1;
                            double b1 = 2 - a;
                            p_populations.push_back(p_cur);
                            p_cur = p_cur + (1.0 / length) * (a1 - (a1 - b1) * (i / (length - 1.0)));
                        }
                            p_populations.push_back(1.001);
                        for(int i = 0;i<length;i++)
                        {
                            int index = SelectRanging(p_populations) + a;
                            new_pops.push_back(populations[index]);
                        }
                    }
                    else if (type_select == "tournament")
                    {

                    }
                    return new_pops;
            });
            auto arrFuture = multiFutureSelect.get();
            vector<individ> new_pops;

            int i = 0;
            while(new_pops.size()<population_size) {
                if (i < elite.size())
                    new_pops.push_back(elite[i]);
                
                int j = arrFuture.size()-1;
                while (j >= 0) {
                    if (new_pops.size() >= population_size)
                        break;
                    if (i < arrFuture[j].size())
                        new_pops.push_back(arrFuture[j][i]);
                    j--;
                }
                i++;
            }
            populations = new_pops;
            cout << "Selection ends" << endl;
            Timer.stop();
            cout << "The elapsed time was " << Timer.ms() << " ms.\n";

            multi_future<individ> multiFutureMin = worker_pool.parallelize_loop(0, population_size, [&populations](const int a,const int b)
            {
	            return MinFitnessValue(populations,a,b);
            });
            vector<individ> temp;
            for(individ t: multiFutureMin.get())
            {
                temp.push_back(t);
            }
            temp.push_back(bestPopulation);
            bestPopulation= MinFitnessValue(temp, 0, temp.size());

            multi_future<double> multiFutureMean = worker_pool.parallelize_loop(0, population_size, [&populations](const int a, const int b)
                {
                    return MeanFitnessValue(populations, a, b);
                });
            double mean = 0;
            auto arrMean = multiFutureMean.get();
            for (double t :arrMean) {
                mean += t;
            }

            cout << "Iter: " << countIter << ", Min fitness: " << bestPopulation.fitnessValue.fitnessValue <<", Mean fitness: "<<mean/arrMean.size() << endl;
            countIter++;

        }
        cout << setw(4) << bestPopulation.to_json() << endl;;
       
        
    }
    catch (json::parse_error& ex)
    {
        std::cerr << "parse error at byte " << ex.byte << std::endl;

    }
   

    return 0;
}
