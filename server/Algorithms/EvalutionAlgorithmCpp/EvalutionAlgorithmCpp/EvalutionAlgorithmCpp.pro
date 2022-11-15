TEMPLATE = app
CONFIG += console c++11
CONFIG -= app_bundle
CONFIG -= qt

SOURCES += \
        AddClassToSchedule.cpp \
        Crossing.cpp \
        Fitness.cpp \
        GetIdAudienceForClass.cpp \
        GetPairTypeForClass.cpp \
        GetRndDouble.cpp \
        GetRndInteger.cpp \
        Init.cpp \
        MeanFitnessValue.cpp \
        MinFitnessValue.cpp \
        Mutation.cpp \
        SelectRanging.cpp \
        SortPopulations.cpp \
        SortSchedule.cpp \
        TypeDefs.cpp \
        main.cpp \
        threadpool.cpp

DISTFILES += \
    EvalutionAlgorithmCpp.pro.user \
    Main.js \
    SpawnChild.js

HEADERS += \
    AddClassToSchedule.h \
    BS_thread_pool.hpp \
    Crossing.h \
    Filter.h \
    Fitness.h \
    GetIdAudienceForClass.h \
    GetPairTypeForClass.h \
    GetRndDouble.h \
    GetRndInteger.h \
    Init.h \
    MeanFitnessValue.h \
    MinFitnessValue.h \
    Mutation.h \
    SelectRanging.h \
    SortPopulations.h \
    SortSchedule.h \
    TypeDefs.h \
    json.hpp \
    threadpool.h
