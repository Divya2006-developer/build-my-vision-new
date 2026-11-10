import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  PenTool,
  Layers,
  Sun,
  Layout,
  HardHat,
  MessageSquareDiff,
  Award
} from 'lucide-react';
import PortfolioCard from '../components/PortfolioCard';

export default function HomePage({ setCurrentView, setSelectedDesignerId }) {
  const [demoInput, setDemoInput] = useState('I want lots of morning sunlight in the kitchen, high wooden ceilings, and an acoustically quiet office for remote work.');
  const [translating, setTranslating] = useState(false);
  const [translatedResult, setTranslatedResult] = useState({
    fenestration: 'East-facing clerestory glazing (high SHGC) & floor-to-ceiling dining curtain walls',
    structural: 'Mass timber glulam post-and-beam with acoustic cedar tongue-and-groove decking',
    spatial: 'Decoupled double-stud partition wall (STC 58 rating) buffering office from active kitchen'
  });

  const handleTestTranslation = (e) => {
    e.preventDefault();
    setTranslating(true);
    setTimeout(() => {
      setTranslating(false);
      if (demoInput.toLowerCase().includes('school') || demoInput.toLowerCase().includes('kids')) {
        setTranslatedResult({
          fenestration: 'Low-sill operable sash windows (18" above finished floor) with impact laminate safety glass',
          structural: 'Modular light-gauge steel framing with non-toxic acoustic wallboard',
          spatial: 'Radial perimeter classrooms circling a sheltered internal courtyard play atrium'
        });
      } else {
        setTranslatedResult({
          fenestration: 'East-facing clerestory glazing (high SHGC) & floor-to-ceiling dining curtain walls',
          structural: 'Mass timber glulam post-and-beam with acoustic cedar tongue-and-groove decking',
          spatial: 'Decoupled double-stud partition wall (STC 58 rating) buffering office from active kitchen'
        });
      }
    }, 400);
  };

  const samplePortfolios = [
    {
      id: 1,
      designer_id: 1,
      title: 'The Solarium Eco-Villa',
      category: 'residential',
      description: 'A 3,200 sq.ft net-zero residential villa with south-facing double glazing, rammed-earth thermal mass walls, and a central biophilic garden courtyard.',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      style: 'Sustainable / Biophilic',
      area_sqft: 3200,
      location: 'Bend, Oregon',
      tags: ['Solar Orientation', 'Biophilic Courtyard', 'Passive Cooling'],
      designer_name: 'Elena Vance, AIA',
      designer_title: 'Lead Architect & Passive House Specialist',
      designer_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 2,
      designer_id: 2,
      title: 'Apex Innovation Tech Loft',
      category: 'commercial',
      description: 'Converted historic industrial warehouse into an open-plan tech creative campus with cantilevered mezzanine meeting pods.',
      image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      style: 'Industrial Modern',
      area_sqft: 8500,
      location: 'West Loop, Chicago',
      tags: ['Steel Trusses', 'Exposed Concrete', 'Acoustic Pods'],
      designer_name: 'Marcus Sterling, PE',
      designer_title: 'Senior Structural Engineer',
      designer_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 3,
      designer_id: 3,
      title: 'Greenwood Montessori Early Learning Center',
      category: 'educational',
      description: 'Child-scale exploratory educational campus with sunlit circular classrooms and indoor sensory play gardens.',
      image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
      style: 'Contemporary Child-Centric',
      area_sqft: 6400,
      location: 'Austin, Texas',
      tags: ['Daylit Classrooms', 'Acoustic Isolation', 'Child Ergonomics'],
      designer_name: 'Sarah Lin',
      designer_title: 'Educational Architect',
      designer_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80'
    }
  ];

  return (
    <div className="space-y-24">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        
        {/* Architectural grid background */}
        <div className="absolute inset-0 blueprint-grid opacity-30 -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Bridging Customers & Architectural Designers
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Turn Your Space Vision Into <br />
              <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent">
                Buildable Blueprints
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              No architectural jargon needed. Express your lifestyle desires through our guided vision prompts, 
              collaborate directly with licensed architects and engineers, and track progress all the way to final delivery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setCurrentView('vision-builder')}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                Build Your Vision Brief
              </button>

              <button
                onClick={() => setCurrentView('designers')}
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Users className="w-4 h-4 text-slate-500" />
                Browse Certified Designers
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-200/60 max-w-lg mx-auto text-center">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">100%</div>
                <div className="text-xs text-slate-500 font-medium">Jargon-Free</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-sky-600">5-Stage</div>
                <div className="text-xs text-slate-500 font-medium">Clear Workflow</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">Real-Time</div>
                <div className="text-xs text-slate-500 font-medium">Live Pinpoint Chat</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Vision Translator Demo Widget */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800/80">
              Core Innovation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
              How the Architectural Vision Translator Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Customers talk about feelings, mornings, and gatherings. Designers need structural load-bearing parameters, 
              fenestration ratios, and acoustic isolation classes. See how our translation engine bridges both worlds:
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Customer Input Box */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  Customer Plain-English Description
                </span>
                <span className="text-[10px] text-slate-400">Live Interactive Demo</span>
              </div>

              <textarea
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                rows={4}
                className="w-full text-xs sm:text-sm p-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-slate-400">
                  Try typing "school with sunlight and safe play" or customize the text!
                </span>
                <button
                  onClick={handleTestTranslation}
                  disabled={translating}
                  className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {translating ? 'Analyzing...' : 'Translate Specs'}
                </button>
              </div>
            </div>

            {/* Translated Specs Card */}
            <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-sky-500/30">
              <div className="flex items-center justify-between text-xs font-bold text-sky-400 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Derived Architectural & Engineering Specs
                </span>
                <span className="text-[10px] bg-sky-900/50 text-sky-300 px-2 py-0.5 rounded-md">
                  Auto-Generated
                </span>
              </div>

              {/* Specification 1 */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Sun className="w-3.5 h-3.5" /> Fenestration & Daylight Strategy
                </div>
                <p className="text-slate-200">{translatedResult.fenestration}</p>
              </div>

              {/* Specification 2 */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <HardHat className="w-3.5 h-3.5" /> Structural Frame & Material Joinery
                </div>
                <p className="text-slate-200">{translatedResult.structural}</p>
              </div>

              {/* Specification 3 */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Layout className="w-3.5 h-3.5" /> Spatial & Acoustic Zoning
                </div>
                <p className="text-slate-200">{translatedResult.spatial}</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4-Step Request-to-Delivery Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Streamlined Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            From Vision Submission to Handover
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            A transparent 5-stage collaboration lifecycle keeping both client and architect in complete harmony.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative hover:border-sky-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Guided Briefing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Answer structured prompts about structure type, lifestyle, style preferences, and plot parameters without architectural jargon.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative hover:border-sky-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Designer Scoping</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Match with certified architects or structural engineers based on design style, credentials, and portfolio aesthetics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative hover:border-sky-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Pinpoint Revisions</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review draft schematics and 3D renders. Click anywhere on the drawing to drop pinpoint markers and request targeted adjustments.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative hover:border-sky-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm mb-4">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Final Blueprints Handover</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receive complete permit-ready architectural packages (PDF, CAD DWG, high-res 3D photometrics) ready for construction.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Portfolios Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Architectural Showcase
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Featured Designer Portfolios
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Browse previous works across residential homes, community schools, and commercial tech lofts.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('portfolios')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5"
          >
            View All Portfolios <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {samplePortfolios.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onSelectDesigner={(designerId) => {
                if (setSelectedDesignerId) setSelectedDesignerId(designerId);
                setCurrentView('designer-detail');
              }}
              onViewDetails={() => {
                if (setSelectedDesignerId) setSelectedDesignerId(item.designer_id);
                setCurrentView('designer-detail');
              }}
            />
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-cyan-700 text-white rounded-3xl p-8 sm:p-14 text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black">
              Ready to Bring Your Space Vision to Life?
            </h2>
            <p className="text-sm sm:text-base text-sky-100 leading-relaxed font-normal">
              Whether you are dreaming of a light-filled family villa, a local Montessori school, 
              or a boutique creative studio—our guided wizard makes communicating your vision effortless.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setCurrentView('vision-builder')}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-sky-800 hover:bg-slate-100 font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Start Vision Builder Now
              </button>
              <button
                onClick={() => setCurrentView('designers')}
                className="w-full sm:w-auto px-8 py-3.5 bg-sky-800/80 hover:bg-sky-900 text-white font-bold text-sm rounded-xl border border-sky-400/30 transition-colors"
              >
                Browse Designers
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
