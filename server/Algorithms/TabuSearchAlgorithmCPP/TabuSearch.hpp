#ifndef TABUSEARCH_H
#define TABUSEARCH_H

#include "../ServiceCPP/Service.hpp"
#include "../ServiceCPP/BS_thread_pool.hpp"

using namespace BS;

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
    TabuList(){

    }
    TabuList(int classId){
        this->classId=classId;
        history = vector<Clas>();
    }

};

class TabuSearch: public Service{
    int tabu_tenure;
    int s_neighbors;
    int n_iteration;
    int tabu_list_len;
    vector<TabuList> tabu_list;

public:
    TabuSearch(json data, json dataSA=NULL){
         timer Timer;
         Timer.start();
         InitServiceWithInitAndMut(data, 1);
         InitClasses(dataSA);
         InitPopulations();
         for(auto &clas: classes){
             TabuList clasTabu = TabuList(clas.id);
             for( auto &sch: clas.schedules[0]){
                 clasTabu.history.push_back(Clas(sch.day_week,sch.number_pair,sch.pair_type,0));
             }
             tabu_list.push_back(clasTabu);
         }
         Fitness(0);
         int iter = 0;
         while(populations[0].fitnessValue.fitnessValue > 0 || iter< n_iteration){

         }

    }
};


#endif // TABUSEARCH_H

