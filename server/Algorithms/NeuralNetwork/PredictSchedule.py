from sys import argv
from os.path import join, isfile
from os import environ
from numpy import array
from tensorflow.keras.models import load_model
from pandas import DataFrame
from copy import copy
from json import loads, dump, dumps
from DefineModel import DefineModel
from TrainAndTestModel import TrainAndTestModel
from DataProcessing import DataProcessing, labelEncode, decodeData
from ConvertJSONtoCSV import ConvertJSONtoCSV


def GetDataFromJSON(inputFile):
    schedules = []
    with open(inputFile, 'r') as f:
        data = loads(f.read())
        max_day = data["max_day"]
        max_pair = data["max_pair"]
        for sched in data["classes"]:
            newSched = {}
            newSched["pair_type"] = sched["pair_type"]
            newSched["id_class"] = sched["class"]["id"]
            newSched["id_type_class"] = sched["class"]["id_type_class"]
            newSched["id_audience"] = sched["id_audience"]
            groups = sched["class"]["assigned_groups"]
            teachers = sched["class"]["assigned_teachers"]
            for teacher in teachers:
                for group in groups:
                    copySched = copy(newSched)
                    copySched["id_teacher"] = teacher["id_teacher"]
                    copySched["id_group"] = group["id_group"]
                    schedules.append(copySched)

    return [max_day, max_pair, DataFrame.from_records(schedules)]


def GetFinishedModel(dataSetDir, jsonDir, fileModel, day_week, number_pair, n_featuresX, modelParamsPath):
    with open(modelParamsPath, 'r') as f:
        data = loads(f.read())
        activation_output = data["activation_output"]
        loss = data["loss"]
        optimizer = data["optimizer"]
        metrics = data["metrics"]
        batch_size = data["batch_size"]
        verbose = data["verbose"]
        epochs = data["epochs"]
        test_size = data["test_size"]
    print("Define LSTM model")
    model = DefineModel(day_week, number_pair, n_featuresX,
                        activation_output, loss, optimizer, metrics)
    ConvertJSONtoCSV(jsonDir, dataSetDir)
    print("Data Processing")

    dataX, dataY = DataProcessing(dataSetDir, day_week, number_pair)
    print("Train And Test Model")
    TrainAndTestModel(model, dataX, dataY, test_size,
                      epochs, batch_size, verbose)
    model.save(fileModel)


rootDir = argv[1]
inputFile = join(rootDir, "data.json")
dataSetDir = join(rootDir, "DatasetSchedulesCSV")
jsonDir = join(rootDir, "DatasetSchedulesJSON")
fileModel = join(rootDir, "modelForSchedulePredict.h5")
modelParamsPath = join(rootDir, "modelParams.json")

resultFile = join(rootDir, "result.json")

print("Load data from json")
max_day, max_pair, classes = GetDataFromJSON(inputFile)
n_featuresX = len(classes.columns)
verbose = 1


if (not isfile(fileModel)):
    print("Create new model")
    GetFinishedModel(dataSetDir, jsonDir, fileModel, max_day,
                     max_pair, n_featuresX, modelParamsPath)

print("Load model")
model = load_model(fileModel)
copyClasses = copy(classes)
dataX = labelEncode(copyClasses)[0]

print("Predict schedule")
predictedSchedule = model.predict(array([dataX]))
schedule = decodeData(predictedSchedule[0], max_day, max_pair)

schedules = set()
for i, clas in classes.iterrows():
    day_week = schedule[i][0]
    number_pair = schedule[i][1]
    id_class = clas["id_class"]
    id_audience = clas["id_audience"]
    pair_type = clas["pair_type"]
    sched = {'day_week': int(day_week), 'number_pair': int(number_pair),
             'id_class': int(id_class),  'id_audience': int(id_audience), 'pair_type':
             int(pair_type)}
    schedules.add(dumps(sched))

schedules = list(map(lambda x: loads(x), schedules))

print("Write result in file")
with open(resultFile, 'w') as f:
    dump({"schedules": schedules}, f)
