import React, { useState, useEffect } from 'react';
import { Image, Filter, Search, Sparkles } from 'lucide-react';
import { api } from '../api/client';
import PortfolioCard from '../components/PortfolioCard';

export default function PortfoliosPage({ setCurrentView, setSelectedDesignerId, setPreselectedDesignerId }) {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const data = await api.getPortfolios(selectedCategory);
        setPortfolios(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolios();
  }, [selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Works' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'educational', label: 'Educational' },
    { id: 'renovation', label: 'Renovation' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Architectural Gallery
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
            Design Showcase & Blueprints
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore previous architectural works, 3D renderings, and spatial concepts to inspire your own vision brief.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('vision-builder')}
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          Start Your Vision
        </button>
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

      {/* Portfolios Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-80" />
          ))}
        </div>
      ) : portfolios.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">No portfolios found</h3>
          <p className="text-xs text-slate-500 mt-1">Try switching categories or view all works.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onSelectDesigner={(designerId) => {
                if (setPreselectedDesignerId) setPreselectedDesignerId(designerId);
                setCurrentView('vision-builder');
              }}
              onViewDetails={() => {
                if (setSelectedDesignerId) setSelectedDesignerId(item.designer_id);
                setCurrentView('designer-detail');
              }}
            />
          ))}
        </div>
      )}

    </div>
  );
}
