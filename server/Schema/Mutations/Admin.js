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
        },
      });
      let specialties = await db.specialty.findAll({
        include: {
          model: db.cathedra,
          required: true,
        }
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
      audiences = audiences.map(a => a.toJSON());
      groups = groups.map(g => g.toJSON());
      cathedras = cathedras.map(c => c.toJSON());
      teachers = teachers.map(t => t.toJSON());
      specialties = specialties.map(s => s.toJSON());
      disciplines = disciplines.map(d => d.toJSON());

      for (const clas of classes) {
        const semester = GetSemester(clas.groups[0]);
        const code_spec = GetCodeSpec(clas.groups[0]); // первая цифра первой группы это код специальности
        // поиск кафедры
        let cathedra = null;
        cathedra = cathedras.find((cath) => {
          return cath.id === id_cathedra
        });
        // Поиск специальности
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
          specialty = specialty.toJSON();
          specialty.cathedra = cathedra;
          specialties.push(specialty);
        }
        // Поиск дисциплины в бд
        let discipline = null;
        discipline = disciplines.find((disc) => {
          return disc.name === clas.discipline;
        });
        // Если дисциплины нету, то её нужно создать
        if (!discipline) {
          discipline = await db.discipline.create({
            name: clas.discipline,
          })
          discipline = discipline.toJSON();
          discipline.assigned_disciplines = [];
          disciplines.push(discipline);
        }
        // Поиск закрепленной дисциплины в бд
        let ad = discipline.assigned_disciplines.find((ad) => {
          return ad.semester === semester &&
            ad.id_specialty === specialty.id
        });
        // Если закрепленной дисциплины нету, её нужно добавить
        if (!ad) {
          ad = await db.assigned_discipline.create({
            id_specialty: specialty.id,
            id_discipline: discipline.id,
            semester
          });
          ad = ad.toJSON();
          discipline.assigned_disciplines.push(ad);
        }
        let id_assigned_discipline = ad.id;
        // Поиск учителей в бд
        const arr_teach_ids = [];
        for (const teacher_name of clas.teachers) {
          const temp = teacher_name.split(/[ |.]/);
          const surname = temp[0];
          const name = temp[1];
          const patronymic = temp[2];
          let teacher = null;
          // Поиск учителя в бд
          teacher = teachers.find((teach) => {
            return teach.surname === surname &&
              teach.name.charAt(0) === name.charAt(0) &&
              teach.patronymic.charAt(0) === patronymic.charAt(0) &&
              teach.id_cathedra === id_cathedra
          })
          // Если учитель не найден в бд
          if (!teacher) {
            teacher = await db.teacher.create({
              name,
              surname,
              patronymic,
              id_cathedra,
            });
            teacher = teacher.toJSON();
            teachers.push(teacher);
          }
          arr_teach_ids.push(teacher.id);
        }
        // Поиск аудиторий
        const arr_aud_ids = [];
        for (const name_audience of clas.audiences) {
          let audience = null;
          audience = audiences.find((aud) => {
            return aud.name === name_audience;
          })
          // Если не найденна аудитория в бд
          if (!audience) {
            audience = await db.audience.create({
              name: name_audience,
              id_type_class: clas.type_class,
              capacity: 0,
            });
            audience = audience.toJSON();
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
            return grp.name === group_name
              && grp.specialty.cathedra.short_name === clas.short_name_cathedra
              && grp.specialty.code === code_spec
          })
          // Если не найдена группа
          if (!group) {
            // Поиск кафедры
            let cathedra = null;
            cathedra = cathedras.find((cath) => {
              return cath.short_name === clas.short_name_cathedra;
            })
            // если кафедра не найденa
            if (!cathedra) {
              cathedra = await db.cathedra.create({
                name: "Кафедра " + clas.short_name_cathedra,
                short_name: clas.short_name_cathedra,
              });
              cathedra = cathedra.toJSON();
              cathedras.push(cathedra);
            }
            // Поиск специальности
            specialty = null;
            specialty = specialties.find((spec) => {
              return spec.code === code_spec
                && spec.id_cathedra === cathedra.id
            })
            // если специальность не найденна в бд
            if (!specialty) {
              specialty = await db.specialty.create({
                name: cathedra.name + " - " + String(code_spec),
                code: code_spec,
                id_cathedra: cathedra.id,
              });
              specialty = specialty.toJSON();
              specialty.cathedra = cathedra;
              specialties.push(specialty);
            }
            //Создание группы
            const semester = GetSemester(group_name);
            group = await db.group.create({
              name: group_name,
              number_students: 0,
              semester,
              id_specialty: specialty.id,
            });
            group = group.toJSON();
            group.specialty = specialty;
            groups.push(group);
          }
          arr_groups_ids.push(group.id);
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
