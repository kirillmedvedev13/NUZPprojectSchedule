import MessageType from "../../Schema/TypeDefs/MessageType.js"
import { spawn } from "child_process";
import fs from "fs";
import { GraphQLInt, __DirectiveLocation } from "graphql";
import SpawnChild from "./SpawnChild.js";
import path from "path";
import GetDataFromDB from "../Service/GetDataFromDB.js";
import ParseScheduleFromDB from "../Service/ParseScheduleFromDB.js"

export const RUN_EACPP = {
  type: MessageType,
  args: {
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { id_cathedra }) {
    let {
      max_day,
      max_pair,
      classes,
      recommended_schedules,
      evolution_values,
      general_values,
      results
    } = await GetDataFromDB(id_cathedra);

    let base_schedule = await ParseScheduleFromDB(id_cathedra);

    let jsonData = JSON.stringify({
      max_day,
      max_pair,
      evolution_values,
      base_schedule,
      recommended_schedules,
      classes,
      general_values
    });

    let fileName = path.resolve("./EvalutionAlgorithms/EvalutionAlgoritmCpp/VSProject/x64/Debug/EvalutionAlgorithmCpp.exe");
    let fileData = path.resolve("./EvalutionAlgorithms/EvalutionAlgoritmCpp/")

    fs.writeFile(fileData + "/data.json", jsonData, (err) => {
      if (err)
        console.log(err)
    })

    SpawnChild(fileName).then((data) => {
      console.log(data);
    });
  },
};
