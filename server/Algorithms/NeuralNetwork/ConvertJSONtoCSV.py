from os import listdir
from os.path import join
from copy import copy
import pandas
import json


def NormalizeClasses(classesJSON):
    classesDict=[]

    for classes in classesJSON:
        temp = {}
        for clas in classes:
            cl = {}
            cl["id"] = clas["id"]
            cl["id_type_class"] = clas["id_type_class"]
            cl["id_assigned_discipline"] = clas["id_assigned_discipline"]
            assigned_groups = []
            for ag in clas["assigned_groups"]:
                assigned_groups.append(ag["id_group"])
            cl["assigned_groups"] = assigned_groups
            assigned_teachers = []
            for at in clas["assigned_teachers"]:
                assigned_teachers.append(at["id_teacher"])
            cl["assigned_teachers"]=assigned_teachers
            temp[cl["id"]]=cl
        classesDict.append(temp)
        """dataFrame = pandas.DataFrame.from_records(temp)
        dataFrame.to_csv("classes.csv")
        print(dataFrame)"""
    return classesDict

mainDir = "D://PROJECT SCHEDULE//Project//NUZPprojectSchedule//server//Algorithms//NeuralNetwork//DatasetSchedulesJSON"
classesJSON = []
schedulesJSON = []
for dir in listdir(mainDir):
    classSchedules = []
    dirPath = join(mainDir,dir)
    for file in listdir(dirPath):
        filePath = join(dirPath,file)
        with open(filePath,'r') as f:
            data = json.loads(f.read())
            if "classes" in file:
                classesJSON.append(data)
            else:
                classSchedules.append(data)
    schedulesJSON.append(classSchedules)

classesDict = NormalizeClasses(classesJSON)

saveDir = "D://PROJECT SCHEDULE//Project//NUZPprojectSchedule//server//Algorithms//NeuralNetwork//DatasetSchedulesCSV"


for i in range(len(schedulesJSON)):
    
    for schedule in schedulesJSON[i]:
        tempSched=[]
        for sched in schedule:
            clas = classesDict[i][sched["id_class"]]
            newSched = {}
            newSched["day_week"] = sched["day_week"]
            newSched["number_pair"] = sched["number_pair"]
            newSched["pair_type"] = sched["pair_type"]
            newSched["id_class"] =sched["id_class"]
            newSched["id_type_class"]= clas["id_type_class"]
            newSched["id_audience"] = sched["id_audience"]
            id_teachers =clas["assigned_teachers"]
            id_groups = clas["assigned_groups"]
            for teach in id_teachers:
                for group in id_groups:
                    copSched = copy (newSched)
                    copSched["id_teacher"] = teach
                    copSched["id_group"] = group
                    tempSched.append(copSched)
        
        tempSched = sorted(tempSched,key=lambda sch: (sch["day_week"],sch["number_pair"],sch["pair_type"],sch["id_class"]))    
        pandas.DataFrame.from_records(tempSched).to_csv(saveDir+"//schedules"+str(i)+str(schedulesJSON[i].index(schedule))+".csv",index=False)

       


