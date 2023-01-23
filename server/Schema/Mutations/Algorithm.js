import { GraphQLString } from "graphql";
import { RUN_EA } from "../../Algorithms/EvalutionAlgorithm/Main.js";
import { RUN_EACPP } from "../../Algorithms/EvalutionAlgorithmCpp/Main.js";
import { RUN_SA } from "../../Algorithms/SimpleAlgorithm/Main.js";
import { RUN_SIMULATED_ANNEALING } from "../../Algorithms/SimulatedAnnealingAlgorithm/Main.js";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const UPDATE_ALGORITHM = {
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

export const RUN_ALGORITHM = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
  },
  async resolve(parent, { name, id_cathedra }) {
    let result;
    switch (name) {
      case "evolution_algorithm":
        result = await RUN_EA(id_cathedra);
        break;
      case "evolution_algorithmCPP":
        result = await RUN_EACPP(id_cathedra);
        break;
      case "simple_algorithm":
        result = await RUN_SA(id_cathedra);
        break;
      case "simulated_annealing_algorithm":
        result = await RUN_SIMULATED_ANNEALING(id_cathedra);
        break;
    }

    return result;
  },
};
