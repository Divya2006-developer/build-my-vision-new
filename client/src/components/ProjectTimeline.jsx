import React from 'react';
import {
  FileText,
  UserCheck,
  PenTool,
  MessageSquareDiff,
  Award,
  Check,
  Clock
} from 'lucide-react';

const STAGES = [
  {
    key: 'submitted',
    label: 'Vision Submitted',
    description: 'Structured brief & prompts submitted by client',
    icon: FileText
  },
  {
    key: 'designer_assigned',
    label: 'Designer Scoped',
    description: 'Architect matched and kickoff parameters aligned',
    icon: UserCheck
  },
  {
    key: 'concept_drafting',
    label: 'Drafting Schematics',
    description: 'Floorplans, structural concepts & 3D light studies',
    icon: PenTool
  },
  {
    key: 'client_review',
    label: 'Client Review & Revisions',
    description: 'Pinpoint annotations and schematic adjustments',
    icon: MessageSquareDiff
  },
  {
    key: 'final_delivered',
    label: 'Final Delivery & Handover',
    description: 'CAD blueprints, 3D render package & sign-off',
    icon: Award
  }
];

export default function ProjectTimeline({ currentStatus = 'submitted' }) {
  const getStageIndex = (status) => {
    switch (status) {
      case 'submitted': return 0;
      case 'designer_assigned': return 1;
      case 'concept_drafting': return 2;
      case 'client_review': return 3;
      case 'final_delivered':
      case 'completed': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Request-to-Delivery Workflow</h3>
          <p className="text-xs text-slate-500">Live progress tracker across project milestones</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            Stage {currentIndex + 1} of 5: {STAGES[currentIndex]?.label}
          </span>
        </div>
      </div>

      {/* Stepper Bar */}
      <div className="relative">
        {/* Background connector line */}
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-200 -z-0 hidden md:block" />
        
        {/* Active connector line */}
        <div 
          className="absolute top-5 left-6 h-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-500 -z-0 hidden md:block"
          style={{ width: `${(currentIndex / (STAGES.length - 1)) * 90}%` }}
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isPending = idx > currentIndex;

            return (
              <div key={stage.key} className="flex md:flex-col items-start md:items-center text-left md:text-center gap-3 md:gap-2">
                
                {/* Node Circle */}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 font-bold ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                      : isCurrent
                      ? 'bg-sky-600 text-white ring-4 ring-sky-100 shadow-md shadow-sky-600/30'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <Icon className="w-5 h-5 animate-pulse" />
                  ) : (
                    <span className="text-xs">{idx + 1}</span>
                  )}
                </div>

                {/* Details */}
                <div>
                  <div className={`text-xs font-bold leading-tight ${
                    isCurrent ? 'text-sky-700 font-extrabold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {stage.label}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 hidden sm:block">
                    {stage.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
