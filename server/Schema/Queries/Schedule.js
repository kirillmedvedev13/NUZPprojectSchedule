import { GraphQLList, GraphQLInt } from "graphql";
import db from "../../database.js";
import AudienceType from "../TypeDefs/AudienceType.js";
import ScheduleType from "../TypeDefs/ScheduleType.js";
import { Op } from "sequelize";
import TeacherType from "../TypeDefs/TeacherType.js";
import GroupType from "../TypeDefs/GroupType.js";

export const GET_ALL_SCHEDULE_GROUPS = {
  type: new GraphQLList(GroupType),
  args: {
    id_cathedra: { type: GraphQLInt },
    id_specialty: { type: GraphQLInt },
    id_group: { type: GraphQLInt },
    semester: { type: GraphQLInt },
  },
  async resolve(parent, { id_cathedra, id_specialty, id_group, semester }) {
    // Если указан семестр, то сортировка по семестру
    const FilterSemester = semester ? { semester } : {};
    // Если указана конкретная группа, то сортировка по группе
    const FilterGroup = id_group ? { id: id_group } : {};
    // Если указаан специаность группы, то сортировка по ней
    let FilterSpecialty = {}, FilterCathedra = {};
    if (id_specialty) {
      FilterSpecialty = { id_specialty };
    }
    else if (id_cathedra) {
      FilterCathedra = { id_cathedra }
    }
    const res = await db.group.findAll({
      order: [
        ["semester", "ASC"],
        ["name", "ASC"]
      ],
      where: {
        [Op.and]: [
          FilterSemester,
          FilterGroup,
          FilterSpecialty
        ]
      },
      include: [
        {
          model: db.specialty,
          where: FilterCathedra,
          include: {
            model: db.cathedra,
          },
        },
        {
          model: db.assigned_group,
          include: {
            model: db.class,
            include: [
              {
                model: db.schedule,
                include: {
                  model: db.audience
                }
              },
              {
                model: db.type_class,
              },
              {
                model: db.assigned_discipline,
                include: {
                  model: db.discipline,
                },
              },
              {
                model: db.assigned_teacher,
                include: {
                  model: db.teacher,
                },
              },
            ],
          },
        }
      ]
    });
    return res;
  },
};

export const GET_ALL_SCHEDULE_AUDIENCES = {
  type: new GraphQLList(AudienceType),
  args: {
    id_cathedra: { type: GraphQLInt },
    id_audience: { type: GraphQLInt },
  },
  async resolve(parent, { id_cathedra, id_audience }) {
    let FilterAudience = {};
    if (id_audience) FilterAudience = { id: { [Op.eq]: id_audience } };
    else if (id_cathedra) {
      let getCathAuds = await db.assigned_audience.findAll({
        where: { id_cathedra },
      });
      let arrAuds = getCathAuds.map((object) => {
        return object.dataValues.id_audience;
      });
      FilterAudience = { id: arrAuds };
    }

    const res = await db.audience.findAll({
      where: FilterAudience,
      order: [
        ["schedules", "day_week", "ASC"],
        ["schedules", "number_pair", "ASC"],
        ["schedules", "pair_type", "ASC"],
      ],
      include: {
        model: db.schedule,
        include: [
          {
            model: db.class,

            include: [
              {
                model: db.type_class,
              },
              {
                model: db.assigned_discipline,

                include: [
                  {
                    model: db.discipline,
                  },
                  {
                    model: db.specialty,
                    include: {
                      model: db.cathedra,
                    },
                  },
                ],
              },
              {
                model: db.assigned_teacher,

                include: {
                  model: db.teacher,
                  include: {
                    model: db.cathedra,
                  },
                },
              },
              {
                model: db.assigned_group,
                include: {
                  model: db.group,
                  include: {
                    model: db.specialty,
                    include: {
                      model: db.cathedra,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    });
    return res;
  },
};

export const GET_ALL_SCHEDULE_TEACHERS = {
  type: new GraphQLList(TeacherType),
  args: {
    id_cathedra: { type: GraphQLInt },
    id_teacher: { type: GraphQLInt },
  },
  async resolve(parent, { id_cathedra, id_teacher }) {
    let filterTeacher = {};
    let filterCathedra = {};
    if (id_teacher) {
      filterTeacher = { id: { [Op.eq]: id_teacher } };
    } else {
      if (id_cathedra) {
        filterCathedra = { id_cathedra: { [Op.eq]: id_cathedra } };
      }
    }
    const res = await db.teacher.findAll({
      order: [
        ["surname", "ASC"],
        ["name", "ASC"],
      ],
      where: { [Op.and]: [filterTeacher, filterCathedra] },

      include: [
        {
          model: db.assigned_teacher,
          required: true,
          include: [
            {
              model: db.class,
              required: true,
              include: [
                {
                  model: db.schedule,
                  include: {
                    model: db.audience,
                  },
                },
                {
                  model: db.type_class,
                },
                {
                  model: db.assigned_group,
                  required: true,
                  include: [
                    {
                      model: db.group,
                      required: true,
                      include: {
                        model: db.specialty,
                        include: {
                          model: db.cathedra,
                        },
                      },
                    },
                  ],
                },
                {
                  model: db.assigned_discipline,
                  required: true,
                  include: [
                    {
                      model: db.discipline,
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return res;
  },
};
