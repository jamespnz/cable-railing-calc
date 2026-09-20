import { describe, it, expect } from 'vitest';
import { calculateCableSystem, type CableSystemInputs } from './cableMath';

describe('Cable Railing Deterministic Math Engine', () => {
  it('enforces sphere compliance for standard 36-inch residential railing', () => {
    const inputs: CableSystemInputs = {
      railHeightInches: 36,
      runSpanFeet: 20,
      postSpacingInches: 48,
      cableDiameterInches: 0.125,
    };

    const result = calculateCableSystem(inputs);

    expect(result.numberOfRuns).toBeGreaterThanOrEqual(9);
    expect(result.verticalCableSpacingInches).toBeLessThanOrEqual(3.25);
    expect(result.isSphereCompliant).toBe(true);
    expect(result.totalLinearCableFeet).toBeGreaterThan(inputs.runSpanFeet * result.numberOfRuns);
  });

  it('calculates higher cumulative tension for 42-inch commercial systems with 3/16" wire', () => {
    const inputs: CableSystemInputs = {
      railHeightInches: 42,
      runSpanFeet: 30,
      postSpacingInches: 42,
      cableDiameterInches: 0.1875,
    };

    const result = calculateCableSystem(inputs);

    expect(result.estimatedTensionPerRunLbf).toBe(300);
    expect(result.totalEndPostTensionLbf).toBe(result.numberOfRuns * 300);
  });

  it('throws an explicit error when supplied non-positive geometry', () => {
    const invalidInputs: CableSystemInputs = {
      railHeightInches: 36,
      runSpanFeet: -10,
      postSpacingInches: 48,
      cableDiameterInches: 0.125,
    };

    expect(() => calculateCableSystem(invalidInputs)).toThrow('Span and spacing must be positive numbers.');
  });
});