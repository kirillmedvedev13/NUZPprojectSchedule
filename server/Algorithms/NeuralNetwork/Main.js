import GetIdAudienceForClass from "../Service/GetIdAudienceForClass.js";
import GetPairTypeForClass from "../Service/GetPairTypeForClass.js";
import GetDataFromDB from "../Service/GetDataFromDB.js";
import SpawnChild from "../Service/SpawnChild.js";
import GetBaseSchedule from "../Service/GetBaseSchedule.js";
import fs, { readFileSync } from "fs";
import path from "path";
import db from "../../database.js";

export const RUN_LSTM = async (id_cathedra, name_algorithm) => {
  try {
    let { max_day, max_pair, classes, audiences } = await GetDataFromDB(
      id_cathedra,
      name_algorithm
    );
    let newClasses = [];
    for (let clas of classes) {
      let pair_types = GetPairTypeForClass(clas);
      for (let pair_type of pair_types) {
        let newClass = {};
        let id_audience = GetIdAudienceForClass(clas, audiences);
        newClass["pair_type"] = pair_type;
        newClass["id_audience"] = id_audience;
        newClass["class"] = clas;
        newClasses.push(newClass);
      }
    }
    await GetBaseSchedule(id_cathedra);
    let jsonData = JSON.stringify({ max_day, max_pair, classes: newClasses });
    let fileName = path.resolve(
      "./Algorithms/NeuralNetwork/PredictSchedule.exe"
    );
    let fileData = path.resolve("./Algorithms/NeuralNetwork/");
    fs.writeFileSync(fileData + "/data.json", jsonData, (err) => {
      if (err) console.log(err);
    });
    const code = await SpawnChild(fileName, [fileData]);
    if (code === 0) {
      let res = readFileSync("./Algorithms/NeuralNetwork/result.json");
      res = JSON.parse(res);
      let schedules = res.schedules;
      /*let results = res.result;
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
        });*/
      let isBulk = await db.schedule.bulkCreate(schedules);
      if (isBulk)
        return {
          successful: true,
          message: `Розклад оновлено`,
        };
      else return { successful: false, message: `Помилка` };
    }
  } catch (err) {
    console.log(err);
  }
};
