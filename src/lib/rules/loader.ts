/**
 * State configuration loader with schema validation
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import Ajv from 'ajv';
import type { StateConfig } from './types';

const ajv = new Ajv();
const configDir = path.join(process.cwd(), 'src/lib/rules/config');

/**
 * Load and validate state configuration
 *
 * Searches for state configuration directory by reading stateCode from
 * each config file. Validates the configuration against the JSON schema
 * before returning.
 *
 * @param stateCode - State abbreviation (e.g., "KY", "TEST")
 * @returns Validated state configuration with programs and income limits
 * @throws Error if state not found or validation fails
 *
 * @example
 * ```typescript
 * const config = await loadStateConfig('KY');
 * console.log(config.programs); // Array of program rules
 * console.log(config.incomeLimits.medicaid[4]); // HH4 Medicaid limit
 * ```
 */
export async function loadStateConfig(stateCode: string): Promise<StateConfig> {
  // Find the directory for this state code
  const entries = await fs.readdir(configDir, { withFileTypes: true });
  const stateDirs = entries.filter(entry => entry.isDirectory());

  let configPath: string | null = null;

  // Look for directory with matching stateCode in config
  for (const dir of stateDirs) {
    try {
      const testPath = path.join(configDir, dir.name, 'programs.json');
      const testContent = await fs.readFile(testPath, 'utf-8');
      const testConfig = JSON.parse(testContent);
      if (testConfig.stateCode === stateCode) {
        configPath = testPath;
        break;
      }
    } catch {
      continue;
    }
  }

  if (!configPath) {
    throw new Error(`State configuration not found: ${stateCode}`);
  }

  // Load config file
  const configContent = await fs.readFile(configPath, 'utf-8');
  const config = JSON.parse(configContent);

  // Load and compile schema
  const schemaPath = path.join(configDir, 'schema.json');
  const schemaContent = await fs.readFile(schemaPath, 'utf-8');
  const schema = JSON.parse(schemaContent);

  // Validate config against schema
  const validate = ajv.compile(schema);
  const valid = validate(config);

  if (!valid) {
    throw new Error(
      `Invalid state configuration: ${JSON.stringify(validate.errors)}`
    );
  }

  return config as StateConfig;
}

/**
 * Get list of available state codes
 *
 * Scans the config directory and reads the stateCode from each
 * state's programs.json file.
 *
 * @returns Array of state codes (e.g., ["KY", "TEST"])
 *
 * @example
 * ```typescript
 * const states = await getAvailableStates();
 * console.log(states); // ["KY", "TEST"]
 * ```
 */
export async function getAvailableStates(): Promise<string[]> {
  try {
    const entries = await fs.readdir(configDir, { withFileTypes: true });
    const stateDirs = entries.filter(entry => entry.isDirectory());

    // Read stateCode from each config file
    const states: string[] = [];
    for (const dir of stateDirs) {
      try {
        const configPath = path.join(configDir, dir.name, 'programs.json');
        const configContent = await fs.readFile(configPath, 'utf-8');
        const config = JSON.parse(configContent);
        if (config.stateCode) {
          states.push(config.stateCode);
        }
      } catch {
        // Skip directories without valid config
        continue;
      }
    }

    return states;
  } catch (error) {
    console.error('Error reading state configurations:', error);
    return [];
  }
}
