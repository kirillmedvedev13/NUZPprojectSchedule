import { readFileSync, writeFileSync } from "fs";
import SpawnChild from "../Algorithms/Service/SpawnChild.js";
import path from "path";

// let algorithm = "EA";
let algorithm = "IM";
// let algorithm = "SA";
// let algorithm = "TS";

async function Run() {
  let path_to_folder_algorithm;
  switch (algorithm) {
    case "EA":
      path_to_folder_algorithm = path.resolve(
        "../Algorithms/EvolutionAlgorithmsCPP/"
      );
      break;
    case "IM":
      path_to_folder_algorithm = path.resolve(
        "../Algorithms/IslandModelEvolutionAlgorithmCPP/"
      );
      break;
    case "SA":
      path_to_folder_algorithm = path.resolve(
        "../Algorithms/SimulatedAnnealingAlgorithmCPP/"
      );
      break;
    case "TS":
      path_to_folder_algorithm = path.resolve(
        "../Algorithms/TabuSearchAlgorithmCPP/"
      );
      break;
  }
  let path_to_run = path.resolve(
    path_to_folder_algorithm + "/run_algorithm.exe"
  );
  let path_to_simple_algorithm = path.resolve(
    "../Algorithms/SimpleAlgorithmCPP/run_algorithm.exe"
  );
  let path_to_current = path.resolve("");
  let test_params = readFileSync(
    path.resolve(path_to_current + `/_params_test_${algorithm}.json`)
  );
  let data = readFileSync(path.resolve(path_to_current + "/_data_tests.json"));
  data = JSON.parse(data);
  test_params = JSON.parse(test_params);
  let number_of_tests = 3;
  let number_of_current_test = 50;
  for (let params of test_params.items) {
    for (let i = 0; i < number_of_tests; i++) {
      console.log(`NUMBER TEST - ${number_of_current_test}`);
      data.params = params;
      writeFileSync(
        path.resolve(path_to_folder_algorithm + "/data.json"),
        JSON.stringify(data)
      );
      let code;
      if (params["type_initialization"] == "simple_algorithm") {
        code = await SpawnChild(path_to_run, [
          path_to_folder_algorithm,
          path_to_simple_algorithm,
        ]);
      } else {
        code = await SpawnChild(path_to_run, [path_to_folder_algorithm]);
      }
      if (code === 0) {
        let res = readFileSync(
          path.resolve(path_to_folder_algorithm + "/result.json")
        );
        writeFileSync(
          path.resolve(
            path_to_current +
              `/_results_${algorithm}/result${number_of_current_test}.json`
          ),
          res
        );
      } else {
        throw `SOME ERROR WHEN TESTING ${number_of_current_test}`;
      }
      number_of_current_test++;
    }
  }
}
try {
  await Run();
} catch (err) {
  console.log(err);
}
