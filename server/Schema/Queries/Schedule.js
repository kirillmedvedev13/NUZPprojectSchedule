import { GraphQLList } from "graphql";
import db from "../../database.js";
import { ScheduleType } from "../TypeDefs/Schedule.js";

export const GET_ALL_SCHEDULES= {
  type: new GraphQLList(ScheduleType),
  async resolve() {
    const res = await db.schedule.findAll({
      include: [{
        model: db.day_week,
      },
      {
        model: db.pair_type,
      },
      {
        model: db.class,
        include: [
          {
            model: db.type_class
          },
          {
            model: db.assigned_discipline,
            include: [
              {
                model: db.discipline
              },
              {
                model: db.specialty,
                include: {
                  model: db.cathedra
                }
              }
            ]
          }
        ]
      },
      {
        model: db.group,
      },
      {
        model: db.audience,
      }
    ]
    });
    return res;
  },
};
