import { execFile } from "child_process";
import fs from "fs";
const compiler = "g++";
const version = "-std=c++11";
const out = "-o";
const fileName = "./EvalutionAlgoritmCpp/x64/Debug/EvalutionAlgorithmCpp.exe";
const infile = "./x64/Debug/EvulationAlgoritm.cpp";
const outfile = "./x64/Debug/EvulationAlgoritm.exe";
const command = [];
const params = "-static";

/*if (!fs.existsSync(`./${outfile}`)) {
  execFile(
    compiler,
    [version, infile, out, outfile, params],
    (err, stdout, stderr) => {
      if (err) console.log(err);
      else {
        let executable = `./${outfile}`;
        execFile(executable, (err, stdout, stderr) => {
          if (err) {
            console.log(err);
          } else {
            execFile(fileName, command, (err, stdout, stderr) => {
              if (err) {
                console.log(err);
              } else {
                console.log(`what is printed to the console: ${stdout}`);
              }
            });
          }
        });
      }
    }
  );
} else {*/
execFile(fileName, command, (err, stdout, stderr) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`what is printed to the console: ${stdout}`);
  }
});
//}
