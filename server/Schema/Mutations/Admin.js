import { GraphQLString, GraphQLInt } from "graphql";
import db from "../../database.js";
import Type_class from "../../Models/Type_class.js";
import MessageType from "../TypeDefs/MessageType.js";

function GetSemester(group_name) {
  const date = new Date();
  let semester =
    Number(date.getFullYear().toString().charAt(3)) -
    Number(group_name.charAt(2)); // Год вступления, что бы узнать семестр для дисциплины
  if (semester < 0) {
    semester = 10 + semester;
  }
  if (date.getMonth() > 5 && date.getMonth() < 13) {
    semester++;
  }
  return semester;
}
export const SET_CLASSES = {
  type: MessageType,
  args: {
    data: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { data, id_cathedra }) {
    const classes = JSON.parse(data).classes;
    let disciplines = await db.discipline.findAll({
      include: {
        model: db.assigned_discipline,
        required: true,
        include: {
          model: db.specialty,
          required: true,
        },
      },
    });
    let specialties = await db.specialty.findAll({
      include: {
        model: db.cathedra,
        required: true,
      },
    });
    let teachers = await db.teacher.findAll();
    let cathedras = await db.cathedra.findAll();
    let groups = await db.group.findAll({
      include: {
        model: db.specialty,
        required: true,
        include: {
          model: db.cathedra,
          required: true,
        },
      },
    });
    let audiences = await db.audience.findAll({
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
      let semester = GetSemester(clas.groups[0]);
      const code_spec = Number(clas.groups[0].charAt(0)); // первая цифра первой группы это код специальности
      const arr_disc = disciplines.filter((disc) => {
        return disc.dataValues.name === clas.discipline;
      });
      let id_assigned_discipline = null;
      let cathedra = null;
      for (const cath of cathedras) {
        // поиск кафедры
        if (cath.dataValues.id === id_cathedra) {
          cathedra = cath;
        }
      }
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
          new_spec.cathedra = cathedra;
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
      const arr_teach_ids = [];
      for (const teacher of clas.teachers) {
        const temp = teacher.split(/[ |.]/);
        const surname = temp[0];
        const name = temp[1];
        const patronymic = temp[2];
        let id_teacher = null;
        for (const teacherdb of teachers) {
          if (
            teacherdb.dataValues.surname === surname &&
            teacherdb.dataValues.name.charAt(0) === name.charAt(0) &&
            teacherdb.dataValues.patronymic.charAt(0) === patronymic.charAt(0)
          ) {
            id_teacher = teacherdb.dataValues.id;
            arr_teach_ids.push(id_teacher);
          }
        }
        if (!id_teacher) {
          // Если учитель не найден в бд
          const new_teach = await db.teacher.create({
            name,
            surname,
            patronymic,
            id_cathedra,
          });
          arr_teach_ids.push(new_teach.dataValues.id);
          teachers.push(new_teach);
        }
      }
      // Поиск аудиторий
      const arr_aud_ids = [];
      for (const audience of clas.audiences) {
        let id_audience = null;
        for (const audiencedb of audiences) {
          if (audiencedb.dataValues.name === audience) {
            // Найдена аудитория в базе
            id_audience = audiencedb.dataValues.id;
            arr_aud_ids.push(id_audience);
            let checkCathedra = false;
            for (const au of audiencedb.assigned_audiences) {
              // проверка на закрепленную кафедру
              if (au.dataValues.id_cathedra === id_cathedra) {
                checkCathedra = true;
                break;
              }
            }
            if (!checkCathedra) {
              // Если аудитория не закреплена за кафедрой
              const new_assigned_audience = await db.assigned_audience.create({
                id_audience,
                id_cathedra,
              });
              audiencedb.assigned_audiences.push(new_assigned_audience);
            }
            break;
          }
        }
        if (!id_audience) {
          // Если аудитория не найдена в бд
          let new_audience = await db.audience.create({
            name: audience,
            id_type_class: 1,
            capacity: 0,
          });
          id_audience = new_audience.dataValues.id;
          arr_aud_ids.push(id_audience);
          let new_assigned_audience = await db.assigned_audience.create({
            id_audience,
            id_cathedra,
          });
          audiences.push({
            ...new_audience,
            assigned_audiences: [new_assigned_audience],
          });
        }
      }
      // Поиск групп
      const arr_groups_ids = [];
      for (const group of clas.groups) {
        let found_group = null;
        const code_spec = Number(group.charAt(0)); // первая цифра группы это код специальности
        for (const groupdb of groups) {
          if (
            groupdb.dataValues.name === group &&
            groupdb.specialty.cathedra.dataValues.short_name ===
              clas.short_name_cathedra &&
            groupdb.specialty.dataValues.code === code_spec
          ) {
            //найдена группа в базе
            found_group = groupdb;
            arr_groups_ids.push(found_group.dataValues.id);
            break;
          }
        }
        if (!found_group) {
          //Если не найдена группа
          let found_specialty = null;
          let found_cathedra = null;
          //Поиск кафедры
          for (const cath of cathedras) {
            console.log(cath.dataValues.short_name);
            if (
              String(cath.dataValues.short_name) ===
              String(clas.short_name_cathedra)
            ) {
              found_cathedra = cath;
              //Поиск специальности для кафедры
              for (const spec of specialties) {
                if (
                  spec.dataValues.code === code_spec &&
                  spec.dataValues.id_cathedra === cath.dataValues.id
                ) {
                  // Найдена специальность с кафедрой
                  found_specialty = spec;
                  break;
                }
              }
            }
          }
          if (found_cathedra) {
            // если кафедра найденa
            if (!found_specialty) {
              //если не найдена специальность
              found_specialty = await db.specialty.create({
                name: "",
                code: code_spec,
                id_cathedra: found_cathedra.dataValues.id,
              });
              found_specialty.cathedra = found_cathedra;
              specialties.push(found_specialty);
            }
          } else {
            // если кафедра не найденa
            found_cathedra = await db.cathedra.create({
              name: "",
              short_name: clas.short_name_cathedra,
            });
            cathedras.push(found_cathedra);
            found_specialty = await db.specialty.create({
              name: "",
              code: code_spec,
              id_cathedra: found_cathedra.dataValues.id,
            });
            found_specialty.cathedra = found_cathedra;
            specialties.push(found_specialty);
          }
          //Создание группы
          const semester = GetSemester(group);
          found_group = await db.group.create({
            name: group,
            number_students: 0,
            semester,
            id_specialty: found_specialty.dataValues.id,
          });
          arr_groups_ids.push(found_group.dataValues.id);
          found_group.specialty = found_specialty;
          groups.push(found_group);
        }
      }
    }
    const res = true;
    return res
      ? { successful: true, message: "Данi завантаженi успiшно" }
      : { successful: false, message: "Помилка при завантаженi даних" };
  },
};

export const DELETE_ALL_DATA = {
  type: MessageType,
  args: {},
  async resolve(parent) {
    try {
      await db.audience.destroy({ truncate: { cascade: true } });
      await db.teacher.destroy({ truncate: { cascade: true } });
      await db.discipline.destroy({ truncate: { cascade: true } });
      await db.group.destroy({ truncate: { cascade: true } });
      await db.class.destroy({ truncate: { cascade: true } });
      await db.specialty.destroy({ truncate: { cascade: true } });
      await db.cathedra.destroy({ truncate: { cascade: true } });
      return { successful: true, message: "YEs" };
    } catch (err) {
      return { successful: false, message: "Some error" };
    }
  },
};
