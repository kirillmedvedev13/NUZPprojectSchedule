import { spawn, exec } from "child_process";

export default async function SpawnChild(fileName, params) {
  try {
    const child = spawn(fileName, []);
    let data = [];

    // for await (chunk of child.stdin) {
    //   chunk.write(params);
    //   chunk.end();
    // }

    for await (const chunk of child.stdout) {
      let str;
      for (const i of chunk) {
        str += String.fromCharCode(i);
      }
      console.log(str);
      data.push(str);
    }

    for await (const chunk of child.stderr) {
      let str;
      for (const i of chunk) {
        str += String.fromCharCode(i);
      }
      console.log("ERROR: " + str);
    }

    const exitCode = await new Promise((resolve, reject) => {
      child.on("close", resolve);
    });
    if (exitCode) return null;

    return data;
  } catch (err) {
    console.log(err);
  }
}
