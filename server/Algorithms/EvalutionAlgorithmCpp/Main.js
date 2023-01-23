import MessageType from "../../Schema/TypeDefs/MessageType.js";
import { exec, execFile, spawnSync } from "child_process";
import fs, { readFileSync } from "fs";
import { GraphQLInt, __DirectiveLocation } from "graphql";
import SpawnChild from "./SpawnChild.js";
import path from "path";
import GetDataFromDB from "../Service/GetDataFromDB.js";
import ParseScheduleFromDB from "../Service/ParseScheduleFromDB.js";
import db from "../../database.js";

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

      const code = await SpawnChild(fileName, fileData);
      if (code === 0) {
        let res = readFileSync(
          "./Algorithms/EvalutionAlgorithmCpp/result.json"
        );
        res = JSON.parse(res);
        let bestPopulation = res.bestPopulation;
        let evolution_algorithmCPP = res.evolution_algorithmCPP;
        results.evolution_algorithmCPP = evolution_algorithmCPP;
        results = JSON.stringify(results);
        await db.algorithm.update(
          { results },
          { where: { name: "evalution_algorithmCPP" } }
        );
        let isBulk = await db.schedule.bulkCreate(bestPopulation);
        if (isBulk)
          return {
            successful: true,
            message: `Total fitness: ${
              bestPopulation[bestPopulation.length - 1]
            }`,
          };
        else return { successful: false, message: `Some error` };
      }
    } catch (err) {
      console.log(err);
    }
  },
};
