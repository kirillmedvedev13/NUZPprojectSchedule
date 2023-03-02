from os import listdir
from os.path import join
import numpy as np
import pandas as pd
from keras.utils import to_categorical
from keras.models import Sequential
from keras.layers import LSTM, Dense
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.model_selection import train_test_split

def decodeData(schedule,day_week,number_pair):
    newData = []
    for clas in schedule:
        maxEl = max(clas)
        index = np.where(maxEl==clas)[0][0]
        dw = index // day_week+1
        npair = index % day_week+1
        newData.append([dw,npair])
    return newData

def encodeData(data,day_week,number_pair):
    newData = []
    for list in data:
        newList = []
        for [day,nump] in list:
            tempArr = np.zeros((day_week*number_pair))
            tempArr[(day-1)*number_pair + nump-1]=1
            newList.append(tempArr)
        newData.append(newList)
    return np.array(newData)


        

day_week = 6
number_pair = 7
n_featuresX = 6
n_featuresY = 2


mainDir = "D://PROJECT SCHEDULE//Project//NUZPprojectSchedule//server//Algorithms//NeuralNetwork//DatasetSchedulesCSV"
dataX = []
dataY = []
for file in listdir(mainDir):
    fileData = pd.read_csv(join(mainDir,file))
    fileDataX = fileData[["pair_type","id_class","id_type_class","id_audience","id_teacher","id_group"]]
    fileDataY = fileData[["day_week","number_pair"]]
    dataX.append(fileDataX)
    dataY.append(fileDataY)

dataX =  pad_sequences(dataX, padding='post')
dataY =  pad_sequences(dataY, padding='post')
dataY = encodeData(dataY,day_week,number_pair)

dataTrainX, dataTestX, dataTrainY,dataTestY = train_test_split(dataX, dataY, test_size = 0.3, random_state = 1)
    
model = Sequential()
model.add(LSTM(day_week*number_pair,dropout=0.2,  return_sequences=True,input_shape=(None,n_featuresX)))
model.add(Dense(day_week*number_pair, activation='softmax'))

model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

history= model.fit(dataTrainX,dataTrainY,epochs=500,batch_size=1)

history.history

results = model.evaluate(dataTestX, dataTestY, batch_size=1)
print("test loss, test acc:", results)

predicted_timetable = model.predict(dataTestX[:1],)
schedule = decodeData(predicted_timetable[0],day_week,number_pair)
print(schedule)
