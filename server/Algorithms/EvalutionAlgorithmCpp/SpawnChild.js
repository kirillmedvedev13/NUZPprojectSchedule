import { spawn, exec } from "child_process";

export default async function SpawnChild(fileName) {
  try {
    const child = spawn(fileName);
    for await (const chunk of child.stdout) {
      console.log(chunk.toString());
    }

    for await (const chunk of child.stderr) {
      console.log("ERROR: " + chunk.toString());
      return false;
    }

    const exitCode = await new Promise((resolve, reject) => {
      child.on("close", resolve);
    });
    if (exitCode)
      return exitCode;

  } catch (err) {
    console.log(err);
  }
}
