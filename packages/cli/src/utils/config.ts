import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Config } from "@/types.js";
import { outro } from "@clack/prompts";
import chalk from "chalk";
import type { Jiti } from "jiti";
import { loadEnv } from "./env.js";

const CONFIG_NAME = "languine.config";

export async function configFile(configType?: string) {
  const files = await readdir(process.cwd());
  const configFile = files.find(
    (file: string) =>
      file.startsWith(`${CONFIG_NAME}.`) &&
      (file.endsWith(".ts") || file.endsWith(".mjs")),
  );

  // If configType is specified, use that
  // Otherwise try to detect from existing file, falling back to ts
  const format = configType || (configFile?.endsWith(".mjs") ? "mjs" : "ts");
  const filePath = join(
    process.cwd(),
    configFile || `${CONFIG_NAME}.${format}`,
  );

  return {
    path: filePath,
    format,
  };
}

/**
 * Load the configuration file from the current working directory.
 * Supports both TypeScript (languine.config.ts) and JSON (languine.config.json) formats.
 */
export async function loadConfig(): Promise<Config> {
  let jiti: Jiti | undefined;

  const { path: filePath, format } = await configFile();
  const env = loadEnv();

  if (!filePath) {
    outro(
      chalk.red(
        `Could not find ${CONFIG_NAME}.${format}. Run 'languine init' first.`,
      ),
    );

    process.exit(1);
  }

  try {
    const configModule = await import(pathToFileURL(filePath).href);
    const config = configModule.default;

    return {
      ...config,
      projectId: config.projectId || env.LANGUINE_PROJECT_ID,
    };
  } catch (error) {
    const { createJiti } = await import("jiti");
    const { transform } = await import("sucrase");

    jiti ??= createJiti(import.meta.url, {
      transform(opts) {
        return transform(opts.source, {
          transforms: ["typescript", "imports"],
        });
      },
    });

    const config = await jiti
      .import(filePath)
      .then((mod) => (mod as unknown as { default: Config }).default);

    const projectId = config.projectId || env.LANGUINE_PROJECT_ID;

    if (!projectId) {
      throw new Error(
        "Configuration file does not contain a projectId. Please set it in the config file or in the .env file.",
      );
    }

    return {
      ...config,
      projectId,
    };
  }
}
