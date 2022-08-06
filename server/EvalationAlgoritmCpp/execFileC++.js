const { execFile } = require("child_process");
const fs = require("fs");
const compiler = "g++";
const version = "-std=c++11";
const out = "-o";
const fileName = "./main";
const infile = "main.cpp";
const outfile = "main.exe";
const command = [JSON.stringify({ name: "kirill" }), 1, 2];
const params = "-static";

//if (!fs.existsSync(`./${outfile}`)) {
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
} else {
  execFile(fileName, command, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`what is printed to the console: ${stdout}`);
    }
  });
}
