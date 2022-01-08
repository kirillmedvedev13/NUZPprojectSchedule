import { GraphQLList } from "graphql";
import db from "../../database.js";
import Assigned_audienceType from "../TypeDefs/Assigned_audienceType.js";

export const GET_ALL_ASSIGNED_AUDIENCES = {
  type: new GraphQLList(Assigned_audienceType),
  async resolve() {
    return await db.assigned_audience.findAll({
      include: [
        {
          model: db.cathedra,
          required: true,
        },
        {
          model: db.audience,
          required: true,
          include: {
            model: db.type_class,
            required: true,
          }
        },
      ],
    });
  },
};
