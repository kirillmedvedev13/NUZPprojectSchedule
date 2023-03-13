import { spawn } from "child_process";

export default async function SpawnChild(fileName, fileData) {
  try {
    const child = spawn(fileName, [fileData]);
    for await (const chunk of child.stdout) {
      console.log(chunk.toString());
    }

    for await (const chunk of child.stderr) {
      console.log("ERROR: " + chunk.toString());
      return 1;
    }
    return await new Promise((resolve) => {
      child.on("close", resolve);
    });
  } catch (err) {
    console.log(err);
  }
}
