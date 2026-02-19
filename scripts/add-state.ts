#!/usr/bin/env npx ts-node
/**
 * Scaffold a new state configuration
 *
 * Usage: npx ts-node scripts/add-state.ts <STATE_CODE> <STATE_NAME>
 * Example: npx ts-node scripts/add-state.ts OH Ohio
 *
 * Creates:
 * 1. Config directory with programs.json (from template)
 * 2. Placeholder content files
 * 3. Updates states.ts coverage level to 'full'
 */

import * as fs from 'fs';
import * as path from 'path';

const stateCode = process.argv[2];
const stateName = process.argv.slice(3).join(' ');

if (!stateCode || !stateName) {
  console.error('Usage: npx ts-node scripts/add-state.ts <STATE_CODE> <STATE_NAME>');
  console.error('Example: npx ts-node scripts/add-state.ts OH Ohio');
  process.exit(1);
}

const configDir = path.join(process.cwd(), 'src/lib/rules/config');
const contentDir = path.join(process.cwd(), 'src/content/programs');
const statesFile = path.join(process.cwd(), 'src/lib/data/states.ts');

const stateDir = path.join(configDir, stateName.toLowerCase().replace(/\s+/g, '-'));
const lowerCode = stateCode.toLowerCase();

console.log(`\nScaffolding new state: ${stateName} (${stateCode})\n`);

// 1. Create config directory
if (fs.existsSync(stateDir)) {
  console.log(`  Config directory already exists: ${stateDir}`);
} else {
  fs.mkdirSync(stateDir, { recursive: true });
  console.log(`  Created config directory: ${stateDir}`);
}

// 2. Copy template and customize
const templatePath = path.join(configDir, '_template', 'programs.json');
const configPath = path.join(stateDir, 'programs.json');

if (fs.existsSync(configPath)) {
  console.log(`  Config file already exists: ${configPath}`);
} else {
  let template = fs.readFileSync(templatePath, 'utf-8');
  const config = JSON.parse(template);

  // Remove template-only fields
  delete config._comment;
  delete config._instructions;

  // Update state info
  config.stateCode = stateCode;
  config.stateName = stateName;

  // Update programIds
  config.programs = config.programs.map((p: any) => ({
    ...p,
    programId: p.programId.replace('xx-', `${lowerCode}-`),
  }));

  // Update action plan references
  if (config.actionPlanOrder) {
    config.actionPlanOrder = config.actionPlanOrder.map((a: any) => ({ ...a }));
  }

  // Remove _comment fields from incomeLimits
  if (config.incomeLimits) {
    for (const [key, val] of Object.entries(config.incomeLimits)) {
      if (typeof val === 'object' && val !== null) {
        delete (val as any)._comment;
      }
    }
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
  console.log(`  Created config file: ${configPath}`);
}

// 3. Update states.ts coverage level
const statesContent = fs.readFileSync(statesFile, 'utf-8');
const stateEntry = `{ code: '${stateCode}', name: '${stateName}', coverageLevel: 'federal-only' }`;
const updatedEntry = `{ code: '${stateCode}', name: '${stateName}', coverageLevel: 'full' }`;

if (statesContent.includes(updatedEntry)) {
  console.log(`  states.ts already has '${stateCode}' as full coverage`);
} else if (statesContent.includes(stateEntry)) {
  const updated = statesContent.replace(stateEntry, updatedEntry);
  fs.writeFileSync(statesFile, updated);
  console.log(`  Updated states.ts: ${stateCode} coverage level set to 'full'`);
} else {
  console.log(`  WARNING: Could not find ${stateCode} entry in states.ts`);
}

console.log(`
Next steps:
  1. Edit ${configPath}
     - Set real income limits for Medicaid (by household size)
     - Add state-specific waiver programs
     - Configure benefit interactions
     - Set action plan order
  2. Create content files in ${contentDir}/
     - e.g., ${lowerCode}-medicaid.ts, ${lowerCode}-snap.ts
     - Register them in ${contentDir}/index.ts
  3. Add partners in src/content/resources/partners.ts
  4. Add portals in src/content/resources/portals.ts
  5. Validate: npx ts-node scripts/validate-state-config.ts ${stateCode}
`);
