import MessageType from "../../Schema/TypeDefs/MessageType.js"
import { exec, execFile, spawnSync } from "child_process";
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
      audiences,
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
      general_values,
      audiences
    });

    let fileName = path.resolve("./Algorithms/EvalutionAlgorithmCpp/build-EvalutionAlgorithmCpp-Desktop_Qt_6_4_0_MinGW_64_bit-Debug/debug/EvalutionAlgorithmCpp.exe");
    let fileData = path.resolve("./Algorithms/EvalutionAlgorithmCpp/build-EvalutionAlgorithmCpp-Desktop_Qt_6_4_0_MinGW_64_bit-Debug")
    fs.writeFileSync(fileData + "/data.json", jsonData, "utf-8", (err) => {
      if (err)
        console.log(err)
    })

    let code = await SpawnChild(fileName);
    console.log(code)
  },
};
