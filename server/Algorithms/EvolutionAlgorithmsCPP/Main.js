import { exec, execFile, spawnSync } from "child_process";
import fs, { readFileSync } from "fs";
import { __DirectiveLocation } from "graphql";
import SpawnChild from "./SpawnChild.js";
import path from "path";
import GetDataFromDB from "../Service/GetDataFromDB.js";
import GetBaseSchedule from "../Service/GetBaseSchedule.js";
import db from "../../database.js";

export const RUN_EACPP = async (id_cathedra, name_algorithm) => {
  try {
    let {
      max_day,
      max_pair,
      classes,
      recommended_schedules,
      general_values,
      audiences,
      params,
    } = await GetDataFromDB(id_cathedra, name_algorithm);
    let results = [];

    let base_schedule = await GetBaseSchedule(id_cathedra);
    let params_obj = {};
    for (let p of params) {
      params_obj[p.name] = p.value;
    }
    let jsonData = JSON.stringify({
      max_day,
      max_pair,
      params: params_obj,
      base_schedule,
      recommended_schedules,
      classes,
      general_values,
      audiences,
    });

    let fileName =
      name_algorithm === "evolution_algorithmCPP"
        ? path.resolve(
            "./Algorithms/EvolutionAlgorithmsCpp/ClassicEvolutionAlgorithm.exe"
          )
        : path.resolve(
            "./Algorithms/EvolutionAlgorithmsCpp/IslandModelEvolutionAlgorithm.exe"
          );
    let fileData = path.resolve("./Algorithms/EvolutionAlgorithmsCpp/");
    fs.writeFileSync(fileData + "/data.json", jsonData, (err) => {
      if (err) console.log(err);
    });

    const code = await SpawnChild(fileName, fileData);
    if (code === 0) {
      let res = readFileSync("./Algorithms/EvolutionAlgorithmsCpp/result.json");
      res = JSON.parse(res);
      let bestPopulation = res.bestPopulation;
      let results = res.result;
      let results_value = JSON.stringify(results);
      let params_value = JSON.stringify(params_obj);
      let resdb = await db.results_algorithm.findOne({
        where: { params_value, name_algorithm },
      });
      if (resdb)
        await db.results_algorithm.update(
          { results: results_value },
          { where: { params_value } }
        );
      else
        await db.results_algorithm.create({
          params_value,
          name_algorithm,
          results: results_value,
        });
      let isBulk = await db.schedule.bulkCreate(bestPopulation);
      if (isBulk)
        return {
          successful: true,
          message: `Фітнес - ${results[results.length - 1][1]}`,
        };
      else return { successful: false, message: `Помилка` };
    }
  } catch (err) {
    console.log(err);
  }
};