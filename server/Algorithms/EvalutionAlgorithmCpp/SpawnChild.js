import { spawn, exec } from "child_process";
import { resolve } from "path";

export default async function SpawnChild(fileName) {
  try {
    const child = spawn(fileName);
    for await (const chunk of child.stdout) {
      console.log(chunk.toString());
    }

    for await (const chunk of child.stderr) {
      console.log("ERROR: " + chunk.toString());
      return 1;
    }
    сhild.on("close", (code) => {
      return code;
    });
  } catch (err) {
    console.log(err);
  }
}
