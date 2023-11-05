import os
import json
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.nonparametric.smoothers_lowess import lowess


# dir = "\\server\\Algorithms\\EvolutionAlgorithmsCPP\\"
# dir = "\\server\\Algorithms\\IslandModelEvolutionAlgorithmCPP\\"
# dir = "\\server\\Algorithms\\SimulatedAnnealingAlgorithmCPP\\"
dir = "\\server\\Algorithms\\TabuSearchAlgorithmCPP\\"
dir_result = os.getcwd() + dir + "RESULTS"
arr_results = []
arr_files = os.listdir(dir_result)
arr_numbers = []
for file_result in arr_files:
    number = int(
        ''.join([symbol for symbol in file_result if symbol.isdigit()]))
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

    # Параметр frac определяет ширину окна сглаживания
    smoothed = lowess(y_array, x_array, frac=0.3)
    arr_x.append(smoothed[:, 0])
    arr_y.append(smoothed[:, 1])

plt.style.use('bmh')
for i in range(0, len(arr_results)):
    plt.plot(arr_x[i], arr_y[i], label="Тест №"+str(i+1))
plt.xlabel('Час, с', fontsize=14)
plt.ylabel('Фітнес', fontsize=14)
# plt.title('Графік зміни фітнесу протягом часу для Генетичного алгоритму', fontsize=14)
# plt.title('Графік зміни фітнесу протягом часу для Острівної моделі ГА', fontsize=14)
# plt.title('Графік зміни фітнесу протягом часу для Алгоритму імітації відпалу', fontsize=14)
plt.title('Графік зміни фітнесу протягом часу для Алгоритму пошуку Табу', fontsize=14)
plt.legend()
plt.grid(True)

plt.show()
