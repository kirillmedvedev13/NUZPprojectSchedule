import { GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const DELETE_RESULTS = {
  type: MessageType,
  args: {
    name_algorithm: { type: GraphQLString },
  },
  async resolve(parent, { name_algorithm }) {
    let res = await db.results_algorithm.destroy({
      where: {
        name_algorithm,
      },
    });
    return res
      ? {
          successful: true,
          message: "Записи успішно видалено",
        }
      : {
          successful: false,
          message: "Помилка при оновленні запису",
        };
  },
};
