from os import listdir, remove
from os.path import join
from copy import copy
from pandas import DataFrame
from json import loads


def getLastIndex(dir):
    index = 0
    for file in listdir(dir):
        index += 1
    return index


"""ковертувати всі файли json в csv"""


def ConvertJSONtoCSV(jsonDir, csvDir):
    lastIndex = getLastIndex(csvDir)
    for file in listdir(jsonDir):
        filePath = join(jsonDir, file)
        schedules = []
        with open(filePath, 'r') as f:
            data = loads(f.read())
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
        DataFrame.from_records(schedules).to_csv(
            csvDir+"//schedules"+str(lastIndex)+".csv", index=False)
        lastIndex += 1
        remove(filePath)
