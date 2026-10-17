import "dotenv/config";
import { promises as fs } from "node:fs";
import path from "node:path";
import { dataDirectory, readJson } from "../assistant-store.js";

const directory = path.join(dataDirectory(), "requests");
const files = await fs.readdir(directory).catch(error => { if (error.code === "ENOENT") return []; throw error; });
const requests = [];
for (const file of files.filter(item => /^LINA-[A-F0-9]{16}\.json$/.test(item))) {
  const value = await readJson(path.join(directory, file), null);
  if (value) requests.push({ id: value.id, createdAt: value.createdAt, status: value.status, customer: value.draft, notification: value.notification.status });
}
requests.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
process.stdout.write(JSON.stringify(requests, null, 2) + "\n");
