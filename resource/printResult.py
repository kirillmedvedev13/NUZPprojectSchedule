import pandas
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit


def linear_function(x, a, b):
    return a * x + b


def func(x, a,degree=4):
    return a/(x**degree)


excelData = pandas.read_excel("Tests.xlsx")
arrTs = []
arrFs = []
arrTf = []
arrFf = []
ts = []
Fs = []
tf = []
Ff = []
n = 3
for index, row in excelData.iterrows():
    if (index+1) % 4 == 0:
        ts = sum(ts)/n
        tf = sum(tf)/n
        Fs = sum(Fs)/n
        Ff = sum(Ff)/n
        arrFf.append(Ff)
        arrFs.append(Fs)
        arrTf.append(tf)
        arrTs.append(ts)
        ts = []
        Fs = []
        tf = []
        Ff = []
    else:
        ts.append(row["ts"])
        Fs.append(row["Fs"])
        tf.append(row["tf"])
        Ff.append(row["Ff"])

arrX = []
arrY = []
degree = 50
for i in range(0, len(arrTf)):
     """ params, covariance = curve_fit(
        func, [arrFs[i], arrFf[i]], [arrTs[i], arrTf[i]])
     a_approx = params
     x_fit = np.linspace(2, arrTf[i], 10000)
     y_fit = func(x_fit,a_approx)  
     coefficients = np.polyfit([arrTs[i], arrTf[i]],[arrFs[i], arrFf[i]],degree)
     polynomial = np.poly1d(coefficients)
     x_fit = np.linspace(arrTs[i], arrTf[i], 100)
     y_fit = polynomial(x_fit) """
     
     arrX.append(x_fit)
     arrY.append(y_fit)


for i in range(0, len(arrX)):
    plt.plot(arrX[i], arrY[i], label="Test"+str(i+1))

plt.xlabel('X')
plt.ylabel('Y')
plt.title('Аппроксимация данных')
plt.legend()
plt.grid(True)
plt.show()
