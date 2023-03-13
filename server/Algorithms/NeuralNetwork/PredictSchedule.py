import sys
import os
import numpy as np
from keras.models import load_model
import pandas as pd
from copy import copy
import json
from DefineModel import DefineModel
from TrainAndTestModel import TrainAndTestModel
from DataProcessing import DataProcessing, labelDecode, labelEncode, decodeData


def GetDataFromJSON(inputFile):
    schedules = []
    with open(inputFile, 'r') as f:
        data = json.loads(f.read())
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

    return [max_day, max_pair, pd.DataFrame.from_records(schedules)]


def GetFinishedModel(dataSetDir, fileModel, day_week, number_pair, n_featuresX, modelParamsPath):
    with open(modelParamsPath, 'r') as f:
        data = json.loads(f.read())
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
    print("Data Processing")
    dataX, dataY = DataProcessing(dataSetDir, day_week, number_pair)
    print("Train And Test Model")
    TrainAndTestModel(model, dataX, dataY, test_size,
                      epochs, batch_size, verbose)
    model.save(fileModel)


rootDir = sys.argv[1]
inputFile = os.path.join(rootDir, "data.json")
dataSetDir = os.path.join(rootDir, "DatasetSchedulesCSV")
fileModel = os.path.join(rootDir, "modelForSchedulePredict.h5")
modelParamsPath = os.path.join(rootDir, "modelParams.json")

resultFile = os.path.join(rootDir, "result.json")


max_day, max_pair, classes = GetDataFromJSON(inputFile)
n_featuresX = len(classes.columns)
verbose = 1


if (not os.path.isfile(fileModel)):
    GetFinishedModel(dataSetDir, fileModel, max_day,
                     max_pair, n_featuresX, modelParamsPath)

model = load_model(fileModel)
dataX = labelEncode(classes)[0]

predictedSchedule = model.predict(np.array([dataX]))
schedule = decodeData(predictedSchedule[0], max_day, max_pair)

schedules = set()
for i in range(len(schedule)):
    day_week = schedule[i][0]
    number_pair = schedule[i][1]
    id_class = classes["id_class"][i]
    id_audience = classes["id_audience"][i]
    pair_type = classes["pair_type"][i]
    sched = {'day_week': int(day_week), 'number_pair': int(number_pair),
             'id_class': int(id_class),  'id_audience': int(id_audience), 'pair_type':
             int(pair_type)}
    schedules.add(json.dumps(sched))
schedules = list(map(lambda x: json.loads(x), schedules))

with open(resultFile, 'w') as f:
    json.dump({"schedules": schedules}, f)
