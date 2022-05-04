import { GraphQLList, GraphQLInt } from "graphql";
import db from "../../database.js";
import AudienceType from "../TypeDefs/AudienceType.js";
import { ScheduleType } from "../TypeDefs/ScheduleType.js";
import { Op } from "sequelize";

export const GET_ALL_SCHEDULE_GROUPS = {
  type: new GraphQLList(ScheduleType),
  args: {
    id_cathedra: { type: GraphQLInt },
    id_specialty: { type: GraphQLInt },
    id_group: { type: GraphQLInt },
    semester: { type: GraphQLInt },
  },
  async resolve(parent, { id_cathedra, id_specialty, id_group, semester }) {
    let FilterGroup = {};
    const FilterSemester = semester ? { semester } : {};
    if (id_group) FilterGroup = { id_group };
    else if (id_specialty) {
      let getSpecGroups = await db.group.findAll({ where: { id_specialty } });
      let groups = getSpecGroups.map((object) => {
        return object.dataValues.id;
      });
      FilterGroup = { id_group: groups };
    } else if (id_cathedra) {
      let getSpecs = await db.specialty.findAll({ where: { id_cathedra } });
      let specialties = getSpecs.map((object) => {
        return object.dataValues.id;
      });
      let getSpecGroups = await db.group.findAll({
        where: { id_specialty: specialties },
      });
      let groups = getSpecGroups.map((object) => {
        return object.dataValues.id;
      });
      FilterGroup = { id_group: groups };
    }
    const res = await db.schedule.findAll({
      order: [
        ["assigned_group", "group", "name", "ASC"],
        ["number_pair", "ASC"],
        ["pair_type", "ASC"],
        ["day_week", "ASC"],
      ],
      include: [
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
            {
              model: db.group,
              where: FilterSemester,
              include: {
                model: db.specialty,
                include: {
                  model: db.cathedra
                }
              }
            },
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
        ["schedules", "number_pair", "ASC"],
        ["schedules", "pair_type", "ASC"],
        ["schedules", "day_week", "ASC"],
      ],
      include: {
        model: db.schedule,

        include: [
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

export const GET_ALL_SCHEDULE_TEACHERS = {
  type: new GraphQLList(ScheduleType),
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
    const res = await db.schedule.findAll({
      order: [
        ["number_pair", "ASC"],
        ["pair_type", "ASC"],
        ["day_week", "ASC"],
      ],
      include: [
        {
          model: db.assigned_group,
          required: true,
          include: [
            {
              model: db.class,
              required: true,
              include: [
                {
                  model: db.type_class,
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
                {
                  model: db.assigned_teacher,
                  required: true,
                  include: {
                    model: db.teacher,
                    required: true,
                    where: { [Op.and]: [filterTeacher, filterCathedra] },
                    include: {
                      model: db.cathedra,
                      required: true,
                    },
                  },
                },
              ],
            },
            {
              model: db.group,
              required: true,
            },
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
