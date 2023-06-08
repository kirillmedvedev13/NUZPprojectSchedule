import { GraphQLInt, GraphQLString } from "graphql";
import { RUN_EACPP } from "../../Algorithms/EvolutionAlgorithmsCpp/Main.js";
import { RUN_IMEACPP } from "../../Algorithms/IslandModelEvolutionAlgorithmCPP/Main.js";
import { RUN_LSTM } from "../../Algorithms/NeuralNetwork/Main.js";
import { RUN_SACPP } from "../../Algorithms/SimpleAlgorithmCPP/Main.js";
<<<<<<< HEAD
import { RUN_SIMULATED_ANNEALING } from "../../Algorithms/SimulatedAnnealingAlgorithm/Main.js";
=======
import { RUN_SIMACPP } from "../../Algorithms/SimulatedAnnealingAlgorithmCPP/Main.js";
import { RUN_TS } from "../../Algorithms/TabuSearchAlgorithm/Main.js";
>>>>>>> ccecdf700cbc9587c1ee6d2d302dcda0fd6f60c8
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";
import { RUN_TSCPP } from "../../Algorithms/TabuSearchAlgorithmCPP/Main.js";

export const UpdateAlgorithm = {
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

export const RunAlgorithm = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { name, id_cathedra }) {
    let result;
    switch (name) {
      case "evolution_algorithmCPP":
        result = await RUN_EACPP(id_cathedra, name);
        break;
      case "island_model_evolution_algorithmCPP":
        result = await RUN_IMEACPP(id_cathedra, name);
        break;
      case "simple_algorithm":
        result = await RUN_SACPP(id_cathedra, name);
        break;
      case "simulated_annealing_algorithm":
        result = await RUN_SIMACPP(id_cathedra, name);
        break;
      case "tabu_search_algorithm":
        result = await RUN_TSCPP(id_cathedra, name);
        break;
      case "model_lstm":
        result = await RUN_LSTM(id_cathedra, name);
        break;
    }

    return result;
  },
};
