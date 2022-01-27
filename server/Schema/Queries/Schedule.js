import { GraphQLList } from "graphql";
import db from "../../database.js";
import Assigned_groupType from "../TypeDefs/Assigned_groupType.js";
import GroupType from "../TypeDefs/GroupType.js";
import { ScheduleType } from "../TypeDefs/Schedule.js";

export const GET_ALL_SCHEDULES = {
  type: new GraphQLList(ScheduleType),
  async resolve() {
    const res = await db.schedule.findAll({
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
export const GET_ALL_GROUP_SCHEDULES = {
  type: new GraphQLList(GroupType),
  async resolve() {
    const res = await db.group.findAll({
      include: {
        model: db.assigned_group,

        include: [
          {
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
              {
                model: db.audience,
              },
            ],
          },
        ],
      },
    });
    return res;
  },
};

/*query{
  GetAllSchedules {
   id
    number_pair
    day_week {
      id
      name
    }
    pair_type {
      id
      parity
    }
    audience{
      id
      name
    }
    assigned_group {
      group {
        id
        name
      }
      class {
        type_class {
          id
          name
        }
        assigned_discipline {
          discipline {
            id
            name
          }
        }
        assigned_teachers {
          teacher {
            id
            surname
            name
            patronymic
            cathedra{
              name
            }
          }
        }
      }
    }
  }
}
 */

/*query{
  GetAllGroupSchedules {
    id
    name
    assigned_groups {
      schedules {
        id
    number_pair
    day_week {
      id
      name
    }
    pair_type {
      id
      parity
    }
    audience{
      id
      name
    }
    assigned_group {
      class {
        type_class {
          id
          name
        }
        assigned_discipline {
          discipline {
            id
            name
          }
        }
        assigned_teachers {
          teacher {
            id
            surname
            name
            patronymic
            cathedra{
              name
            }
          }
        }
      }
    }
      }
    }
  }
}
 */
