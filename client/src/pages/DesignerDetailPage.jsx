import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  Award,
  CheckCircle,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  MessageSquare,
  HardHat,
  Compass
} from 'lucide-react';
import { api } from '../api/client';
import PortfolioCard from '../components/PortfolioCard';

export default function DesignerDetailPage({ designerId, setCurrentView, setPreselectedDesignerId }) {
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDesigner() {
      try {
        const data = await api.getDesignerById(designerId);
        setDesigner(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (designerId) {
      fetchDesigner();
    }
  }, [designerId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Loading designer profile and portfolio...</p>
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h3 className="font-bold text-slate-800">Designer not found</h3>
        <button
          onClick={() => setCurrentView('designers')}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Designers Directory
        </button>
      </div>
    );
  }

  const specs = Array.isArray(designer.specializations) ? designer.specializations : [];
  const portfolios = designer.portfolios || [];
  const reviews = designer.reviews || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('designers')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Designers
      </button>

      {/* Profile Header Hero */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={designer.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}
            alt={designer.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-sky-500/20 shadow-md shrink-0"
          />

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{designer.name}</h1>
              <span className="text-xs font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full">
                Verified Architect
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-600">{designer.title}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                {designer.rating} ({designer.reviews_count || reviews.length} reviews)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {designer.location || 'Remote / Global'}
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <Award className="w-3.5 h-3.5" /> {designer.completed_projects || 24} Completed Projects
              </span>
            </div>

            {/* Specialization Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {specs.map((s, i) => (
                <span key={i} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full md:w-auto shrink-0">
          <button
            onClick={() => {
              if (setPreselectedDesignerId) setPreselectedDesignerId(designer.id);
              setCurrentView('vision-builder');
            }}
            className="w-full md:w-auto px-7 py-3.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            Hire for Your Vision
          </button>
        </div>

      </div>

      {/* Details & Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bio & Philosophy */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Design Philosophy & Experience</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {designer.profile_bio || designer.user_bio || 'Translating lifestyle dreams into buildable blueprints.'}
          </p>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Credentials & Education</span>
              <span className="font-bold text-slate-800">{designer.education_credentials || 'M.Arch, Licensed Architect'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Software & CAD Tools</span>
              <span className="font-mono text-slate-700">{designer.software_tools || 'AutoCAD, Revit, SketchUp, Lumion'}</span>
            </div>
          </div>
        </div>

        {/* Quick Collaboration Highlights */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-white">Collaboration Standard</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {designer.name} collaborates via Build My Vision’s 5-stage request-to-delivery framework:
            </p>
            <ul className="text-xs text-sky-200 space-y-2 mt-4">
              <li className="flex items-center gap-2">✓ Plain-English requirement translation</li>
              <li className="flex items-center gap-2">✓ Photometric 3D natural light studies</li>
              <li className="flex items-center gap-2">✓ Interactive pinpoint revisions on drafts</li>
              <li className="flex items-center gap-2">✓ Full permit-ready CAD & blueprint set</li>
            </ul>
          </div>

          <button
            onClick={() => {
              if (setPreselectedDesignerId) setPreselectedDesignerId(designer.id);
              setCurrentView('vision-builder');
            }}
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-colors text-center"
          >
            Start Project with {designer.name.split(' ')[0]}
          </button>
        </div>

      </div>

      {/* Portfolio Showcase Section */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Design Showcase
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Completed Portfolios & Blueprints ({portfolios.length})
          </h2>
        </div>

        {portfolios.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">
            No portfolios uploaded yet for this designer.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((item) => (
              <PortfolioCard
                key={item.id}
                item={{
                  ...item,
                  designer_name: designer.name,
                  designer_avatar: designer.avatar,
                  designer_title: designer.title
                }}
                onSelectDesigner={() => {
                  if (setPreselectedDesignerId) setPreselectedDesignerId(designer.id);
                  setCurrentView('vision-builder');
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Client Reviews Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900">
          Client Reviews & Feedback ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">
            No client reviews posted yet. Be the first to collaborate and review!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.customer_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                      alt={rev.customer_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{rev.customer_name || 'Client'}</h4>
                      <p className="text-[10px] text-slate-400">{rev.project_title || 'Vision Project'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
