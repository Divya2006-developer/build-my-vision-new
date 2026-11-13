import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Star,
  Award,
  CheckCircle,
  MapPin,
  ArrowRight,
  Sparkles,
  PenTool,
  Wrench
} from 'lucide-react';
import { api } from '../api/client';

export default function DesignersPage({ setCurrentView, setSelectedDesignerId, setPreselectedDesignerId }) {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchDesigners() {
      try {
        const list = await api.getDesigners({ search, category: selectedCategory });
        setDesigners(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDesigners();
  }, [search, selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Specializations' },
    { id: 'Residential', label: 'Residential Homes' },
    { id: 'Commercial', label: 'Commercial Buildings' },
    { id: 'Educational', label: 'Schools & Community' },
    { id: 'Sustainable', label: 'Sustainable & Biophilic' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Certified Architects & Engineers
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
            Designers & Architectural Talents
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified architectural designers, structural engineers, and spatial planners ready to realize your vision.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, style, or tool..."
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Designers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-72" />
          ))}
        </div>
      ) : designers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">No designers match your filters</h3>
          <p className="text-xs text-slate-500 mt-1">Try broadening your search keyword or switching categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designers.map((designer) => {
            const specs = Array.isArray(designer.specializations) ? designer.specializations : [];

            return (
              <div
                key={designer.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={designer.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'}
                        alt={designer.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-sky-500/20 shadow-sm"
                      />
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-sky-600 transition-colors">
                          {designer.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{designer.title}</p>
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                          <span>{designer.rating}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({designer.reviews_count || 12} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {designer.featured && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 mt-4 leading-relaxed line-clamp-3">
                    {designer.profile_bio || designer.user_bio || 'Experienced architect translating client dreams into feasible blueprints.'}
                  </p>

                  {/* Stats Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Experience</span>
                      <span className="font-bold text-slate-800">{designer.experience_years || 5} Years</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivered</span>
                      <span className="font-bold text-emerald-600">{designer.completed_projects || 20}+ Visions</span>
                    </div>
                  </div>

                  {/* Specialization Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {specs.slice(0, 3).map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Software tools */}
                  {designer.software_tools && (
                    <div className="mt-3 text-[10px] text-slate-400 font-mono line-clamp-1">
                      Tools: {designer.software_tools}
                    </div>
                  )}

                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (setSelectedDesignerId) setSelectedDesignerId(designer.id);
                      setCurrentView('designer-detail');
                    }}
                    className="flex-1 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-center"
                  >
                    View Portfolio
                  </button>

                  <button
                    onClick={() => {
                      if (setPreselectedDesignerId) setPreselectedDesignerId(designer.id);
                      setCurrentView('vision-builder');
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition-all flex items-center gap-1"
                  >
                    Invite <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
