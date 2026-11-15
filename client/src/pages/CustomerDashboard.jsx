import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  Plus,
  Home,
  Building2,
  Trees,
  BookOpen
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import VisualHomeGuideModal from '../components/VisualHomeGuideModal';

export default function CustomerDashboard({ setCurrentView, setSelectedProjectId }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    async function fetchMyProjects() {
      try {
        const list = await api.getProjects();
        setProjects(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyProjects();
  }, []);

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'submitted': return 20;
      case 'designer_assigned': return 40;
      case 'concept_drafting': return 60;
      case 'client_review': return 80;
      case 'final_delivered':
      case 'completed': return 100;
      default: return 20;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
        return { label: 'Awaiting Designer', color: 'bg-amber-100 text-amber-800' };
      case 'designer_assigned':
        return { label: 'Designer Matched', color: 'bg-sky-100 text-sky-800' };
      case 'concept_drafting':
        return { label: 'Drafting Schematics', color: 'bg-indigo-100 text-indigo-800' };
      case 'client_review':
        return { label: 'Action Needed: Review Deliverable', color: 'bg-rose-100 text-rose-800 animate-pulse' };
      case 'final_delivered':
      case 'completed':
        return { label: 'Final Delivery Completed', color: 'bg-emerald-100 text-emerald-800' };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-800' };
    }
  };

  const pendingReviewCount = projects.filter(p => p.status === 'client_review').length;
  const completedCount = projects.filter(p => p.status === 'final_delivered' || p.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-white/10 px-3 py-1 rounded-full">
            Customer Vision Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.name || 'Visionary'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            Track your architectural project briefs from initial submission through concept drafting to final blueprint handover.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowGuideModal(true)}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-2 transition-all shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-sky-300" />
            Visual Home Guide (No Jargon)
          </button>

          <button
            onClick={() => setCurrentView('vision-builder')}
            className="px-5 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Submit New Vision
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase block">Total Visions</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{projects.length}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase block">In Collaboration</span>
          <span className="text-2xl font-black text-sky-600 mt-1 block">
            {projects.filter(p => p.status !== 'final_delivered' && p.status !== 'completed').length}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-rose-500 font-bold uppercase block">Pending Your Review</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">{pendingReviewCount}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-emerald-500 font-bold uppercase block">Handover Completed</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{completedCount}</span>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">Your Architectural Projects</h2>
          <span className="text-xs text-slate-500">Live Request-to-Delivery Status</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-40" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Sparkles className="w-12 h-12 text-sky-400 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-lg">No Vision Projects Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
              You haven't submitted a vision brief yet. Use our guided wizard to articulate your space requirements without jargon!
            </p>
            <button
              onClick={() => setCurrentView('vision-builder')}
              className="px-6 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Start First Vision Brief
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((proj) => {
              const badge = getStatusBadge(proj.status);
              const progress = getProgressPercentage(proj.status);

              return (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-lg text-slate-900">{proj.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {proj.building_type.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="max-w-md space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                        <span>Workflow Progress: Stage {Math.round(progress / 20)} of 5</span>
                        <span className="text-sky-600 font-bold">{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Assigned Designer */}
                    <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                      {proj.designer_name ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={proj.designer_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'}
                            alt={proj.designer_name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span>Assigned Architect: <strong className="text-slate-800">{proj.designer_name}</strong></span>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-semibold">
                          Open Request — Awaiting Designer Assignment
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="shrink-0 w-full md:w-auto">
                    <button
                      onClick={() => {
                        if (setSelectedProjectId) setSelectedProjectId(proj.id);
                        setCurrentView('project-detail');
                      }}
                      className="w-full md:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      Open Workspace & Chat
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visual Home Guide Modal for Naive Customers */}
      <VisualHomeGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

    </div>
  );
}
