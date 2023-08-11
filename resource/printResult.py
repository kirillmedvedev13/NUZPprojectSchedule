import pandas
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit

def linear_function(x, a, b):
    return a * x + b

excelData = pandas.read_excel("Tests.xlsx")
arrTf = []
arrFf = []
tf=[]
Ff=[]
for index,row in excelData.iterrows():
    if (index+1)%4 == 0 :
        arrTf.append(tf)
        arrFf.append(Ff)
        tf=[]
        Ff=[]
    else:
        tf.append(row["tf"])
        Ff.append(row["Ff"])

arrX = []
arrY = []
degree = 8
for i in range(0,len(arrTf)):
    """params, covariance = curve_fit(linear_function,arrTf[i], arrFf[i])
    a_approx, b_approx = params
    x_fit = np.linspace(min(arrTf[i]), max(arrFf[i]), 100)
    y_fit = linear_function(x_fit, a_approx, b_approx)
    arrX.append(x_fit)
    arrY.append(y_fit)"""
    x_fit = np.linspace(min(arrTf[i]), max(arrFf[i]), 100)
    coefficients = np.polyfit(arrTf[i], arrFf[i],degree)
    polynomial = np.poly1d(coefficients)
    print(polynomial)
    arrY.append(polynomial(x_fit))
    arrX.append(x_fit)


for i in range(0,len(arrX)):
    plt.plot(arrX[i], arrY[i], label="Test"+str(i+1))
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Аппроксимация данных')
plt.legend()
plt.grid(True)
plt.show()