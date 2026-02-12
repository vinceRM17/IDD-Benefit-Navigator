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

      // Should return results for all programs (Medicaid, SNAP, SSI, Michelle P, HCB, SCL)
      expect(results).toHaveLength(6);
      expect(results.map(r => r.program)).toContain('Medicaid');
      expect(results.map(r => r.program)).toContain('SNAP');
      expect(results.map(r => r.program)).toContain('SSI');
      expect(results.map(r => r.program)).toContain('Michelle P Waiver');
      expect(results.map(r => r.program)).toContain('HCB Waiver');
      expect(results.map(r => r.program)).toContain('SCL Waiver');

      // Medicaid should be likely eligible (income $2000 < $3,700 limit for HH4)
      const medicaid = results.find(r => r.program === 'Medicaid');
      expect(medicaid).toBeDefined();
      expect(medicaid?.eligible).toBe(true);
      expect(medicaid?.confidence).toBe('likely');
      expect(medicaid?.reasons).toContain('Income below Kentucky Medicaid limit');

      // SNAP should be likely eligible (income $2000 < $5,360 limit for HH4)
      const snap = results.find(r => r.program === 'SNAP');
      expect(snap).toBeDefined();
      expect(snap?.eligible).toBe(true);
      expect(snap?.confidence).toBe('likely');
      expect(snap?.reasons).toContain('Income below Kentucky SNAP limit');

      // Michelle P Waiver should be possible (IDD diagnosis, no age restriction)
      const waiver = results.find(r => r.program === 'Michelle P Waiver');
      expect(waiver).toBeDefined();
      expect(waiver?.eligible).toBe(true);
      expect(waiver?.confidence).toBe('possible');
      expect(waiver?.reasons).toContain('IDD diagnosis qualifies for waiver services');

      // SSI should be possible (disability present)
      const ssi = results.find(r => r.program === 'SSI');
      expect(ssi).toBeDefined();
      expect(ssi?.eligible).toBe(true);
      expect(ssi?.confidence).toBe('possible');

      // HCB Waiver should be ineligible (age 8 < 18)
      const hcb = results.find(r => r.program === 'HCB Waiver');
      expect(hcb).toBeDefined();
      expect(hcb?.eligible).toBe(false);
      expect(hcb?.confidence).toBe('unlikely');
      expect(hcb?.reasons).toContain('Must be 18 or older for HCB Waiver');

      // SCL Waiver should be eligible (age 8 >= 3, has disability)
      const scl = results.find(r => r.program === 'SCL Waiver');
      expect(scl).toBeDefined();
      expect(scl?.eligible).toBe(true);
      expect(scl?.confidence).toBe('possible');
      expect(scl?.reasons).toContain('IDD diagnosis and age 3+ qualifies for SCL waiver');
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

      // Medicaid should be unlikely (income $8000 > $2,434 limit for HH2)
      const medicaid = results.find(r => r.program === 'Medicaid');
      expect(medicaid).toBeDefined();
      expect(medicaid?.eligible).toBe(false);
      expect(medicaid?.confidence).toBe('unlikely');
      expect(medicaid?.reasons).toContain('Income above Kentucky Medicaid limit');

      // SNAP should be unlikely (income $8000 > $3,526 limit for HH2)
      const snap = results.find(r => r.program === 'SNAP');
      expect(snap).toBeDefined();
      expect(snap?.eligible).toBe(false);
      expect(snap?.confidence).toBe('unlikely');

      // Michelle P Waiver should be possible (IDD diagnosis, no age restriction)
      const waiver = results.find(r => r.program === 'Michelle P Waiver');
      expect(waiver).toBeDefined();
      expect(waiver?.eligible).toBe(true);
      expect(waiver?.confidence).toBe('possible');
      expect(waiver?.reasons).toContain('IDD diagnosis qualifies for waiver services');

      // SSI should be possible but with income note
      const ssi = results.find(r => r.program === 'SSI');
      expect(ssi).toBeDefined();
      expect(ssi?.eligible).toBe(true);
      expect(ssi?.confidence).toBe('possible');
      expect(ssi?.reasons).toContain('High income may reduce SSI benefit amount');

      // HCB Waiver should be ineligible (age 15 < 18)
      const hcb = results.find(r => r.program === 'HCB Waiver');
      expect(hcb).toBeDefined();
      expect(hcb?.eligible).toBe(false);
      expect(hcb?.reasons).toContain('Must be 18 or older for HCB Waiver');

      // SCL Waiver should be eligible (age 15 >= 3, has disability)
      const scl = results.find(r => r.program === 'SCL Waiver');
      expect(scl).toBeDefined();
      expect(scl?.eligible).toBe(true);
      expect(scl?.confidence).toBe('possible');
    });

    test('handles income exactly at limit as eligible', async () => {
      const facts: HouseholdFacts = {
        state: 'KY',
        householdSize: 1,
        monthlyIncome: 1800, // Exactly at KY Medicaid limit for HH1
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

      // Should return exactly 6 programs
      expect(results).toHaveLength(6);

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

    test('adult (age 25) qualifies for Michelle P Waiver with disability', async () => {
      const facts: HouseholdFacts = {
        state: 'KY',
        householdSize: 1,
        monthlyIncome: 1500,
        hasDisabilityDiagnosis: true,
        age: 25,
        hasInsurance: false,
      };

      const results = await evaluateEligibility('KY', facts);

      // Michelle P Waiver has no age restriction — adults qualify too
      const waiver = results.find(r => r.program === 'Michelle P Waiver');
      expect(waiver).toBeDefined();
      expect(waiver?.eligible).toBe(true);
      expect(waiver?.confidence).toBe('possible');
      expect(waiver?.reasons).toContain('IDD diagnosis qualifies for waiver services');
    });

    test('HCB Waiver eligible for adult with disability', async () => {
      const facts: HouseholdFacts = {
        state: 'KY',
        householdSize: 1,
        monthlyIncome: 1500,
        hasDisabilityDiagnosis: true,
        age: 25,
        hasInsurance: false,
      };

      const results = await evaluateEligibility('KY', facts);

      const hcb = results.find(r => r.program === 'HCB Waiver');
      expect(hcb).toBeDefined();
      expect(hcb?.eligible).toBe(true);
      expect(hcb?.confidence).toBe('possible');
      expect(hcb?.reasons).toContain('IDD diagnosis and age 18+ qualifies for HCB waiver');
    });

    test('HCB Waiver ineligible for child under 18', async () => {
      const facts: HouseholdFacts = {
        state: 'KY',
        householdSize: 4,
        monthlyIncome: 2000,
        hasDisabilityDiagnosis: true,
        age: 10,
        hasInsurance: false,
      };

      const results = await evaluateEligibility('KY', facts);

      const hcb = results.find(r => r.program === 'HCB Waiver');
      expect(hcb).toBeDefined();
      expect(hcb?.eligible).toBe(false);
      expect(hcb?.confidence).toBe('unlikely');
      expect(hcb?.reasons).toContain('Must be 18 or older for HCB Waiver');
    });

    test('SCL Waiver eligible for child age 3+', async () => {
      const facts: HouseholdFacts = {
        state: 'KY',
        householdSize: 4,
        monthlyIncome: 2000,
        hasDisabilityDiagnosis: true,
        age: 5,
        hasInsurance: false,
      };

      const results = await evaluateEligibility('KY', facts);

      const scl = results.find(r => r.program === 'SCL Waiver');
      expect(scl).toBeDefined();
      expect(scl?.eligible).toBe(true);
      expect(scl?.confidence).toBe('possible');
      expect(scl?.reasons).toContain('IDD diagnosis and age 3+ qualifies for SCL waiver');
    });

    test('SCL Waiver ineligible for child under 3', async () => {
      const facts: HouseholdFacts = {
        state: 'KY',
        householdSize: 4,
        monthlyIncome: 2000,
        hasDisabilityDiagnosis: true,
        age: 2,
        hasInsurance: false,
      };

      const results = await evaluateEligibility('KY', facts);

      const scl = results.find(r => r.program === 'SCL Waiver');
      expect(scl).toBeDefined();
      expect(scl?.eligible).toBe(false);
      expect(scl?.confidence).toBe('unlikely');
      expect(scl?.reasons).toContain('Must be 3 or older for SCL Waiver');
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
