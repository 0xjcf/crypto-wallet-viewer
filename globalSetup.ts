import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
import config from "./config"; // Import the config object

dotenv.config();

export = async function globalSetup() {
  if (config.Memory) {
    // Check if Memory flag is true in config
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    (global as any).__MONGOINSTANCE = mongod;
    process.env.MONGODB_URI = uri; // Setting directly as we're using MongoMemoryServer
  } else {
    // If not using memory server, set the MONGODB_URI based on config
    process.env.MONGODB_URI = `mongodb://${config.IP}:${config.Port}`;
  }
};
