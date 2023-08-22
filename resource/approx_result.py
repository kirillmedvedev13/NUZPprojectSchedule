import os
import json
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.nonparametric.smoothers_lowess import lowess


dir = "\\server\\Algorithms\\EvolutionAlgorithmsCPP\\"
dir_result = os.getcwd() + dir + "RESULTS"
arr_results = []
arr_files = os.listdir(dir_result)
arr_numbers = []
for file_result in arr_files:
    number = int(''.join([symbol for symbol in file_result if symbol.isdigit()]))
    arr_numbers.append(number)
start = 1
step = 3
for number_file in range(1, max(arr_numbers), step):
    temp_arr = []
    for i in range(0, step):
        with open(dir_result + "\\result" + str(number_file + i) + ".json", 'r') as file:
            data = json.load(file)
            for pair in data["result"]:
                temp_arr.append([pair[0]/1000, pair[1]])
    arr_results.append(temp_arr)

degree = 50
points = 1000
arr_x = []
arr_y = []
for results in arr_results:
    x_array = [x[0] for x in results]
    y_array = [y[1] for y in results]
    
    # coefficients = np.polyfit(x_array, y_array, degree)
    # polynomial = np.poly1d(coefficients)
    # x_fit = np.linspace(min(x_array), max(x_array), points)
    # y_fit = polynomial(x_fit)
    # arr_x.append(x_fit)
    # arr_y.append(y_fit)
    
    smoothed = lowess(y_array, x_array, frac=0.3)  # Параметр frac определяет ширину окна сглаживания
    arr_x.append(smoothed[:,0])
    arr_y.append(smoothed[:,1])



for i in range(0,len(arr_results)):
    plt.plot(arr_x[i], arr_y[i], label="Test"+str(i+1))
plt.xlabel('Час, с')
plt.ylabel('Фітнес')
plt.title('Генетичний алгоритм')
plt.legend()
plt.grid(True)
plt.show()