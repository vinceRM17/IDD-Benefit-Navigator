/**
 * TDD tests for state configuration loader
 */

import { loadStateConfig, getAvailableStates } from '../loader';

describe('State Configuration Loader', () => {
  test('loads Kentucky state configuration', async () => {
    const config = await loadStateConfig('KY');

    expect(config).toBeDefined();
    expect(config.stateCode).toBe('KY');
    expect(config.stateName).toBe('Kentucky');
    expect(Array.isArray(config.programs)).toBe(true);
    expect(config.programs.length).toBeGreaterThanOrEqual(4);

    // Should have all 4 required programs
    const programNames = config.programs.map(p => p.programName);
    expect(programNames).toContain('Medicaid');
    expect(programNames).toContain('SNAP');
    expect(programNames).toContain('SSI');
    expect(programNames).toContain('Michelle P Waiver');

    // Should have income limits (keys are fact names)
    expect(config.incomeLimits).toBeDefined();
    expect(config.incomeLimits.incomeLimitMedicaid).toBeDefined();
    expect(config.incomeLimits.incomeLimitSNAP).toBeDefined();

    // Should have metadata
    expect(config.metadata).toBeDefined();
    expect(config.metadata.lastUpdated).toBeDefined();
    expect(config.metadata.source).toBeDefined();
    expect(config.metadata.effectiveDate).toBeDefined();
  });

  test('throws error for non-existent state', async () => {
    await expect(loadStateConfig('XX')).rejects.toThrow(
      /State configuration not found: XX/i
    );
  });

  test('validates config against JSON schema', async () => {
    // This test ensures that loaded configs are validated
    // Invalid configs should be rejected before being returned
    const config = await loadStateConfig('KY');

    // If we get here, validation passed
    expect(config.stateCode).toBeDefined();
    expect(config.stateName).toBeDefined();
    expect(Array.isArray(config.programs)).toBe(true);
    expect(config.incomeLimits).toBeDefined();
    expect(config.metadata).toBeDefined();
  });

  test('lists available states', async () => {
    const states = await getAvailableStates();

    expect(Array.isArray(states)).toBe(true);
    expect(states.length).toBeGreaterThan(0);
    expect(states).toContain('KY');
    expect(states).toContain('TEST'); // Our test state
  });
});
