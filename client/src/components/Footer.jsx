import React from 'react';
import { Compass, CheckCircle } from 'lucide-react';

export default function Footer({ setCurrentView }) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">Build My Vision</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Bridging the communication divide between customers and architectural designers. 
              Translating everyday dreams into feasible blueprints and buildable designs through 
              guided vision prompts, real-time collaboration, and streamlined delivery workflows.
            </p>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setCurrentView('vision-builder')} className="hover:text-white transition-colors">
                  Build Your Vision
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('designers')} className="hover:text-white transition-colors">
                  Architects & Designers
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('portfolios')} className="hover:text-white transition-colors">
                  Design Showcase & Blueprints
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">
                  Overview
                </button>
              </li>
            </ul>
          </div>

          {/* Request-to-Delivery Stages */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Workflow Stages</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> 1. Guided Vision Submission
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> 2. Designer Scoping & Acceptance
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> 3. 2D/3D Schematics Drafting
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> 4. Pinpoint Revisions & Feedback
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> 5. Final Handover & Blueprints
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Build My Vision. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Empowering clients and architects to build together seamlessly.
          </p>
        </div>
      </div>
    </footer>
  );
}
