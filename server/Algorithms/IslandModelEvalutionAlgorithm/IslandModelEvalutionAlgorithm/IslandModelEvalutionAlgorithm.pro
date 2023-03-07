TEMPLATE = app
CONFIG += console c++17
CONFIG -= app_bundle
CONFIG -= qt

SOURCES += \
        Crossing.cpp \
        CrossingLoop.cpp \
        EvalutionAlgorithm.cpp \
        Fitness.cpp \
        FitnessLoop.cpp \
        GetBestPopulation.cpp \
        GetIdAudienceForClass.cpp \
        GetPairTypeForClass.cpp \
        GetRndDouble.cpp \
        GetRndInteger.cpp \
        Init.cpp \
        MeanFitnessValue.cpp \
        MinFitnessValue.cpp \
        Mutation.cpp \
        MutationLoop.cpp \
        Selection.cpp \
        SortPopulations.cpp \
        SortSchedule.cpp \
        TypeDefs.cpp \
        main.cpp

HEADERS += \
    BS_thread_pool.hpp \
    EvalutionAlgorithm.h \
    TypeDefs.h \
    json.hpp
