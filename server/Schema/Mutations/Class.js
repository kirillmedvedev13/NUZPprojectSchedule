import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import MessageType from "../TypeDefs/MessageType.js";
import db from "../../database.js";

export const CreateClass = {
  type: MessageType,
  args: {
    id_type_class: { type: GraphQLInt },
    times_per_week: { type: GraphQLFloat },
    id_assigned_discipline: { type: GraphQLInt },
    assigned_teachers: { type: GraphQLString },
    assigned_groups: { type: GraphQLString },
    recommended_audiences: { type: GraphQLString },
    recommended_schedules: { type: GraphQLString },
  },
  async resolve(
    parent,
    {
      id_type_class,
      times_per_week,
      id_assigned_discipline,
      assigned_teachers,
      assigned_groups,
      recommended_audiences,
      recommended_schedules,
    }
  ) {
    let res = await db.class.create({
      id_type_class,
      times_per_week,
      id_assigned_discipline,
    });
    if (res) {
      if (assigned_teachers) {
        const atIDs = JSON.parse(assigned_teachers);
        await db.assigned_teacher.bulkCreate(
          atIDs.map((item) => {
            return { id_class: res.dataValues.id, id_teacher: item };
          })
        );
      }
      if (assigned_groups) {
        const agIDs = JSON.parse(assigned_groups);
        await db.assigned_group.bulkCreate(
          agIDs.map((item) => {
            return { id_class: res.dataValues.id, id_group: item };
          })
        );
      }
      if (recommended_audiences) {
        const raIDs = JSON.parse(recommended_audiences);
        await db.recommended_audience.bulkCreate(
          raIDs.map((item) => {
            return { id_class: res.dataValues.id, id_audience: item };
          })
        );
      }
      if (recommended_schedules) {
        const raIDs = JSON.parse(recommended_schedules);
        await db.recommended_schedule.bulkCreate(
          raIDs.map((item) => {
            return {
              id_class: res.dataValues.id,
              day_week: item.day_week,
              number_pair: item.number_pair,
            };
          })
        );
      }
    }
    return res
      ? { successful: true, message: "Запис заняття успішно створено" }
      : { successful: false, message: "Помилка при створенні запису заняття" };
  },
};

export const UpdateClass = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    id_type_class: { type: GraphQLInt },
    times_per_week: { type: GraphQLFloat },
    id_assigned_discipline: { type: GraphQLInt },
  },
  async resolve(
    parent,
    { id, id_type_class, times_per_week, id_assigned_discipline }
  ) {
    let res = await db.class.update(
      { id_type_class, times_per_week, id_assigned_discipline },
      {
        where: {
          id,
        },
      }
    );
    return res[0]
      ? { successful: true, message: "Запис заняття успішно оновлено" }
      : { successful: false, message: "Помилка при оновленні запису заняття" };
  },
};

export const DeleteClass = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.class.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Запис заняття успішно видалено" }
      : { successful: false, message: "Помилка при видаленні запису заняття" };
  },
};
export const AddTeacherToClass = {
  type: MessageType,
  args: {
    id_teacher: { type: GraphQLID },
    id_class: { type: GraphQLID },
  },
  async resolve(parent, { id_teacher, id_class }) {
    let teach = await db.teacher.findOne({
      where: {
        id: id_teacher,
      },
    });
    if (!teach) return { successful: false, message: "Не знайдено викладача" };
    let classes = await db.class.findOne({
      where: {
        id: id_class,
      },
    });
    if (!classes) return { successful: false, message: "Не знайдено заняття" };
    const res = await classes.addTeacher(teach);
    const at = res[0].dataValues;
    return res
      ? {
          successful: true,
          message: "Викладач успішно додан до заняття",
          data: JSON.stringify(at),
        }
      : {
          successful: false,
          message: "Помилка при додаванні викладача до заняття",
        };
  },
};
export const AddRecAudienceToClass = {
  type: MessageType,
  args: {
    id_audience: { type: GraphQLID },
    id_class: { type: GraphQLID },
  },
  async resolve(parent, { id_audience, id_class }) {
    let audience = await db.audience.findOne({
      where: {
        id: id_audience,
      },
    });
    if (!audience)
      return { successful: false, message: "Не знайдено аудиторії" };
    let classes = await db.class.findOne({
      where: {
        id: id_class,
      },
    });
    if (!classes) return { successful: false, message: "Не знайдено заняття" };
    const res = await classes.addAudience(audience);
    const ra = res[0].dataValues;
    return res
      ? {
          successful: true,
          message: "Рекомендована аудиторія успішно додана до заняття",
          data: JSON.stringify(ra),
        }
      : {
          successful: false,
          message: "Помилка при додаванні рекомендованної аудиторії до заняття",
        };
  },
};
export const AddRecScheduleToClass = {
  type: MessageType,
  args: {
    number_pair: { type: GraphQLInt },
    day_week: { type: GraphQLInt },
    id_class: { type: GraphQLID },
  },
  async resolve(parent, { number_pair, day_week, id_class }) {
    let classes = await db.class.findOne({
      where: {
        id: id_class,
      },
    });
    if (!classes) return { successful: false, message: "Не знайдено заняття" };
    const res = await db.recommended_schedule.create({
      number_pair,
      day_week,
      id_class,
    });
    const rs = res.dataValues;
    return res
      ? {
          successful: true,
          message: "Рекомендований час розкладу успішно доданий до заняття",
          data: JSON.stringify(rs),
        }
      : {
          successful: false,
          message:
            "Помилка при додаванні рекомендованного часу розкладу до заняття",
        };
  },
};

export const AddGroupToClass = {
  type: MessageType,
  args: {
    id_group: { type: GraphQLString },
    id_class: { type: GraphQLID },
  },
  async resolve(parent, { id_group, id_class }) {
    let group = JSON.parse(id_group);

    let classes = await db.class.findOne({
      where: {
        id: id_class,
      },
    });

    if (!classes) return { successful: false, message: "Не знайдено заняття" };
    let res = await db.assigned_group.bulkCreate(
      group.map((gr) => {
        return { id_class: classes.dataValues.id, id_group: +gr.id };
      })
    );
    let ag = res.map((r) => {
      return r.dataValues;
    });

    return res
      ? {
          successful: true,
          message: "Група успішно додана до заняття",
          data: JSON.stringify(ag),
        }
      : {
          successful: false,
          message: "Помилка при додаванні групи до заняття",
        };
  },
};

export const DeleteTeacherFromClass = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.assigned_teacher.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Викладач успішно видален від заняття" }
      : {
          successful: false,
          message: "Помилка при видаленні викладача від заняття",
        };
  },
};
export const DeleteRecAudienceFromClass = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.recommended_audience.destroy({
      where: {
        id,
      },
    });
    return res
      ? {
          successful: true,
          message: "Рекомендована аудиторія успішно видалена від заняття",
        }
      : {
          successful: false,
          message:
            "Помилка при видаленні рекомендованної аудиторії від заняття",
        };
  },
};
export const DeleteRecScheduleFromClass = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.recommended_schedule.destroy({
      where: {
        id,
      },
    });
    return res
      ? {
          successful: true,
          message: "Рекомендований час розкладу успішно видалений від заняття",
        }
      : {
          successful: false,
          message:
            "Помилка при видаленні рекомендованного часу розкладу від заняття",
        };
  },
};
export const DeleteGroupFromClass = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.assigned_group.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Група успішно видалена від заняття" }
      : {
          successful: false,
          message: "Помилка при видаленні групи від заняття",
        };
  },
};
