#ifndef ISLANDMODELEVOLUTIONALGORITHM_HPP
#define ISLANDMODELEVOLUTIONALGORITHM_HPP

#include <cfloat>
#include <vector>
#include <climits>
#include <algorithm>
#include "../EvolutionAlgorithmsCPP/EvolutionAlgorithm.hpp"

using namespace std;
using namespace BS;


//Класс для создания и управления Островной моделью ГА
class IslandModelEvolutionAlgorithm : public EvolutionAlgorithm
{
public:
    IslandModelEvolutionAlgorithm(){}
    IslandModelEvolutionAlgorithm(json data, json data_SA = NULL) :
        EvolutionAlgorithm(data, data_SA){}

    // Получить лучших индивидов их расписание (массив индивидов, массив занятий, массив пар) и фитнес
    vector<pair<vector<vector<schedule>>,int>> GetBestIndivids(const int &len_migration){
        auto bestIndivids = vector<pair<vector<vector<schedule>>,int>>(len_migration);
        for(auto i = 0; i < len_migration; i++){
            auto index_individ = this->population_size - 1 - i;
            bestIndivids[i].first = vector<vector<schedule>>(classes.size());
            bestIndivids[i].second = this->populations[index_individ].fitnessValue.fitnessValue;
            for (size_t index_class = 0; index_class < this->classes.size(); index_class++){
                bestIndivids[i].first[index_class] = vector<schedule>(classes[index_class].schedules[index_individ].size());
                for(size_t index_pair = 0; index_pair < this->classes[index_class].schedules[index_individ].size(); index_pair++){
                    bestIndivids[i].first[index_class][index_pair] = this->classes[index_class].schedules[index_individ][index_pair];
                }
            }
        }
        return bestIndivids;
    }

    // Замена худших индивидов на переданные
    void ChangeWorstIndivids(vector<pair<vector<vector<schedule>>,int>> bestIndivids){
        for(size_t i = 0; i < bestIndivids.size(); i++){
            auto index_individ = this->population_size - 1 - i;
            this->populations[index_individ].fitnessValue.fitnessValue = bestIndivids[i].second;
            for (size_t index_class = 0; index_class < bestIndivids[i].first.size(); index_class++){
                // Замена пар
                SwapSchedule(index_class, index_individ, bestIndivids[i].first[index_class]);
            }
        }
    }

};

#endif
