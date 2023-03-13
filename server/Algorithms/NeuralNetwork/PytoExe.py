import os
import subprocess

rootDir = os.path.dirname(os.path.abspath(__file__))
fileName = "PredictSchedule.py"
command = "pyinstaller --onefile \"" + os.path.join(rootDir, fileName)+"\""

try:
    subprocess.check_call(command, shell=True)
    print("Виконано!")

except subprocess.CalledProcessError as e:
    print("Помилка:", e.returncode, e.output)

# Повідомлення про завершення процесу
input("Натисніть Enter для виходу...")
