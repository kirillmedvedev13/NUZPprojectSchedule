import { GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const UPDATE_INFO = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
    params: { type: GraphQLString },
  },
  async resolve(parent, { name, params }) {
    let res = await db.algorithm.update(
      { params },
      {
        where: {
          name,
        },
      }
    );
    return res[0]
      ? {
          successful: true,
          message: "Запис успішно оновлено",
        }
      : {
          successful: false,
          message: "Помилка при оновленні запису",
        };
  },
};
