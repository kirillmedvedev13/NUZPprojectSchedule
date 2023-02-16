import db from "../../database.js";
import { Op } from "sequelize";

export default async function GetDataFromDB(
  id_cathedra = null,
  name_algorithm
) {
  const info = await db.info.findOne();
  const max_day = info.dataValues.max_day;
  const max_pair = info.dataValues.max_pair;
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
  recommended_schedules = recommended_schedules.map((rs) => rs.toJSON());
  teachers = teachers.map((t) => t.toJSON());
  groups = groups.map((g) => g.toJSON());
  audiences = audiences.map((a) => a.toJSON());
  classes = classes.map((c) => c.toJSON());

  let algorithm = await db.algorithm.findOne({
    where: {
      name: name_algorithm,
    },
  });

  if (!algorithm) {
    throw {
      successful: true,
      message: "Не знайдено алгоритм",
    };
  }

  let params = JSON.parse(algorithm.params);
  let temp_params = {};
  for (let p of params) {
    temp_params[p.name] = p.value;
  }
  params = temp_params;
  return {
    max_day,
    max_pair,
    classes,
    recommended_schedules,
    audiences,
    groups,
    teachers,
    general_values: JSON.parse(info.dataValues.general_values),
    params,
  };
}
