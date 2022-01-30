import { GraphQLList } from "graphql";
import db from "../../database.js";
import Assigned_groupType from "../TypeDefs/Assigned_groupType.js";
import AudienceType from "../TypeDefs/AudienceType.js";
import GroupType from "../TypeDefs/GroupType.js";
import { ScheduleType } from "../TypeDefs/ScheduleType.js";

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
  async resolve() {
    const res = await db.audience.findAll({
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
        ],
      },
    });
    return res;
  },
};
