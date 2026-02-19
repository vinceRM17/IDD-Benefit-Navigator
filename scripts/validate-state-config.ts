#!/usr/bin/env npx ts-node
/**
 * Validate a state configuration file
 *
 * Usage: npx ts-node scripts/validate-state-config.ts <STATE_CODE>
 * Example: npx ts-node scripts/validate-state-config.ts KY
 *
 * Checks:
 * 1. JSON schema validation
 * 2. Program content exists for each programId
 * 3. Income limits are reasonable (not zero for non-template)
 * 4. Benefit interaction references exist as programs
 * 5. Action plan references exist as programs
 */

import * as fs from 'fs';
import * as path from 'path';
import Ajv from 'ajv';

const configDir = path.join(process.cwd(), 'src/lib/rules/config');
const contentDir = path.join(process.cwd(), 'src/content/programs');

const stateCode = process.argv[2];

if (!stateCode) {
  console.error('Usage: npx ts-node scripts/validate-state-config.ts <STATE_CODE>');
  console.error('Example: npx ts-node scripts/validate-state-config.ts KY');
  process.exit(1);
}

let errors = 0;
let warnings = 0;

function error(msg: string) {
  console.error(`  ERROR: ${msg}`);
  errors++;
}

function warn(msg: string) {
  console.warn(`  WARNING: ${msg}`);
  warnings++;
}

function ok(msg: string) {
  console.log(`  OK: ${msg}`);
}

async function validate() {
  console.log(`\nValidating state configuration: ${stateCode}\n`);

  // 1. Find and load config
  console.log('--- Schema Validation ---');
  const entries = fs.readdirSync(configDir, { withFileTypes: true });
  const stateDirs = entries.filter(e => e.isDirectory() && e.name !== '_template' && e.name !== 'federal');

  let configPath: string | null = null;
  for (const dir of stateDirs) {
    try {
      const testPath = path.join(configDir, dir.name, 'programs.json');
      const content = JSON.parse(fs.readFileSync(testPath, 'utf-8'));
      if (content.stateCode === stateCode) {
        configPath = testPath;
        break;
      }
    } catch {
      continue;
    }
  }

  if (!configPath) {
    error(`No config directory found for state code: ${stateCode}`);
    return;
  }

  ok(`Found config at: ${configPath}`);

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const schema = JSON.parse(fs.readFileSync(path.join(configDir, 'schema.json'), 'utf-8'));

  // Schema validation
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  if (validate(config)) {
    ok('JSON schema validation passed');
  } else {
    error(`JSON schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
  }

  // 2. Check program content
  console.log('\n--- Program Content ---');
  const programIds = config.programs.map((p: any) => p.programId);

  // We can't easily import TS modules from a script, so check for file existence
  const contentFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts' && f !== '_template.ts' && f !== 'recertification.ts');

  // Read index.ts to check programContentMap entries
  const indexContent = fs.readFileSync(path.join(contentDir, 'index.ts'), 'utf-8');

  for (const programId of programIds) {
    // Check if programId is in the content map (or has a federal fallback)
    if (indexContent.includes(`'${programId}'`)) {
      ok(`Content registered for ${programId}`);
    } else {
      // Check federal fallback
      const baseName = programId.split('-').slice(1).join('-');
      const federalId = `federal-${baseName}`;
      if (indexContent.includes(`'${federalId}'`)) {
        ok(`Federal fallback content available for ${programId} (via ${federalId})`);
      } else {
        warn(`No content found for ${programId} - will need a content file or federal fallback`);
      }
    }
  }

  // 3. Check income limits
  console.log('\n--- Income Limits ---');
  if (config.incomeLimits) {
    for (const [key, limits] of Object.entries(config.incomeLimits as Record<string, any>)) {
      if (key === '_comment') continue;
      const values = Object.values(limits).filter((v): v is number => typeof v === 'number');
      if (values.length === 0) {
        error(`${key}: no income limit values defined`);
      } else if (values.some(v => v === 0)) {
        warn(`${key}: has zero-value income limits (is this intentional?)`);
      } else {
        const min = Math.min(...values);
        const max = Math.max(...values);
        if (min < 100) {
          warn(`${key}: unusually low income limit ($${min}/month)`);
        }
        if (max > 50000) {
          warn(`${key}: unusually high income limit ($${max}/month)`);
        }
        ok(`${key}: ${values.length} household sizes, range $${min}-$${max}/month`);
      }
    }
  }

  // 4. Check benefit interactions
  console.log('\n--- Benefit Interactions ---');
  if (config.benefitInteractions && config.benefitInteractions.length > 0) {
    for (const interaction of config.benefitInteractions) {
      const programNames = config.programs.map((p: any) => p.programName);
      for (const prog of interaction.programs) {
        if (prog === 'private-insurance') continue;
        if (!programNames.includes(prog)) {
          warn(`Interaction references unknown program: ${prog}`);
        }
      }
    }
    ok(`${config.benefitInteractions.length} benefit interactions defined`);
  } else {
    warn('No benefit interactions defined');
  }

  // 5. Check action plan
  console.log('\n--- Action Plan ---');
  if (config.actionPlanOrder && config.actionPlanOrder.length > 0) {
    const programNames = config.programs.map((p: any) => p.programName);
    for (const rule of config.actionPlanOrder) {
      if (!programNames.includes(rule.programName)) {
        warn(`Action plan references unknown program: ${rule.programName}`);
      }
    }
    ok(`${config.actionPlanOrder.length} action plan steps defined`);
  } else {
    warn('No action plan order defined');
  }

  // 6. Check enrichment completeness
  console.log('\n--- Enrichment Data ---');
  for (const program of config.programs) {
    if (program.enrichment) {
      const e = program.enrichment;
      if (!e.eligibleReasons || e.eligibleReasons.length === 0) {
        warn(`${program.programName}: no eligible reasons defined`);
      }
      if (!e.ineligibleReasons || e.ineligibleReasons.length === 0) {
        warn(`${program.programName}: no ineligible reasons defined`);
      }
      if (!e.nextSteps || e.nextSteps.length === 0) {
        warn(`${program.programName}: no next steps defined`);
      }
      if (!e.requiredDocuments || e.requiredDocuments.length === 0) {
        warn(`${program.programName}: no required documents defined`);
      }
      if (!e.priority) {
        warn(`${program.programName}: no priority defined`);
      }
      ok(`${program.programName}: enrichment data present`);
    } else {
      warn(`${program.programName}: no enrichment data (will use generic messages)`);
    }
  }

  // Summary
  console.log('\n--- Summary ---');
  console.log(`  State: ${config.stateName} (${config.stateCode})`);
  console.log(`  Coverage: ${config.coverageLevel || 'not specified'}`);
  console.log(`  Programs: ${config.programs.length}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Warnings: ${warnings}`);

  if (errors > 0) {
    console.log('\n  FAILED - fix errors above before deploying');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n  PASSED with warnings');
  } else {
    console.log('\n  PASSED');
  }
}

validate().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
