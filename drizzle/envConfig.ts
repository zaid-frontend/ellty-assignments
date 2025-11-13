import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

// Validate required environment variables
const requiredEnvVars = ["POSTGRES_URL", "SECRET", "BLOB_READ_WRITE_TOKEN"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
