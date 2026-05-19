import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const forbidden = [
  "AI_API_KEY",
  "OPENAI_API_KEY",
  "GEMINI_API_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "GA4_PROPERTY_ID",
  "GOOGLE_CLIENT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
  "GOOGLE_SERVICE_ACCOUNT_JSON_BASE64",
];

const distDir = join(process.cwd(), "dist");

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    return statSync(fullPath).isDirectory() ? walk(fullPath) : [fullPath];
  });
}

if (!existsSync(distDir)) {
  console.warn("dist/ does not exist, skipping secret scan.");
  process.exit(0);
}

const hits = [];

for (const file of walk(distDir)) {
  const content = readFileSync(file, "utf8");
  for (const token of forbidden) {
    if (content.includes(token)) {
      hits.push(`${file}: ${token}`);
    }
  }
}

if (hits.length > 0) {
  console.error("Build output contains forbidden secret names:");
  for (const hit of hits) console.error(`- ${hit}`);
  process.exit(1);
}

console.log("Secret scan passed.");
