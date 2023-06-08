#ifndef TABUSEARCH_H
#define TABUSEARCH_H

#include "../ServiceCPP/Service.hpp"
#include "../ServiceCPP/BS_thread_pool.hpp"
#include <algorithm>

using namespace BS;
using namespace std;

<<<<<<< HEAD
struct Clas{
    int day_week;
    int pair_type;
    int number_pair;
    int number_iter;
    Clas(int day_week, int number_pair, int pair_type,int number_iter){
        this->day_week = day_week;
        this->number_pair = number_pair;
        this->pair_type = pair_type;
        this->number_iter=number_iter;
    }
    Clas operator=(const Clas &b){
        return Clas(b.day_week, b.number_pair, b.pair_type,b.number_pair);
    }
    bool operator==(const Clas &b) const{
        if (this->day_week == b.day_week && this->pair_type == b.pair_type && this->number_pair == b.number_pair)
            return true;
        return false;
    }

};

struct TabuList{
    int classId;
    vector<Clas> history;
    TabuList(){}
    TabuList(int classId){
        this->classId=classId;
        history = vector<Clas>();
    }
};
=======
>>>>>>> 700543b6d65308fd9d75088f920de5d1c7135464

class TabuSearch: public Service{
    int tabu_tenure;
    int s_neighbors;
    int n_iteration;
    int tabu_list_len;
    map<int,vector<Clas>> tabu_list;

public:
    TabuSearch(){}
    TabuSearch(json data, timer &Timer,json dataSA=NULL){
         Timer.start();
         tabu_tenure= data["params"]["tabu_tenure"];
         s_neighbors= data["params"]["s_neighbors"];
         n_iteration= data["params"]["n_iteration"];
         tabu_list_len= data["params"]["tabu_list_len"];
         InitServiceWithInitAndMut(data, 1);
         InitClasses(dataSA);
         InitPopulations();
         for(auto &clas: classes){
             vector<Clas> history;
             for( auto &sch: clas.schedules[0]){
                 history.push_back(Clas(sch.day_week,sch.number_pair,sch.pair_type,sch.id_audience,0));
             }
             tabu_list[clas.id]=history;
         }
         Fitness(0);
         Timer.stop();
         cout << "Init " << Timer.ms() << " ms.\n";
    }

    bestIndivid MainLoop(json data,timer &Timer,vector<pair<int, double>> &result){
        int iter = 0;
        auto StartTime = chrono::high_resolution_clock::now();
        while(populations[0].fitnessValue.fitnessValue > 0 && iter< n_iteration){
            Timer.start();

            vector<map<int,vector<Clas>>> tabuNeighbor;
            Service mutations;

            mutations.InitServiceWithInitAndMut(data,s_neighbors);
            mutations.InitBaseSchedule();
            for(int j=0;j<s_neighbors;j++){
               for(int k = 0;k<mutations.classes.size();k++){
                   mutations.classes[k].schedules[j]=classes[k].schedules[0];
               }
            }

            mutations.InitPopulations();

            for(int j=0; j < s_neighbors;j++){
                map<int,vector<Clas>> tempTabu;
                mutations.Mutation(j,tempTabu,iter);
                tabuNeighbor.push_back(tempTabu);
                mutations.Fitness(j);
            }
            int indexBestNeighb=NULL;
            int bestFitness=populations[0].fitnessValue.fitnessValue;
            for(int j=0; j < s_neighbors;j++){
                int fitnesNeighb = mutations.populations[j].fitnessValue.fitnessValue;
                if(bestFitness>fitnesNeighb && !TabuListContains(tabuNeighbor[j])){
                    indexBestNeighb = j;
                    bestFitness = fitnesNeighb;
                }
            }
            if(indexBestNeighb){
                for(auto& [classId, newSched] : tabuNeighbor[indexBestNeighb]){
                    vector<schedule> schedules;
                    const int idClass = classId;
                    auto it = find_if(classes.begin(),classes.end(),[&idClass](const clas& cl){
                        return cl.id==idClass;
                    });
                    for(int j = 0;j< newSched.size();j++){
                        schedules.push_back(newSched[j].GetSchedule(classId));
                    }
                    SwapSchedule(it - classes.begin(),0,schedules);
                }


            }

            UpdateTabuList(iter);
            Timer.stop();

            cout <<"Iter: " << iter++<< ", time: "<<Timer.ms() << "ms"<<", fitness: "<<bestFitness<< endl;
            auto EndTime = chrono::high_resolution_clock::now();
            chrono::duration<float,std::milli> duration = EndTime - StartTime;
            result.push_back(make_pair(duration.count(), bestFitness));
        }
        return GetBestIndivid();

    }


    bool TabuListContains(map<int,vector<Clas>> &tabuNeighbor){
        for(auto& [classId, historyN]: tabuNeighbor){
            auto& history = tabu_list[classId];
            for(auto &sched: historyN){
                auto it = std::find(history.begin(),history.end(),history[0]);
                if(it!=history.end()){
                    cout<<"Value in tabu list"<<endl;
                    return true;
                }

            }
        }
        return false;
    }
    void UpdateTabuList(int iter){
        for(auto& [classId, history] : tabu_list){
            if(history.size() > tabu_list_len)
              history.erase(history.begin());
            for(int i = 0;i < history.size();i++){
                auto &tempHist = history[i];
                if(iter - tempHist.number_iter > tabu_tenure){
                    history.erase(history.begin()+i);
                }
            }
        }
    }

};


#endif // TABUSEARCH_H

