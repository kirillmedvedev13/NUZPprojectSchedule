import { GraphQLList, GraphQLInt } from "graphql";
import db from "../../database.js";
import AudienceType from "../TypeDefs/AudienceType.js";
import GroupType from "../TypeDefs/GroupType.js";
import { ScheduleType } from "../TypeDefs/ScheduleType.js";
import { Op } from "sequelize";

export const GET_ALL_SCHEDULES = {
  type: new GraphQLList(ScheduleType),
  async resolve() {
    const res = await db.schedule.findAll({
      order: [
        ["assigned_group", "group", "name", "ASC"],
        ["number_pair", "ASC"],
        ["id_pair_type", "ASC"],
        ["id_day_week", "ASC"],
      ],
      include: [
        {
          model: db.day_week,
        },
        {
          model: db.pair_type,
        },
        {
          model: db.assigned_group,
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
              ],
            },
            { model: db.group },
          ],
        },
        {
          model: db.audience,
        },
      ],
    });
    return res;
  },
};
export const GET_ALL_AUDIENCE_SCHEDULES = {
  type: new GraphQLList(AudienceType),
  args: {
    id_group: { type: GraphQLInt },
    id_discipline: { type: GraphQLInt },
    id_teacher: { type: GraphQLInt },
    id_audience: { type: GraphQLInt },
  },
  async resolve(parent, { id_group, id_audience, id_discipline, id_teacher }) {
    const FilterAudience = id_audience ? { id: { [Op.eq]: id_audience } } : {};
    const FilterGroup = id_group ? { id_group: { [Op.eq]: id_group } } : {};
    const FilterDisc = id_discipline
      ? { id_discipline: { [Op.eq]: id_discipline } }
      : {};
    const FilterTeach = id_teacher
      ? { id_teacher: { [Op.eq]: id_teacher } }
      : {};
    const res = await db.audience.findAll({
      where: FilterAudience,
      order: [
        ["schedules", "number_pair", "ASC"],
        ["schedules", "id_pair_type", "ASC"],
        ["schedules", "id_day_week", "ASC"],
      ],
      include: {
        model: db.schedule,

        include: [
          {
            model: db.day_week,
          },
          {
            model: db.pair_type,
          },
          {
            model: db.assigned_group,
            where: FilterGroup,
            include: [
              {
                model: db.class,

                include: [
                  {
                    model: db.type_class,
                  },
                  {
                    model: db.assigned_discipline,
                    where: FilterDisc,
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
                    where: FilterTeach,
                    include: {
                      model: db.teacher,
                      include: {
                        model: db.cathedra,
                      },
                    },
                  },
                ],
              },
              { model: db.group },
            ],
          },
        ],
      },
    });
    return res;
  },
};
