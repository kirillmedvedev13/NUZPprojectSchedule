import { GraphQLString, GraphQLInt } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const SET_CLASSES = {
  type: MessageType,
  args: {
    data: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { data, id_cathedra }) {
    const classes = JSON.parse(data).classes;
    const disciplines = await db.discipline.findAll({
      include: {
        model: db.assigned_discipline,
        required: true,
        include: {
          model: db.specialty,
          required: true,
        },
      },
    });
    let specialties = await db.specialty.findAll({});
    const teachers = await db.teacher.findAll();
    const groups = await db.group.findAll({
      include: {
        model: db.specialty,
        required: true,
      },
    });
    const audiences = await db.audience.findAll({
      include: {
        model: db.assigned_audience,
        required: true,
        include: {
          model: db.cathedra,
          required: true,
        },
      },
    });
    for (const clas of classes) {
      const date = new Date();
      let semester =
        Number(date.getFullYear().toString().charAt(3)) -
        Number(clas.groups[0].charAt(2)); // Год вступления, что бы узнать семестр для дисциплины
      if (semester < 0) {
        semester = 10 + semester;
      }
      if (date.getMonth() > 5 && date.getMonth() < 13) {
        semester++;
      }
      const code_spec = Number(clas.groups[0].charAt(0)); // первая цифра первой группы это код специальности
      const arr_disc = disciplines.filter((disc) => {
        return disc.dataValues.name === clas.discipline;
      });
      let id_assigned_discipline = null;
      arr_disc.forEach((disc) => {
        disc.assigned_disciplines.forEach((ad) => {
          // Если найдена в базе дисциплина за специальностью
          if (
            ad.dataValues.semester === semester &&
            ad.specialty.code === code_spec &&
            ad.specialty.id_cathedra === id_cathedra
          ) {
            id_assigned_discipline = ad.id;
          }
        });
      });
      if (!id_assigned_discipline) {
        // дисциплина за специальностью не найдена
        let id_spec = null;
        let id_disc = null;
        let new_disc = null;
        let new_spec = null;
        const arr_spec = specialties.filter(
          (spec) => spec.code === code_spec && spec.id_cathedra === id_cathedra
        );
        if (arr_spec.length) {
          //Если найдена в базе специальность за кафедрой
          id_spec = arr_spec[0].id;
        } else {
          // Специальность не найденна, её нужно создать
          new_spec = await db.specialty.create({
            name: "",
            id_cathedra,
            code: code_spec,
          });
          specialties.push(new_spec);
          id_spec = new_spec.id;
        }
        let disc = null;
        let index_disc = null;
        disciplines.filter((dis, index) => {
          if (dis.dataValues.name === clas.discipline) {
            disc = dis;
            index_disc = index;
            return true;
          } else {
            return false;
          }
        });
        if (disc) {
          // если в базе есть дисциплина с таким названием
          id_disc = disc.dataValues.id;
        } else {
          // Дисциплины в базе нет, её нужно создать
          new_disc = await db.discipline.create({ name: clas.discipline });
          id_disc = new_disc.dataValues.id;
        }
        let new_assigned_discipine = await db.assigned_discipline.create({
          id_specialty: id_spec,
          id_discipline: id_disc,
          semester,
        });
        id_assigned_discipline = new_assigned_discipine.id;
        if (new_spec) {
          // Если создана новая специальность, её нужно занести к закрепленным дисциплинам
          new_assigned_discipine.specialty = new_spec;
        } else {
          // Специальность уже есть в базе, её нужно вставить к закрепленным дисциплинам
          new_assigned_discipine.specialty = arr_spec[0];
        }
        if (new_disc) {
          //Если создана новая дисицплина, её нужно занести в массив дисциплин
          const temp = {
            ...new_disc.dataValues,
            assigned_disciplines: [new_assigned_discipine],
          };
          disciplines.push({
            ...new_disc,
            dataValues: temp,
            assigned_disciplines: [new_assigned_discipine],
          });
        } else {
          disciplines[index_disc].assigned_disciplines.push(
            new_assigned_discipine
          );
        }
      }
      // Поиск учитилей в бд
      const arr_teach = [];
      classes.teacher.forEach((teacher) => {
        const { surname, name, patronymic } = classes.teacher.split(/[ |.]/);
        console.log(surname);
        console.log(name);
        console.log(patronymic);
        teachers.filter((teacherdb) => {});
      });
    }
    const res = true;
    return res
      ? { successful: true, message: "Данi завантаженi успiшно" }
      : { successful: false, message: "Помилка при завантаженi даних" };
  },
};
