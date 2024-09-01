import { readFile } from "fs/promises";
import { MONGO_URL } from "../MERN_Jobify/secret.js";
import connectDB from "./db/connect.js";
import Job from "./models/Job.js";

const start = async () => {
  try {
    await connectDB(MONGO_URL);
    await Job.deleteMany();
    const jsonProducts = JSON.parse(
      await readFile(new URL("./mock_data.json", import.meta.url))
    );
    await Job.create(jsonProducts);
    console.log("Success!!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
