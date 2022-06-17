import { GraphQLList } from "graphql";
import db from "../../database.js";
import Assigned_disciplineType from "../TypeDefs/Assigned_disciplineType.js"

export const GET_ALL_ASSIGNED_DISCIPLINES = {
    type: new GraphQLList(Assigned_disciplineType),
    async resolve() {
        const res = await db.assigned_discipline.findAll({
            include: [
                {
                    model: db.discipline,
                    required: true,
                },
                {
                    model: db.specialty,
                    required: true,
                }
            ]
        })
        return res;
    },
};
