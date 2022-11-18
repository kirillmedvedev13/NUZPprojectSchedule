import { spawn } from "child_process";

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
    return await new Promise((resolve) => {
      child.on('close', resolve)
    })

  } catch (err) {
    console.log(err);
  }
}
