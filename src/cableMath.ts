export interface CableSystemInputs {
  railHeightInches: 36 | 42 | 39.37; // 39.37 inches ~ 1000mm (NZBC)
  runSpanFeet: number;
  postSpacingInches: number;
  cableDiameterInches: 0.125 | 0.1875; // 1/8" or 3/16"
}

export interface DualUnitValue {
  imperial: number;
  metric: number;
  unitImperial: string;
  unitMetric: string;
}

export interface CableSystemOutputs {
  numberOfRuns: number;
  verticalCableSpacingInches: number;
  isSphereCompliant: boolean; // Must not allow 4" (100mm) sphere through
  totalLinearCableFeet: number;
  estimatedTensionPerRunLbf: number;
  totalEndPostTensionLbf: number;

  // Localized Metric Deliverables
  verticalCableSpacingMm: number;
  totalLinearCableMeters: number;
  estimatedTensionPerRunKn: number;
  totalEndPostTensionKn: number;

  // Structured Dual-Unit Accessors for UI Layer
  spacing: DualUnitValue;
  totalCable: DualUnitValue;
  terminalLoad: DualUnitValue;
  tensionPerRun: DualUnitValue;
}

// Exact Conversion Constants
const MM_PER_INCH = 25.4;
const METERS_PER_FOOT = 0.3048;
const NEWTONS_PER_LBF = 4.4482216;

export function calculateCableSystem(inputs: CableSystemInputs): CableSystemOutputs {
  if (inputs.runSpanFeet <= 0 || inputs.postSpacingInches <= 0) {
    throw new Error("Span and spacing must be positive numbers.");
  }

  // Deduct bottom clearance (3") and top rail profile (1.5")
  const usableHeightInches = inputs.railHeightInches - 4.5;
  const targetSpacingInches = 3.125;
  const numberOfOpenings = Math.ceil(usableHeightInches / targetSpacingInches);
  const numberOfRuns = numberOfOpenings - 1;
  const verticalCableSpacingInches = Number((usableHeightInches / numberOfOpenings).toFixed(3));

  // Imperial calculations
  const isSphereCompliant = verticalCableSpacingInches <= 3.25;
  const totalLinearCableFeet = Number((inputs.runSpanFeet * numberOfRuns * 1.1).toFixed(1));
  const estimatedTensionPerRunLbf = inputs.cableDiameterInches === 0.125 ? 225 : 300;
  const totalEndPostTensionLbf = numberOfRuns * estimatedTensionPerRunLbf;

  // Metric derivations
  // Round spacing to nearest whole integer mm (standard trade practice in NZ/AU)
  const verticalCableSpacingMm = Math.round(verticalCableSpacingInches * MM_PER_INCH);
  // Total cable in meters (1 decimal place)
  const totalLinearCableMeters = Number((totalLinearCableFeet * METERS_PER_FOOT).toFixed(1));
  // Convert lbf to kN (kilonewtons, 2 decimal places)
  const estimatedTensionPerRunKn = Number(((estimatedTensionPerRunLbf * NEWTONS_PER_LBF) / 1000).toFixed(2));
  const totalEndPostTensionKn = Number(((totalEndPostTensionLbf * NEWTONS_PER_LBF) / 1000).toFixed(2));

  return {
    numberOfRuns,
    verticalCableSpacingInches,
    isSphereCompliant,
    totalLinearCableFeet,
    estimatedTensionPerRunLbf,
    totalEndPostTensionLbf,

    // Metric outputs
    verticalCableSpacingMm,
    totalLinearCableMeters,
    estimatedTensionPerRunKn,
    totalEndPostTensionKn,

    // Dual-unit objects
    spacing: {
      imperial: verticalCableSpacingInches,
      metric: verticalCableSpacingMm,
      unitImperial: "in",
      unitMetric: "mm",
    },
    totalCable: {
      imperial: totalLinearCableFeet,
      metric: totalLinearCableMeters,
      unitImperial: "ft",
      unitMetric: "m",
    },
    terminalLoad: {
      imperial: totalEndPostTensionLbf,
      metric: totalEndPostTensionKn,
      unitImperial: "lbf",
      unitMetric: "kN",
    },
    tensionPerRun: {
      imperial: estimatedTensionPerRunLbf,
      metric: estimatedTensionPerRunKn,
      unitImperial: "lbf",
      unitMetric: "kN",
    },
  };
}