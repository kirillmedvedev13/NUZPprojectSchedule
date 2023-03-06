from os import listdir
from os.path import join
from copy import copy
import pandas
import json


def getLastIndex(dir):
    index = 0
    for file in listdir(dir):
        index += 1
    return index


inputDir = "D://PROJECT SCHEDULE//Project//NUZPprojectSchedule//server//Algorithms//NeuralNetwork//DatasetSchedulesJSON"
saveDir = "D://PROJECT SCHEDULE//Project//NUZPprojectSchedule//server//Algorithms//NeuralNetwork//DatasetSchedulesCSV"


lastIndex = getLastIndex(saveDir)
for file in listdir(inputDir):
    filePath = join(inputDir, file)
    schedules = []
    with open(filePath, 'r') as f:
        data = json.loads(f.read())
        for sched in data:
            newSched = {}
            newSched['day_week'] = sched["day_week"]
            newSched["number_pair"] = sched["number_pair"]
            newSched["pair_type"] = sched["pair_type"]
            newSched["id_class"] = sched["class"]["id"]
            newSched["id_type_class"] = sched["class"]["type_class"]["id"]
            newSched["id_audience"] = sched["audience"]["id"]
            groups = sched["class"]["assigned_groups"]
            teachers = sched["class"]["assigned_teachers"]
            for teacher in teachers:
                for group in groups:
                    copySched = copy(newSched)
                    copySched["id_teacher"] = teacher["teacher"]["id"]
                    copySched["id_group"] = group["group"]["id"]
                    schedules.append(copySched)

        schedules = sorted(schedules, key=lambda sch: (
            sch["day_week"], sch["number_pair"], sch["pair_type"], sch["id_class"]))
        pandas.DataFrame.from_records(schedules).to_csv(
            saveDir+"//schedules"+str(lastIndex)+".csv", index=False)
        lastIndex += 1


'''for i in range(len(schedulesJSON)):

    for schedule in schedulesJSON[i]:
        tempSched = []
        for sched in schedule:
            clas = classesDict[i][sched["id_class"]]
            newSched = {}
            newSched["day_week"] = sched["day_week"]
            newSched["number_pair"] = sched["number_pair"]
            newSched["pair_type"] = sched["pair_type"]
            newSched["id_class"] = sched["id_class"]
            newSched["id_type_class"] = clas["id_type_class"]
            newSched["id_audience"] = sched["id_audience"]
            id_teachers = clas["assigned_teachers"]
            id_groups = clas["assigned_groups"]
            for teach in id_teachers:
                for group in id_groups:
                    copSched = copy(newSched)
                    copSched["id_teacher"] = teach
                    copSched["id_group"] = group
                    tempSched.append(copSched)

        tempSched = sorted(tempSched, key=lambda sch: (
            sch["day_week"], sch["number_pair"], sch["pair_type"], sch["id_class"]))
        pandas.DataFrame.from_records(tempSched).to_csv(
            saveDir+"//schedules"+str(i)+str(schedulesJSON[i].index(schedule))+".csv", index=False)'''
