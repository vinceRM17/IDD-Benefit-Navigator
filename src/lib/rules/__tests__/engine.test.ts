/**
 * TDD tests for benefit eligibility rules engine
 */

import { evaluateEligibility } from '../engine';
import type { HouseholdFacts, EligibilityResult } from '../types';

describe('EligibilityEngine', () => {
  describe('Kentucky benefit eligibility', () => {
    test('evaluates KY Medicaid eligibility for low-income family', async () => {
      const facts: HouseholdFacts = {
        state: 'KY',
        householdSize: 4,
        monthlyIncome: 2000,
        hasDisabilityDiagnosis: true,
        age: 8,
        hasInsurance: false,
      };

      const results = await evaluateEligibility('KY', facts);

      // Should return results for all programs
      expect(results).toHaveLength(4);
      expect(results.map(r => r.program)).toContain('Medicaid');
      expect(results.map(r => r.program)).toContain('SNAP');
      expect(results.map(r => r.program)).toContain('SSI');
      expect(results.map(r => r.program)).toContain('Michelle P Waiver');

      // Medicaid should be likely eligible (income $2000 < $3450 limit for HH4)
      const medicaid = results.find(r => r.program === 'Medicaid');
      expect(medicaid).toBeDefined();
      expect(medicaid?.eligible).toBe(true);
      expect(medicaid?.confidence).toBe('likely');
      expect(medicaid?.reasons).toContain('Income below Kentucky Medicaid limit');

      // SNAP should be likely eligible (income $2000 < $3250 limit for HH4)
      const snap = results.find(r => r.program === 'SNAP');
      expect(snap).toBeDefined();
      expect(snap?.eligible).toBe(true);
      expect(snap?.confidence).toBe('likely');
      expect(snap?.reasons).toContain('Income below Kentucky SNAP limit');

      // Michelle P Waiver should be possible (IDD diagnosis + under 21)
      const waiver = results.find(r => r.program === 'Michelle P Waiver');
      expect(waiver).toBeDefined();
      expect(waiver?.eligible).toBe(true);
      expect(waiver?.confidence).toBe('possible');
      expect(waiver?.reasons).toContain('IDD diagnosis and age under 21');

      // SSI should be possible (disability present)
      const ssi = results.find(r => r.program === 'SSI');
      expect(ssi).toBeDefined();
      expect(ssi?.eligible).toBe(true);
      expect(ssi?.confidence).toBe('possible');
    });

    test('returns unlikely for high-income family', async () => {
      const facts: HouseholdFacts = {
        state: 'KY',
        householdSize: 2,
        monthlyIncome: 8000,
        hasDisabilityDiagnosis: true,
        age: 15,
        hasInsurance: false,
      };

      const results = await evaluateEligibility('KY', facts);

      // Medicaid should be unlikely (income $8000 > $2268 limit for HH2)
      const medicaid = results.find(r => r.program === 'Medicaid');
      expect(medicaid).toBeDefined();
      expect(medicaid?.eligible).toBe(false);
      expect(medicaid?.confidence).toBe('unlikely');
      expect(medicaid?.reasons).toContain('Income above Kentucky Medicaid limit');

      // SNAP should be unlikely (income $8000 > $2137 limit for HH2)
      const snap = results.find(r => r.program === 'SNAP');
      expect(snap).toBeDefined();
      expect(snap?.eligible).toBe(false);
      expect(snap?.confidence).toBe('unlikely');

      // Michelle P Waiver should still be possible (IDD diagnosis, no income limit)
      const waiver = results.find(r => r.program === 'Michelle P Waiver');
      expect(waiver).toBeDefined();
      expect(waiver?.eligible).toBe(true);
      expect(waiver?.confidence).toBe('possible');
      expect(waiver?.reasons).toContain('IDD diagnosis and age under 21');

      // SSI should be possible but with income note
      const ssi = results.find(r => r.program === 'SSI');
      expect(ssi).toBeDefined();
      expect(ssi?.eligible).toBe(true);
      expect(ssi?.confidence).toBe('possible');
      expect(ssi?.reasons).toContain('High income may reduce SSI benefit amount');
    });

    test('handles income exactly at limit as eligible', async () => {
      const facts: HouseholdFacts = {
        state: 'KY',
        householdSize: 1,
        monthlyIncome: 1677, // Exactly at KY Medicaid limit for HH1
        hasDisabilityDiagnosis: false,
        age: 30,
        hasInsurance: false,
      };

      const results = await evaluateEligibility('KY', facts);

      const medicaid = results.find(r => r.program === 'Medicaid');
      expect(medicaid).toBeDefined();
      expect(medicaid?.eligible).toBe(true);
      expect(medicaid?.confidence).toBe('likely');
      expect(medicaid?.reasons).toContain('Income at or below Kentucky Medicaid limit');
    });

    test('returns validation error for missing required facts', async () => {
      const invalidFacts = {
        state: 'KY',
        // missing householdSize
        monthlyIncome: 2000,
        hasDisabilityDiagnosis: true,
        age: 8,
        hasInsurance: false,
      } as HouseholdFacts;

      await expect(evaluateEligibility('KY', invalidFacts)).rejects.toThrow(
        /required fact.*householdSize/i
      );
    });

    test('categorical eligibility: SSI recipients eligible for Medicaid', async () => {
      const facts: HouseholdFacts = {
        state: 'KY',
        householdSize: 1,
        monthlyIncome: 900,
        hasDisabilityDiagnosis: true,
        age: 25,
        hasInsurance: false,
        receivesSSI: true,
      };

      const results = await evaluateEligibility('KY', facts);

      const medicaid = results.find(r => r.program === 'Medicaid');
      expect(medicaid).toBeDefined();
      expect(medicaid?.eligible).toBe(true);
      expect(medicaid?.confidence).toBe('likely');
      expect(medicaid?.reasons).toContain('SSI recipients are categorically eligible');
    });

    test('evaluates all programs and returns results for each', async () => {
      const facts: HouseholdFacts = {
        state: 'KY',
        householdSize: 3,
        monthlyIncome: 2500,
        hasDisabilityDiagnosis: true,
        age: 12,
        hasInsurance: false,
      };

      const results = await evaluateEligibility('KY', facts);

      // Should return exactly 4 programs
      expect(results).toHaveLength(4);

      // Each result should have required fields
      results.forEach(result => {
        expect(result).toHaveProperty('program');
        expect(result).toHaveProperty('eligible');
        expect(result).toHaveProperty('confidence');
        expect(result).toHaveProperty('reasons');
        expect(Array.isArray(result.reasons)).toBe(true);
        expect(['likely', 'possible', 'unlikely']).toContain(result.confidence);
      });
    });
  });

  describe('State-agnostic architecture', () => {
    test('works with arbitrary state config without code changes', async () => {
      // This test uses a TEST state configuration to prove ARCH-03
      // (new state = config only, no code changes needed)
      const facts: HouseholdFacts = {
        state: 'TEST',
        householdSize: 2,
        monthlyIncome: 1500,
        hasDisabilityDiagnosis: false,
        age: 5,
        hasInsurance: false,
      };

      const results = await evaluateEligibility('TEST', facts);

      // Should work without modifying engine code
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);

      // Verify each result has correct structure
      results.forEach(result => {
        expect(result).toHaveProperty('program');
        expect(result).toHaveProperty('eligible');
        expect(result).toHaveProperty('confidence');
        expect(result).toHaveProperty('reasons');
      });
    });
  });
});
