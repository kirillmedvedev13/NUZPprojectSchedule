from sklearn.model_selection import train_test_split


def TrainAndTestModel(model, dataX, dataY, test_size, epochs, batch_size, verbose):

    dataTrainX, dataTestX, dataTrainY, dataTestY = train_test_split(
        dataX, dataY, test_size=test_size, random_state=1)

    model.fit(dataTrainX, dataTrainY, epochs=epochs,
              batch_size=batch_size, verbose=verbose)

    loss, acc = model.evaluate(dataTestX, dataTestY,
                               batch_size=batch_size, verbose=verbose)

    print("Test loss: ", loss, ", Test acc:", acc*100)
    return [loss, acc]
