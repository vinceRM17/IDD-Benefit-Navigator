/**
 * State configuration loader with schema validation and federal fallback
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
 */
export async function loadStateConfig(stateCode: string): Promise<StateConfig> {
  // Find the directory for this state code
  const entries = await fs.readdir(configDir, { withFileTypes: true });
  const stateDirs = entries.filter(entry => entry.isDirectory());

  let configPath: string | null = null;

  // Look for directory with matching stateCode in config
  for (const dir of stateDirs) {
    if (dir.name === 'federal' || dir.name === '_template') continue;
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
 * Load state config with federal fallback
 *
 * Tries to load the state-specific config first. If not found,
 * falls back to the federal config which provides SSI, SSDI, SNAP screening.
 * The federal config's stateCode and stateName are overridden with the
 * requested state's values, and programIds are rewritten to use the state prefix.
 *
 * @param stateCode - State abbreviation (e.g., "KY", "OH")
 * @param stateName - State name for display (optional, defaults to stateCode)
 * @returns State or federal configuration
 */
export async function loadStateOrFederalConfig(
  stateCode: string,
  stateName?: string
): Promise<StateConfig> {
  try {
    return await loadStateConfig(stateCode);
  } catch {
    // Fall back to federal config
    const federalPath = path.join(configDir, 'federal', 'programs.json');
    const configContent = await fs.readFile(federalPath, 'utf-8');
    const config = JSON.parse(configContent) as StateConfig;

    // Override with requested state info
    config.stateCode = stateCode;
    config.stateName = stateName || stateCode;
    config.coverageLevel = 'federal-only';

    // Rewrite programIds to use state prefix instead of "federal-"
    config.programs = config.programs.map(program => ({
      ...program,
      programId: program.programId.replace('federal-', `${stateCode.toLowerCase()}-`),
    }));

    return config;
  }
}

/**
 * Get list of available state codes (states with full configs only)
 */
export async function getAvailableStates(): Promise<string[]> {
  try {
    const entries = await fs.readdir(configDir, { withFileTypes: true });
    const stateDirs = entries.filter(entry =>
      entry.isDirectory() && entry.name !== 'federal' && entry.name !== '_template'
    );

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
        continue;
      }
    }

    return states;
  } catch (error) {
    console.error('Error reading state configurations:', error);
    return [];
  }
}
