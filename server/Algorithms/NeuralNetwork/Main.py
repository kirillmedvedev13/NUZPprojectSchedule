from os import listdir
from os.path import join
import numpy as np
import pandas as pd
from keras.utils import to_categorical
from keras.models import Sequential
from keras.layers import LSTM, Dense

day_week = 6
number_pair = 7

mainDir = "D://PROJECT SCHEDULE//Project//NUZPprojectSchedule//server//Algorithms//NeuralNetwork//DatasetSchedulesCSV"
dataTrainX = []
dataTrainY = []
for file in listdir(mainDir):
    fileData = pd.read_csv(join(mainDir,file))
    fileDataX = to_categorical(fileData[["pair_type","id_class","id_type_class","id_audience","id_teacher","id_group"]])
    fileDataY = to_categorical(fileData[["day_week","number_pair"]])
    dataTrainX.append(fileDataX)
    dataTrainY.append(fileDataY)

dataTestX = dataTrainX.pop()
dataTestY = dataTrainY.pop()
    
model = Sequential()
model.add(LSTM(day_week*number_pair, input_shape=(None, 6)))
model.add(Dense(2, activation='sigmoid'))
model.compile(optimizer='adam', loss='binary_crossentropy')

model.compile(optimizer='adam',
              loss='mse',
              metrics=['mae'])


model.fit(dataTrainX,dataTrainY,epochs=50, batch_size=1)


