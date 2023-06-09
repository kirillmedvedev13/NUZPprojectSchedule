import { readFileSync, writeFileSync } from "fs";
import SpawnChild from "../Service/SpawnChild.js";
import path from "path";

async function Run(){
    let pathToAlgorithm = path.resolve("IslandModelEvolutionAlgorithm.exe");
    let pathToSA = path.resolve("../SimpleAlgorithmCPP/SimpleAlgorithmCPP.exe");
    let pathToData= path.resolve("");
    let test_params = readFileSync(pathToData + "\\params_test.json")
    let data = readFileSync(pathToData + "\\data.json")
    data = JSON.parse(data);
    test_params = JSON.parse(test_params);
    let i = 1;
    for (let params of test_params.items){
        console.log(`NUMBER TEST - ${i}`);
        data.params = params;
        writeFileSync(pathToData + "\\data.json", JSON.stringify(data));
        let code;
        if (params["type_initialization"] == "simple_algorithm") {
            code = await SpawnChild(pathToAlgorithm, [pathToData, pathToSA]);
        } else {
            code = await SpawnChild(pathToAlgorithm, [pathToData]);
        }
        if (code === 0) {
            let res = readFileSync(pathToData + "\\result.json");
            writeFileSync(pathToData + `\\RESULTS\\result${i}.json`, res);
        }
        else{
            throw "SOME ERROR WHEN TESTING"
        }
        i++;
    }
}
try {
    await Run();
} catch (err) {
    console.log(err);
}
