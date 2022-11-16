TEMPLATE = app
CONFIG += console c++11
CONFIG -= app_bundle
CONFIG -= qt

SOURCES += \
        TypeDefs.cpp \
        main.cpp

DISTFILES += \
    EvalutionAlgorithmCpp.pro.user

HEADERS += \
    BS_thread_pool.hpp \
    Crossing.hpp \
    Fitness.hpp \
    GetIdAudienceForClass.hpp \
    GetPairTypeForClass.hpp \
    GetRndDouble.hpp \
    GetRndInteger.hpp \
    Init.hpp \
    InitIndivid.hpp \
    MeanFitnessValue.hpp \
    MinFitnessValue.hpp \
    Mutation.hpp \
    SelectRanging.hpp \
    SortPopulations.hpp \
    SortSchedule.hpp \
    TypeDefs.h \
    json.hpp
