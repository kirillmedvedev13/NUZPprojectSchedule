import { spawn, exec } from "child_process";

export default async function SpawnChild(fileName, params) {
  try {
    const child = spawn(fileName, params, { shell: true });
    let data = [];
    for await (const chunk of child.stdout) {
      console.log(chunk);
      data.push(chunk);
    }

    for await (const chunk of child.stderr) {
      console.log("ERROR: " + chunk);
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
