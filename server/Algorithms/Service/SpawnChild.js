import { spawn } from "child_process";

export default async function SpawnChild(fileName, fileDataArray) {
  try {
    const child = spawn(fileName, fileDataArray);
    for await (const chunk of child.stdout) {
      console.log(chunk.toString());
    }

    for await (const chunk of child.stderr) {
      let message = chunk.toString();
      if (message.includes("WARNING")) console.warn("WARNING: " + message);
      else {
        console.error("ERROR: " + message);
        return 1;
      }
    }

    return await new Promise((resolve) => {
      child.on("close", resolve);
    });
  } catch (err) {
    console.log(err);
  }
}
