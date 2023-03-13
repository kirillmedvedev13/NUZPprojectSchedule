from keras.utils import pad_sequences
from os import listdir
from os.path import join
from sklearn.preprocessing import LabelEncoder
from numpy import where, zeros
from pandas import options, read_csv

options.mode.chained_assignment = None


def decodeData(schedule, day_week, number_pair):
    newData = []
    for clas in schedule:
        maxEl = max(clas)
        index = where(maxEl == clas)[0][0]
        dw = index // day_week+1
        npair = index % day_week+1
        newData.append([dw, npair])
    return newData


def encodeData(data, day_week, number_pair):
    newData = []
    for [day, number] in data.values:
        tempArr = zeros((day_week*number_pair))
        tempArr[(day-1)*number_pair + number-1] = 1
        newData.append(tempArr)
    return newData


def labelEncode(data):
    encoders = {}
    keys = ["id_class", "id_audience", "id_teacher",
            "id_group", "pair_type", "id_type_class"]
    for key in keys:
        newEncoder = LabelEncoder()
        data[key] = newEncoder.fit_transform(data[key])
        encoders[key] = newEncoder
    return [data, encoders]


def labelDecode(data, encoders):
    for [key, encoder] in encoders:
        data[key] = encoder.inverse_transform(data[key])
    return data


"""завантаження вибірки та кодування"""


def LoadData(dataPath, day_week, number_pair):
    dataX = []
    dataY = []
    for file in listdir(dataPath):
        fileData = read_csv(join(dataPath, file))
        fileDataX = fileData[["pair_type", "id_class",
                              "id_type_class", "id_audience", "id_teacher", "id_group"]]
        fileDataY = fileData[["day_week", "number_pair"]]

        fileDataX = labelEncode(fileDataX)[0]
        fileDataY = encodeData(fileDataY, day_week, number_pair)

        dataX.append(fileDataX)
        dataY.append(fileDataY)

    return [dataX, dataY]


def DataProcessing(dataPath, day_week, number_pair):
    dataX, dataY = LoadData(dataPath, day_week, number_pair)

    dataX = pad_sequences(dataX, padding='post')
    dataY = pad_sequences(dataY, padding='post')

    return [dataX, dataY]
