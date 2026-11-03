import React from 'react';
import {
  Sparkles,
  Sun,
  Layout,
  HardHat,
  Leaf,
  HelpCircle,
  FileCheck2,
  Layers
} from 'lucide-react';

export default function TechnicalTranslatorBadge({ technicalSummary, clientWords = '' }) {
  if (!technicalSummary) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-sky-500/20 relative overflow-hidden">
      
      {/* Decorative Blueprint Grid Accent */}
      <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-cyan-300 text-slate-900 flex items-center justify-center font-bold shadow-lg shadow-sky-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-white">
                Architectural Translation Matrix
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-wider">
                Automated Spec
              </span>
            </div>
            <p className="text-xs text-sky-200/70">
              Bridges customer plain-English desires into buildable engineering parameters
            </p>
          </div>
        </div>

        {technicalSummary.architectural_classification && (
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono font-semibold text-sky-300">
            {technicalSummary.architectural_classification}
          </div>
        )}
      </div>

      {/* Grid of Translated Specs */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        
        {/* Spatial Layout */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-sky-500/30 transition-colors">
          <div className="flex items-center gap-2 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Layout className="w-4 h-4 text-sky-400" />
            Spatial Zoning & Floor Flow
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {technicalSummary.spatial_layout || 'Balanced spatial program with distinct public and private zoning.'}
          </p>
        </div>

        {/* Fenestration & Daylight */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-sky-500/30 transition-colors">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sun className="w-4 h-4 text-amber-400" />
            Fenestration & Daylight Factor
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {technicalSummary.fenestration_and_lighting || 'Optimized solar orientation with operable thermal units.'}
          </p>
        </div>

        {/* Structural & Materials */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-sky-500/30 transition-colors">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <HardHat className="w-4 h-4 text-cyan-400" />
            Structural Frame & Materials
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {technicalSummary.structural_and_materials || 'Standard load-bearing framing with acoustic drywall.'}
          </p>
        </div>

        {/* MEP & Sustainability */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-sky-500/30 transition-colors">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            Sustainability & MEP Systems
          </div>
          <ul className="text-xs text-slate-200 space-y-1.5 list-disc list-inside">
            {Array.isArray(technicalSummary.sustainability_and_mep) ? (
              technicalSummary.sustainability_and_mep.map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
              ))
            ) : (
              <li>{technicalSummary.sustainability_and_mep}</li>
            )}
          </ul>
        </div>

      </div>

      {/* Alignment Checklist for Kickoff */}
      {technicalSummary.kickoff_alignment_checklist && technicalSummary.kickoff_alignment_checklist.length > 0 && (
        <div className="relative z-10 mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-300 uppercase tracking-wider mb-2.5">
            <HelpCircle className="w-4 h-4 text-sky-400" />
            Designer Kickoff Alignment Questions:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {technicalSummary.kickoff_alignment_checklist.map((q, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg px-3 py-2 text-[11px] text-slate-300 flex items-start gap-2 border border-white/5">
                <span className="text-sky-400 font-bold">0{idx + 1}.</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
