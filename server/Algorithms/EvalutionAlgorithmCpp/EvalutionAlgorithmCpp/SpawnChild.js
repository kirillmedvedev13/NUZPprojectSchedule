import { spawn, exec } from "child_process";

export default async function SpawnChild(fileName) {
  try {
    const child = spawn(fileName);
    let data = [];

    for await (const chunk of child.stdout) {
      /*let str;
      for (const i of chunk) {
        str += String.fromCharCode(i);
      }*/
      console.log(chunk.toString());
      data.push(chunk.toString());
    }

    for await (const chunk of child.stderr) {
      /*let str;
      for (const i of chunk) {
        str += String.fromCharCode(i);
      }*/
      console.log("ERROR: " + chunk.toString());
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
