import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";
import SpawnChild from "../../Algorithms/Service/SpawnChild.js";
import fs from "fs";
import path from "path";

export const CalcFitness = {
  type: MessageType,
  async resolve(parent) {
    const info = await db.info.findOne();
    const general_values = JSON.parse(info.dataValues.general_values);

    const max_day = info.dataValues.max_day;
    const max_pair = info.dataValues.max_pair;

    let schedules = await db.schedule.findAll();

    let classes = await db.class.findAll({
      include: [
        {
          model: db.assigned_group,
          include: {
            model: db.group,
          },
        },
        {
          model: db.assigned_teacher,
        },
        {
          model: db.recommended_audience,
        },
        {
          model: db.recommended_schedule,
        },
        {
          model: db.assigned_discipline,
          required: true,
          include: {
            model: db.specialty,
            required: true,
          },
        },
      ],
    });

    let audiences = await db.audience.findAll({
      include: {
        model: db.assigned_audience,
      },
    });

    schedules = schedules.map((s) => s.toJSON());
    classes = classes.map((c) => c.toJSON());
    audiences = audiences.map((a) => a.toJSON());

    let jsonData = JSON.stringify({
      max_day,
      max_pair,
      classes,
      general_values,
      audiences,
      schedules
    });

    let pathToAlgorithm = path.resolve(
      ".\\Algorithms\\CalcFitness\\CalcFitness.exe"
    );
    let pathToData = path.resolve(".\\Algorithms\\CalcFitness/");
    fs.writeFileSync(pathToData + "\\data.json", jsonData, (err) => {
      if (err) console.log(err);
    });

    const code = await SpawnChild(pathToAlgorithm, [pathToData]);
    if (code == 0) {
      let fitnessValue = fs.readFileSync(pathToData + "\\result.json");
      fitnessValue = JSON.parse(fitnessValue);
      fitnessValue = fitnessValue.fitnessValue;

      const res = await db.info.update(
        { fitness_value: JSON.stringify(fitnessValue) },
        { where: { id: 1 } }
      );
      return res[0]
        ? {
            successful: true,
            message: "Фтнес-значення пораховано успішно",
          }
        : { successful: false, message: "Помилка при рахуванні значення" };
    } else {
      return { successful: false, message: "Помилка при рахуванні значення" };
    }
  },
};
