import { GraphQLList, GraphQLInt } from "graphql";
import db from "../../database.js";
import { Op } from "sequelize";
import ClassType from "../TypeDefs/ClassType.js";

export const GET_ALL_CLASSES = {
  type: new GraphQLList(ClassType),
  args: {
    id_group: { type: GraphQLInt },
    id_discipline: { type: GraphQLInt },
    id_teacher: { type: GraphQLInt },
    id_specialty: { type: GraphQLInt },
    semester: { type: GraphQLInt },
  },
  async resolve(
    parent,
    { id_group, id_discipline, id_teacher, id_specialty, semester }
  ) {
    const FilterGroup = id_group ? { id_group: { [Op.eq]: id_group } } : {};
    const FilterDisc = id_discipline
      ? { id_discipline: { [Op.eq]: id_discipline } }
      : {};
    const FilterTeach = id_teacher
      ? { id_teacher: { [Op.eq]: id_teacher } }
      : {};
    const FilterSpec = id_specialty
      ? { id_specialty: { [Op.eq]: id_specialty } }
      : {};
    const FilterSemester = semester ? { semester: { [Op.eq]: semester } } : {};
    let arrIDsFilteredClasses = [];
    let FilterIDsClasses = {};
    if (semester || id_specialty || id_discipline || id_group || id_teacher) {
      const filterClasses = await db.class.findAll({
        include: [
          {
            model: db.assigned_discipline,
            required: true,
            where: {
              [Op.and]: [FilterDisc, FilterSpec, FilterSemester],
            },
          },
          {
            model: db.assigned_teacher,
            required: true,
            where: FilterTeach,
          },
          {
            model: db.assigned_group,
            required: true,
            where: FilterGroup,
          },
        ],
      });
      filterClasses.forEach((element) => {
        arrIDsFilteredClasses.push(element.dataValues.id);
      });
      FilterIDsClasses = { id: { [Op.or]: arrIDsFilteredClasses } };
    }

    const res = await db.class.findAll({
      order: [["assigned_discipline", "discipline", "name", "ASC"]],
      where: FilterIDsClasses,
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
        {
          model: db.recommended_audience,
          include: {
            model: db.audience,
          },
        },
        {
          model: db.recommended_schedule,
        },
      ],
    });
    return res;
  },
};
