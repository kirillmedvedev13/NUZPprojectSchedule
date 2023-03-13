from keras.models import Sequential
from keras.layers import LSTM, Dense

"""визначити модель мережі"""


def DefineModel(day_week, number_pair, n_features, activation, loss, optimizer, metrics):
    model = Sequential()

    model.add(LSTM(day_week*number_pair, dropout=0.2,
                   return_sequences=True, input_shape=(None, n_features)))
    model.add(Dense(day_week*number_pair, activation=activation))

    model.compile(loss=loss,
                  optimizer=optimizer, metrics=metrics)
    return model
