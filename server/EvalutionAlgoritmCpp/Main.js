import db from "../database.js";
import MessageType from "../Schema/TypeDefs/MessageType.js";
import { spawn } from "child_process";
import fs from "fs";
import { GraphQLInt, __DirectiveLocation } from "graphql";
import { Op } from "sequelize";
import ParseScheduleFromDB from "../EvalutionAlghoritm2/ParseScheduleFromDB.js";
import SpawnChild from "./SpawnChild.js";
import { fileURLToPath } from "url";
import path from "path";

export const RUN_EA = {
  type: MessageType,
  args: {
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { id_cathedra }) {
    const info = await db.info.findOne();
    let FilterCathedra = {};
    if (id_cathedra) {
      FilterCathedra = {
        id_cathedra: {
          [Op.eq]: id_cathedra,
        },
      };
    }
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
            where: FilterCathedra,
          },
        },
      ],
    });
    let recommended_schedules = await db.recommended_schedule.findAll();
    let audiences = await db.audience.findAll({
      include: {
        model: db.assigned_audience,
      },
    });
    let groups = await db.group.findAll();
    let teachers = await db.teacher.findAll({
      include: {
        model: db.assigned_teacher,
      },
    });
    let base_schedule = null;
    if (id_cathedra) {
      let scheduleForGroups = new Map();
      let scheduleForTeachers = new Map();
      let scheduleForAudiences = new Map();
      base_schedule = {
        scheduleForGroups,
        scheduleForTeachers,
        scheduleForAudiences,
      };
      await ParseScheduleFromDB(base_schedule);
    }
    recommended_schedules = recommended_schedules.map((rs) => rs.toJSON());
    teachers = teachers.map((t) => t.toJSON());
    groups = groups.map((g) => g.toJSON());
    audiences = audiences.map((a) => a.toJSON());
    classes = classes.map((c) => c.toJSON());
    let type_select = "tournament";
    let dataStr = JSON.stringify({
      info,
      id_cathedra,
      type_select,
      base_schedule,
      recommended_schedules,
      teachers,
      groups,
      classes,
      audiences,
    });

    let fileName = path.resolve(
      "./EvalutionAlgoritmCpp/VSProject/x64/Debug/",
      "VSProject.exe"
    );
    let dataFileName = path.resolve("./EvalutionAlgoritmCpp/data.json");
    fs.writeFileSync(dataFileName, dataStr, "utf8");
    /*let arrRes = [];
    let result = spawn(fileName, [params]);
    result.stdout.on("data", (data) => {
      arrRes.push(data.toString());
      console.log(data.toString());
    });

    result.stderr.on("data", (data) => {
      console.log("ERROR" + data.toString());
    });

    result.on("exit", (code) => {
      console.log("child process exited with code " + code.toString());
      console.log(arrRes.pop());
      console.log("End");
      return { successful: false, message: `Some error` };
    });*/
    SpawnChild(fileName, dataFileName).then((data) => {
      console.log(data);
    });
  },
};
