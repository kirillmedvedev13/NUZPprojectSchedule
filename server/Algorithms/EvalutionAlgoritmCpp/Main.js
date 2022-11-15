import MessageType from "../Schema/TypeDefs/MessageType.js";
import { spawn } from "child_process";
import fs from "fs";
import { GraphQLInt, __DirectiveLocation } from "graphql";
import { Op } from "sequelize";
import ParseScheduleFromDB from "../EvalutionAlghoritm2/ParseScheduleFromDB.js";
import SpawnChild from "./SpawnChild.js";
import { fileURLToPath } from "url";
import path from "path";
import GetDataFromDB from "../Algorithms/Service/GetDataFromDB.js";
import { json } from "body-parser";

export const RUN_EA = {
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

    let jsonData = JSON.stringify({
      max_day,
      max_pair,
      evolution_values,
      base_schedule,
      recommended_schedules,
      classes,
      general_values
    });

    let fileName = path.resolve("./EvalutionAlgoritmCpp/x64/Debug/EvalutionAlgorithmCpp.exe");

    fs.writeFile("data.json", jsonData, (err) => {
      if (err)
        console.log(err)
    })

    SpawnChild(fileName, dataFileName).then((data) => {
      console.log(data);
    });
  },
};
