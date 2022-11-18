import MessageType from "../../Schema/TypeDefs/MessageType.js";
import { exec, execFile, spawnSync } from "child_process";
import fs, { readFileSync } from "fs";
import { GraphQLInt, __DirectiveLocation } from "graphql";
import SpawnChild from "./SpawnChild.js";
import path from "path";
import GetDataFromDB from "../Service/GetDataFromDB.js";
import ParseScheduleFromDB from "../Service/ParseScheduleFromDB.js";

export const RUN_EACPP = {
  type: MessageType,
  args: {
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { id_cathedra }) {
    try {
      let {
        max_day,
        max_pair,
        classes,
        recommended_schedules,
        evolution_values,
        general_values,
        audiences,
        results,
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
        audiences,
      });

      let fileName = path.resolve(
        "./Algorithms/EvalutionAlgorithmCpp/EvalutionAlgorithmCpp.exe"
      );
      let fileData = path.resolve("./Algorithms/EvalutionAlgorithmCpp/");
      fs.writeFileSync(fileData + "/data.json", jsonData, (err) => {
        if (err) console.log(err);
      });

      const promise = SpawnChild(fileName);
      promise.then((code) => {
        if (code === 0) {
          let res = readFileSync("./Algorithms/EvalutionAlgorithmCpp/result.json");
          res = JSON.parse(res);
          let bestPopulation = res.bestPopulation;
          let result = res.evolution_algorithmCPP;

        }
      })
    }
    catch (err) {
      console.log(err);
    }
  }
};
