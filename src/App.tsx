import React, { useState, useMemo } from 'react';
import { calculateCableSystem } from './cableMath';
import type { CableSystemInputs, CableSystemOutputs } from './cableMath';

export const App: React.FC = () => {
  const [inputs, setInputs] = useState<CableSystemInputs>({
    railHeightInches: 36,
    runSpanFeet: 20,
    postSpacingInches: 48,
    cableDiameterInches: 0.125,
  });

  const calculation = useMemo<CableSystemOutputs | null>(() => {
    try {
      return calculateCableSystem(inputs);
    } catch {
      return null;
    }
  }, [inputs]);

  const postCount = useMemo(() => {
    if (inputs.runSpanFeet <= 0 || inputs.postSpacingInches <= 0) return 2;
    return Math.floor((inputs.runSpanFeet * 12) / inputs.postSpacingInches) + 1;
  }, [inputs.runSpanFeet, inputs.postSpacingInches]);

  const handleInputChange = <K extends keyof CableSystemInputs>(
    field: K,
    value: CableSystemInputs[K]
  ) => {
    setInputs((prev: CableSystemInputs) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <header className="max-w-5xl mx-auto mb-8 border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse" />
            Cable Railing Compliance & Tension Engine
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            IBC / IRC / NZBC 4-Inch Sphere Rule Compliance & Deterministic Load Estimator
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1 bg-slate-900 border border-slate-800 rounded text-cyan-400 self-start md:self-auto">
          ZERO-TELEMETRY // CLIENT-SIDE MEMORY
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <section className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-sm font-semibold tracking-wider text-slate-300 uppercase border-b border-slate-800 pb-2">
            Geometric Parameters
          </h2>

          {/* Railing Height */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Railing System Height
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleInputChange('railHeightInches', 36)}
                className={`py-2 px-2 text-xs font-medium rounded-lg border transition-colors ${
                  inputs.railHeightInches === 36
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                36" (IRC)
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('railHeightInches', 39.37)}
                className={`py-2 px-2 text-xs font-medium rounded-lg border transition-colors ${
                  inputs.railHeightInches === 39.37
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                1.0m (NZBC)
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('railHeightInches', 42)}
                className={`py-2 px-2 text-xs font-medium rounded-lg border transition-colors ${
                  inputs.railHeightInches === 42
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                42" (IBC)
              </button>
            </div>
          </div>

          {/* Run Span */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="runSpan" className="text-slate-400">Total Run Span</label>
              <span className="font-mono text-cyan-400">{inputs.runSpanFeet} ft</span>
            </div>
            <input
              id="runSpan"
              type="range"
              min="4"
              max="60"
              step="1"
              value={inputs.runSpanFeet}
              onChange={(e) => handleInputChange('runSpanFeet', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Post Spacing */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="postSpacing" className="text-slate-400">Post Spacing</label>
              <span className="font-mono text-cyan-400">{inputs.postSpacingInches}" ({(inputs.postSpacingInches / 12).toFixed(1)} ft)</span>
            </div>
            <input
              id="postSpacing"
              type="range"
              min="36"
              max="72"
              step="6"
              value={inputs.postSpacingInches}
              onChange={(e) => handleInputChange('postSpacingInches', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Recommended: ≤ 48" to prevent excessive deflection under code load.
            </p>
          </div>

          {/* Cable Diameter */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Cable Diameter (1x19 316 Stainless)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange('cableDiameterInches', 0.125)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                  inputs.cableDiameterInches === 0.125
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                1/8" (225 lbf/run)
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('cableDiameterInches', 0.1875)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                  inputs.cableDiameterInches === 0.1875
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                3/16" (300 lbf/run)
              </button>
            </div>
          </div>
        </section>

        {/* Visualizer & Metrics Column */}
        <section className="lg:col-span-7 space-y-6">
          {/* Dynamic SVG Elevation Preview */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
                Elevation & Deflection Preview
              </h2>
              {calculation && (
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                  calculation.isSphereCompliant
                    ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-600 text-rose-300'
                }`}>
                  {calculation.isSphereCompliant ? '4" SPHERE COMPLIANT' : 'NON-COMPLIANT SPACING'}
                </span>
              )}
            </div>

            <div className="w-full bg-slate-950 rounded-lg p-4 border border-slate-850 overflow-hidden">
              <svg viewBox="0 0 500 220" className="w-full h-44 select-none">
                {/* Top Handrail */}
                <rect x="30" y="25" width="440" height="10" fill="#334155" rx="2" />
                {/* Deck Floor Line */}
                <line x1="20" y1="195" x2="480" y2="195" stroke="#1e293b" strokeWidth="3" />

                {/* Left End Post */}
                <rect x="35" y="35" width="12" height="160" fill="#475569" rx="1" />
                {/* Right End Post */}
                <rect x="453" y="35" width="12" height="160" fill="#475569" rx="1" />

                {/* Intermediate Posts */}
                {postCount > 2 && (
                  Array.from({ length: Math.min(postCount - 2, 4) }).map((_, idx) => {
                    const step = 406 / (Math.min(postCount - 2, 4) + 1);
                    return (
                      <rect
                        key={`post-${idx}`}
                        x={47 + step * (idx + 1) - 4}
                        y="35"
                        width="8"
                        height="160"
                        fill="#334155"
                        opacity="0.8"
                      />
                    );
                  })
                )}

                {/* Cable Runs */}
                {calculation && (
                  Array.from({ length: calculation.numberOfRuns }).map((_, idx) => {
                    const usableHeight = 150;
                    const y = 35 + ((usableHeight / (calculation.numberOfRuns + 1)) * (idx + 1));
                    return (
                      <g key={`cable-${idx}`}>
                        <line
                          x1="47"
                          y1={y}
                          x2="453"
                          y2={y}
                          stroke="#38bdf8"
                          strokeWidth={inputs.cableDiameterInches === 0.1875 ? "2" : "1.2"}
                          strokeOpacity="0.75"
                        />
                      </g>
                    );
                  })
                )}

                {/* Dimension Labels */}
                <text x="250" y="18" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  {inputs.runSpanFeet} ft Span ({inputs.postSpacingInches}" Spacing)
                </text>
                <text x="18" y="120" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace" transform="rotate(-90 18 120)">
                  {inputs.railHeightInches}" Height
                </text>
              </svg>
            </div>
          </div>

          {/* Metric Outputs & BOM */}
          {calculation && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-medium">Cable Specifications</p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Run Count:</span>
                    <span className="font-mono text-cyan-300 font-bold">{calculation.numberOfRuns} lines</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Vertical Spacing:</span>
                    <span className="font-mono text-cyan-300 font-bold">{calculation.verticalCableSpacingInches.toFixed(2)}"</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Total Cable (incl. 10% waste):</span>
                    <span className="font-mono text-cyan-300 font-bold">{calculation.totalLinearCableFeet} ft</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-medium">Structural Load & Hardware</p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Estimated Post Count:</span>
                    <span className="font-mono text-cyan-300 font-bold">{postCount} posts</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">End Fitting Pairs:</span>
                    <span className="font-mono text-cyan-300 font-bold">{calculation.numberOfRuns} pairs</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Cumulative Terminal Load:</span>
                    <span className="font-mono text-amber-400 font-bold">{calculation.totalEndPostTensionLbf} lbf</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;