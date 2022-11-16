TEMPLATE = app
CONFIG += console c++11
CONFIG -= app_bundle
CONFIG -= qt

SOURCES += \
        Crossing.cpp \
        Fitness.cpp \
        GetPairTypeForClass.cpp \
        GetRndDouble.cpp \
        GetRndInteger.cpp \
        Init.cpp \
        MeanFitnessValue.cpp \
        Mutation.cpp \
        SelectRanging.cpp \
        SortPopulations.cpp \
        TypeDefs.cpp \
        main.cpp

DISTFILES += \
    EvalutionAlgorithmCpp.pro.user

HEADERS += \
    BS_thread_pool.hpp \
    Crossing.h \
    Fitness.h \
    GetIdAudienceForClass.hpp \
    GetPairTypeForClass.h \
    GetRndDouble.h \
    GetRndInteger.h \
    Init.hpp \
    InitIndivid.hpp \
    MeanFitnessValue.h \
    MinFitnessValue.hpp \
    Mutation.h \
    SelectRanging.h \
    SortPopulations.hpp \
    SortSchedule.hpp \
    TypeDefs.h \
    json.hpp
