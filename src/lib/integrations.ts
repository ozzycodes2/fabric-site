import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type Integration = {
  slug: string;
  type: "official" | "community";
  name: string;
  url: string;
  category: string;
  tags: string[];
  contributors: { name: string; url: string; image?: string }[];
  updatedAt?: string;
};

const REQUIRED = ["type", "name", "url", "category"] as const;

export function getIntegrations(dir: string = join(process.cwd(), "content/integrations")): Integration[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((file) => {
      const raw = JSON.parse(readFileSync(join(dir, file), "utf8"));
      for (const key of REQUIRED) {
        if (typeof raw[key] !== "string" || raw[key] === "") {
          throw new Error(`Integration file ${file} is missing required field "${key}"`);
        }
      }
      return {
        tags: [],
        contributors: [],
        ...raw,
        slug: file.replace(/\.json$/, ""),
      } as Integration;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
