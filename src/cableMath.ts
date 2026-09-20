export interface CableSystemInputs {
  railHeightInches: 36 | 42 | 39.37; // 39.37 inches ~ 1000mm (NZBC)
  runSpanFeet: number;
  postSpacingInches: number;
  cableDiameterInches: 0.125 | 0.1875; // 1/8" or 3/16"
}

export interface CableSystemOutputs {
  numberOfRuns: number;
  verticalCableSpacingInches: number;
  isSphereCompliant: boolean; // Must not allow 4" sphere through under 50 lbf deflection
  totalLinearCableFeet: number;
  estimatedTensionPerRunLbf: number;
  totalEndPostTensionLbf: number;
}

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

  const isSphereCompliant = verticalCableSpacingInches <= 3.25;
  const totalLinearCableFeet = Number((inputs.runSpanFeet * numberOfRuns * 1.1).toFixed(1));
  const estimatedTensionPerRunLbf = inputs.cableDiameterInches === 0.125 ? 225 : 300;
  const totalEndPostTensionLbf = numberOfRuns * estimatedTensionPerRunLbf;

  return {
    numberOfRuns,
    verticalCableSpacingInches,
    isSphereCompliant,
    totalLinearCableFeet,
    estimatedTensionPerRunLbf,
    totalEndPostTensionLbf,
  };
}