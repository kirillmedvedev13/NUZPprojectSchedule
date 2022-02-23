import { GraphQLString, GraphQLInt } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

function GetSemester(group, isAutumn) {
  const date = new Date();
  let semester;
  if (group.length >= 3) { // все группы
    semester =
      Number(date.getFullYear().toString().charAt(3)) -
      Number(group.charAt(2)); // Год вступления, что бы узнать семестр для дисциплины
  }
  else if (group.charAt(0) === "А") { // аспиранты
    semester =
      Number(date.getFullYear().toString().charAt(3)) -
      Number(group.charAt(1)); // Год вступления, что бы узнать семестр для дисциплины
  }
  if (semester < 0) {
    semester = 10 + semester;
  }
  //проверка на магистров
  if (group.length > 3 && group.charAt(3) === "м") {
    semester += 4;
  }
  //проверка на ускоренное обучение
  if (group.length > 3 && group.charAt(4) === "с" && group.charAt(5) === "п") {
    semester += 1;
  }
  //текущий курс перевести в семестр
  semester *= 2;
  if (isAutumn) { // если осенний семестр
    semester--;
  }
  return semester;
}

function GetCodeSpec(group) {
  if (group.length >= 3) {
    return Number(group.charAt(0));
  }
  if (group.charAt(0) === "А") {
    return 0;
  }
}

export const SET_CLASSES = {
  type: MessageType,
  args: {
    data: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { data, id_cathedra }) {
    try {
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
        let semester = GetSemester(clas.groups[0]);
        const code_spec = GetCodeSpec(clas.groups[0]); // первая цифра первой группы это код специальности
        let discipline = null;
        discipline = disciplines.find((disc) => { // Поиск дсциплины в бд
          return disc.dataValues.name === clas.discipline;
        });
        let id_assigned_discipline = null;
        let cathedra = null;
        cathedra = cathedras.find((cath) => { // поиск кафедры
          return cath.dataValues.id === id_cathedra
        });
        if (discipline) {
          let ad = discipline.assigned_disciplines.find((ad) => {// Если найдена в базе дисциплина за специальностью
            return ad.dataValues.semester === semester &&
              ad.specialty.dataValues.code === code_spec &&
              ad.specialty.dataValues.id_cathedra === id_cathedra
          });
          if (ad) {
            id_assigned_discipline = ad.dataValues.id;
          }
        }
        if (!id_assigned_discipline) {
          // дисциплина за специальностью не найдена
          let specialty = null;
          specialty = specialties.find((spec) =>
            spec.code === code_spec && spec.id_cathedra === id_cathedra
          );
          if (!specialty) { // Специальность не найдена, её нужно создать
            specialty = await db.specialty.create({
              name: cathedra.short_name + " - " + String(code_spec),
              id_cathedra,
              code: code_spec,
            });
            specialty.cathedra = cathedra;
            specialties.push(specialty);
          }
          let discipline = null;
          let new_disc = false;
          let index_disc = null; // индекс дисциплины в массиве
          discipline = disciplines.find((dis, index) => {
            if (dis.dataValues.name === clas.discipline) {
              index_disc = index;
              return true;
            }
          });
          if (!discipline) {
            // Дисциплины в базе нет, её нужно создать
            discipline = await db.discipline.create({ name: clas.discipline });
            new_disc = true;
          }
          let assigned_discipine = await db.assigned_discipline.create({
            id_specialty: specialty.dataValues.id,
            id_discipline: discipline.dataValues.id,
            semester,
          });
          id_assigned_discipline = assigned_discipine.dataValues.id;
          // Добавление специальности к закрепленным
          assigned_discipine.specialty = specialty;
          if (new_disc) {
            // Добавление дисциплины к массиву из бд
            disciplines.push({
              ...discipline,
              assigned_disciplines: [assigned_discipine],
            });
          } else { // изменение массива
            disciplines[index_disc].assigned_disciplines.push(
              assigned_discipine
            );
          }

          // Поиск учителей в бд
          const arr_teach_ids = [];
          for (const teacher_name of clas.teachers) {
            const temp = teacher_name.split(/[ |.]/);
            const surname = temp[0];
            const name = temp[1];
            const patronymic = temp[2];
            let teacher = null;
            teacher = teachers.find((teach) => {
              return teach.dataValues.surname === surname &&
                teach.dataValues.name.charAt(0) === name.charAt(0) &&
                teach.dataValues.patronymic.charAt(0) === patronymic.charAt(0)
            })
            if (!teacher) {
              // Если учитель не найден в бд
              teacher = await db.teacher.create({
                name,
                surname,
                patronymic,
                id_cathedra,
              });
              teachers.push(teacher);
            }
            arr_teach_ids.push(teacher.dataValues.id);
          }
          // Поиск аудиторий
          const arr_aud_ids = [];
          for (const name_audience of clas.audiences) {
            let audience = null;
            audience = audiences.find((aud) => {
              return aud.name === name_audience;
            })
            if (!audience) {
              audience = await db.audience.create({
                name: name_audience,
                id_type_class: 1,
                capacity: 0,
              });
              audiences.push(audience);
            }
            arr_aud_ids.push(audience.id);
          }
          // Поиск групп
          const arr_groups_ids = [];
          for (const group_name of clas.groups) {
            let group = null;
            let specialty = null;
            const code_spec = GetCodeSpec(group_name);
            group = groups.find((grp) => {
              return grp.dataValues.name === group_name
                && grp.specialty.cathedra.dataValues.short_name === clas.short_name_cathedra
                && grp.specialty.dataValues.code === code_spec
            })
            if (!group) {
              //Если не найдена группа
              let cathedra = null;
              let new_cath = false;
              //Поиск кафедры
              cathedra = cathedras.find((cath) => {
                return cath.dataValues.short_name === clas.short_name_cathedra;
              })
              if (!cathedra) {
                // если кафедра не найденa
                cathedra = await db.cathedra.create({
                  name: clas.short_name_cathedra,
                  short_name: clas.short_name_cathedra,
                });
                cathedras.push(cathedra);
                new_cath = true;
              }
              if (new_cath) { // если создана кафедра то нужно создать специальность
                specialty = await db.specialty.create({
                  name: cathedra.name + " - " + String(code_spec),
                  code: code_spec,
                  id_cathedra: cathedra.dataValues.id,
                });
                specialty.cathedra = cathedra;
                specialties.push(specialty);
              }
              else { // если кафедра уже есть то нужно найти или создать специальность для группы
                specialty = null;
                specialty = specialties.find((spec) => {
                  return spec.dataValues.code === code_spec
                    && spec.cathedra.short_name === clas.short_name_cathedra
                })
                if (!specialty) { // если специальность не найдена её нужно создать
                  specialty = await db.specialty.create({
                    name: cathedra.short_name + " - " + String(code_spec),
                    code: code_spec,
                    id_cathedra: cathedra.dataValues.id,
                  });
                  specialty.cathedra = cathedra;
                  specialties.push(specialty);
                }
              }
              //Создание группы
              const semester = GetSemester(group_name);
              group = await db.group.create({
                name: group_name,
                number_students: 0,
                semester,
                id_specialty: specialty.dataValues.id,
              });
              group.specialty = specialty;
              groups.push(group);
            }
            arr_groups_ids.push(group.dataValues.id);
          }
          // Создание занятий
          const new_class = await db.class.create({
            id_type_class: clas.type_class,
            times_per_week: clas.numberClasses,
            id_assigned_discipline,
          });
          const id_class = new_class.dataValues.id;
          await db.recommended_audience.bulkCreate(
            arr_aud_ids.map((id_audience) => {
              return { id_audience, id_class };
            })
          );
          await db.assigned_teacher.bulkCreate(
            arr_teach_ids.map((id_teacher) => {
              return { id_teacher, id_class };
            })
          );
          await db.assigned_group.bulkCreate(
            arr_groups_ids.map((id_group) => {
              return { id_group, id_class };
            })
          );
        }
      }
      return { successful: true, message: "Данi завантаженi успiшно" };
    } catch (e) {
      return {
        successful: false,
        message: "Помилка при завантаженi даних" + e,
      };
    }
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
      return { successful: true, message: "Дані успішно видалено з БД" };
    } catch (err) {
      return { successful: false, message: "Помилка при видалені даних з БД" };
    }
  },
};
