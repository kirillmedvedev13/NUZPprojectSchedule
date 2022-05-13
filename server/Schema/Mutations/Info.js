import { GraphQLInt, GraphQLFloat } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const UPDATE_INFO = {
    type: MessageType,
    args: {
        max_day: {
            type: GraphQLInt,
        },
        max_pair: {
            type: GraphQLInt,
        },
        population_size: {
            type: GraphQLInt,
        },
        max_generations: {
            type: GraphQLInt,
        },
        p_crossover: {
            type: GraphQLFloat,
        },
        p_mutation: {
            type: GraphQLFloat,
        },
        p_genes: {
            type: GraphQLFloat,
        },
        penaltyGrWin: {
            type: GraphQLFloat,
        },
        penaltyTeachWin: {
            type: GraphQLFloat,
        },
        penaltyLateSc: {
            type: GraphQLFloat,
        },
        penaltyEqSc: {
            type: GraphQLFloat,
        },
        penaltySameTimesSc: {
            type: GraphQLFloat,
        },
    },
    async resolve(parent, { id, name, surname, patronymic, id_cathedra }) {
        let res = await db.teacher.update(
            { name, surname, patronymic, id_cathedra },
            {
                where: {
                    id,
                },
            }
        );
        return res[0]
            ? { successful: true, message: "Запис викладача усішно оновлено" }
            : { successful: false, message: "Помилка при оновленні запису викладача" };
    },
};
