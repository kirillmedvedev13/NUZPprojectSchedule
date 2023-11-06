import fs, { readFileSync } from "fs";
import { __DirectiveLocation } from "graphql";
import SpawnChild from "../Service/SpawnChild.js";
import path from "path";
import GetDataFromDB from "../Service/GetDataFromDB.js";
import GetBaseSchedule from "../Service/GetBaseSchedule.js";
import db from "../../database.js";

export const RUN_IMEACPP = async (id_cathedra, name_algorithm) => {
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

    let base_schedule = await GetBaseSchedule(id_cathedra);
    let jsonData = JSON.stringify({
      max_day,
      max_pair,
      params,
      base_schedule,
      recommended_schedules,
      classes,
      general_values,
      audiences,
    });

    let pathToAlgorithm = path.resolve(
      "./Algorithms/IslandModelEvolutionAlgorithmCPP/run_algorithm.exe"
    );
    let pathToData = path.resolve(
      "./Algorithms/IslandModelEvolutionAlgorithmCPP/"
    );
    let pathToSA = path.resolve(
      "./Algorithms/SimpleAlgorithmCPP/run_algorithm.exe"
    );
    fs.writeFileSync(pathToData + "/data.json", jsonData, (err) => {
      if (err) console.log(err);
    });
    let code;
    if (params["type_initialization"] == "simple_algorithm") {
      code = await SpawnChild(pathToAlgorithm, [pathToData, pathToSA]);
    } else {
      code = await SpawnChild(pathToAlgorithm, [pathToData]);
    }

    if (code === 0) {
      let res = readFileSync(pathToData + "/result.json");
      res = JSON.parse(res);
      let bestPopulation = res.bestPopulation;
      let results = res.result;
      let results_value = JSON.stringify(results);
      let params_value = JSON.stringify(params);
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
    } else {
      throw `Error code - ${code}`;
    }
  } catch (err) {
    console.log(err);
  }
};
