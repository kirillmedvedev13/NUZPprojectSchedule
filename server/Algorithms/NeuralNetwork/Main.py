from os import listdir
from os.path import join
import numpy as np
import pandas as pd
from keras.utils import to_categorical
from keras.models import Sequential
from keras.layers import LSTM, Dense
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.model_selection import train_test_split

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

dataTrainX, dataTestX, dataTrainY,dataTestY = train_test_split(dataX, dataY, test_size = 0.2, random_state = 1)
    
model = Sequential()
model.add(LSTM(day_week*number_pair,  return_sequences=True,input_shape=(None,n_featuresX)))
model.add(Dense(n_featuresY, activation='linear'))

model.compile(loss='mean_squared_error', optimizer='adam', metrics=['accuracy'])

history= model.fit(dataTrainX,dataTrainY,epochs=100,batch_size=1)

history.history

results = model.evaluate(dataTestX, dataTestY, batch_size=1)
print("test loss, test acc:", results)

predicted_timetable = model.predict(dataTestX[:1],)
print(predicted_timetable)
