import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Home,
  GraduationCap,
  Building2,
  Coffee,
  Trees,
  Hammer,
  ArrowRight,
  ArrowLeft,
  Check,
  Sun,
  Layout,
  HardHat,
  Leaf,
  Info,
  Calendar,
  DollarSign,
  Send,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import TechnicalTranslatorBadge from '../components/TechnicalTranslatorBadge';
import VisualHomeGuideModal from '../components/VisualHomeGuideModal';

const BUILDING_TYPES = [
  {
    id: 'residential_home',
    label: 'Residential Home',
    desc: 'Family houses, villas, duplexes, contemporary residences',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'school_educational',
    label: 'School & Educational',
    desc: 'Kindergartens, modular classrooms, sensory academies, training centers',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'commercial_building',
    label: 'Commercial & Office',
    desc: 'Corporate lofts, open-plan workspaces, tech studios, headquarters',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'retail_cafe',
    label: 'Retail & Hospitality',
    desc: 'Artisan cafes, boutique stores, bistros, exhibition galleries',
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'tiny_house',
    label: 'Tiny House & Cabin',
    desc: 'Micro-retreats, off-grid cabins, sustainable container builds',
    icon: Trees,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'renovation',
    label: 'Renovation & Adaptive Reuse',
    desc: 'Floorplan remodel, second-story addition, historic modernization',
    icon: Hammer,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
  }
];

const STYLES = [
  {
    id: 'Modern Minimalist',
    label: 'Modern Minimalist',
    desc: 'Clean horizontal lines, expansive glass walls, uninterrupted volume',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'Scandinavian Warm',
    label: 'Scandinavian Warm',
    desc: 'Light natural woods, hygge coziness, pale stone, soft organic daylight',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'Sustainable / Biophilic',
    label: 'Sustainable / Biophilic',
    desc: 'Integrated greenery, green roofs, mass timber, passive heating & cooling',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'Industrial Modern',
    label: 'Industrial Modern',
    desc: 'Exposed structural steel beams, polished concrete floors, loft volumes',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'Contemporary Child-Centric',
    label: 'Child-Centric & Educational',
    desc: 'Low window heights, tactile sensory spaces, curved corners, sheltered play',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80'
  }
];

export default function VisionBuilderPage({ setCurrentView, setSelectedProjectId, preselectedDesignerId = null }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [designers, setDesigners] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    building_type: 'residential_home',
    plot_dimensions: '60ft x 100ft',
    num_floors: 2,
    rooms_needed: '3 Bedrooms, 2.5 Baths, Open Kitchen, Home Office, Kids Play Area',
    style_preference: 'Modern Minimalist',
    budget_range: '$100,000 - $180,000 (Planning Expectation)',
    timeline_preference: '3 - 4 months',
    description: 'I want lots of natural morning sunlight in the kitchen and living room. We love hosting family on weekends, so an open space flowing seamlessly to an outdoor patio is essential. We also need a quiet, acoustically insulated home office for remote work.',
    special_requirements: 'Wheelchair-friendly ground floor entrance; future solar roof conduit integration; warm timber accents instead of cold hospital white walls.',
    designer_id: preselectedDesignerId || ''
  });

  useEffect(() => {
    async function loadDesigners() {
      try {
        const list = await api.getDesigners();
        setDesigners(list);
      } catch (err) {
        console.error(err);
      }
    }
    loadDesigners();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 5));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  // Live dynamic architectural specs generator for the preview step
  const getLiveTechnicalSpecs = () => {
    const text = `${formData.description} ${formData.special_requirements} ${formData.rooms_needed}`.toLowerCase();
    
    return {
      architectural_classification: `${formData.style_preference.toUpperCase()} ${formData.building_type.replace(/_/g, ' ').toUpperCase()}`,
      spatial_layout: text.includes('open') 
        ? 'Continuous open-plan circulation with column-free spans; visual axial alignment between indoor great room and outdoor terrace.'
        : `${formData.num_floors}-story program with clear distinction between public entertaining zones and private resting quarters.`,
      fenestration_and_lighting: text.includes('sun') || text.includes('light')
        ? 'East/South-facing clerestory fenestration with high SHGC glazing and deep passive shading overhangs to prevent solar glare.'
        : 'Operable thermal casement windows providing balanced cross-ventilation.',
      structural_and_materials: formData.style_preference.includes('Scandinavian') || text.includes('wood') || text.includes('timber')
        ? 'Mass timber glulam framing with tongue-and-groove cedar ceiling panels and acoustic decoupling.'
        : 'Reinforced concrete post-and-beam with light-gauge steel framing and drywall assemblies.',
      sustainability_and_mep: [
        'Passive solar orientation strategy with cross-ventilation vectors.',
        text.includes('solar') ? 'Rooftop Photovoltaic (PV) conduit pre-wiring and battery inverter provision.' : 'High-efficiency multi-zone HVAC split system.',
        text.includes('acoustic') || text.includes('quiet') ? 'STC 55+ acoustic partition assemblies for office and private suites.' : 'Standard acoustic isolation.'
      ],
      kickoff_alignment_checklist: [
        'Confirm preferred floor-to-ceiling heights (9ft standard vs 10.5ft voluminous).',
        'Review municipal setbacks and building footprint coverage limits.',
        'Verify utility tie-ins (water, electrical, fiber optic conduits).'
      ]
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      formData.title = `${formData.style_preference} ${BUILDING_TYPES.find(b => b.id === formData.building_type)?.label || 'Project'}`;
    }

    setSubmitting(true);
    try {
      const res = await api.createProject({
        ...formData,
        designer_id: formData.designer_id ? Number(formData.designer_id) : null
      });

      if (setSelectedProjectId) {
        setSelectedProjectId(res.project.id);
      }
      setCurrentView('project-detail');
    } catch (err) {
      console.error(err);
      alert('Failed to submit vision brief: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Page Title & Wizard Progress Bar */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold uppercase tracking-wider border border-sky-100">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          Guided Vision Submission Wizard
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Express Your Architectural Vision
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          We collect your requirements step-by-step with structured examples and auto-translate your desires for certified designers.
        </p>

        {/* Step Numbers Bar */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              onClick={() => s < step && setStep(s)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                step === s
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : step > s
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span>{step > s ? '✓' : `0${s}`}</span>
              <span className="hidden sm:inline">
                {s === 1 && 'Structure'}
                {s === 2 && 'Spaces'}
                {s === 3 && 'Style'}
                {s === 4 && 'Vision Details'}
                {s === 5 && 'Review Specs'}
              </span>
            </div>
          ))}
        </div>

        {/* Visual Guide Callout for Naive Customers */}
        <div className="mt-4 bg-sky-50/80 border border-sky-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Unsure about architectural terms or staircase styles?
              </h4>
              <p className="text-[11px] text-slate-600">
                Explore real photo examples of <strong>Staircase types</strong> (L-shaped, floating, spiral, under-stair storage), <strong>Roof styles</strong>, and <strong>Kitchen layouts</strong> anytime!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="px-4 py-2 bg-white hover:bg-sky-100 text-sky-800 font-bold text-xs rounded-xl border border-sky-300 shadow-sm shrink-0 transition-colors"
          >
            Open Visual Guide
          </button>
        </div>
      </div>

      {/* Main Wizard Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 transition-all">
        
        {/* STEP 1: Building Type */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Step 1: What type of structure are you planning?</h2>
              <p className="text-xs text-slate-500 mt-1">Select the structure category that best matches your project goals.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BUILDING_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.building_type === type.id;

                return (
                  <div
                    key={type.id}
                    onClick={() => handleChange('building_type', type.id)}
                    className={`rounded-2xl border-2 p-4 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/50 shadow-md ring-2 ring-sky-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900">{type.label}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{type.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                      <span className={isSelected ? 'text-sky-700' : 'text-slate-400'}>
                        {isSelected ? 'Selected' : 'Choose'}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Spatial & Functional Needs */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Step 2: Plot Dimensions & Spatial Program</h2>
              <p className="text-xs text-slate-500 mt-1">Help the architect understand scale, floor count, and desired rooms.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Plot / Land Dimensions
                </label>
                <input
                  type="text"
                  value={formData.plot_dimensions}
                  onChange={(e) => handleChange('plot_dimensions', e.target.value)}
                  placeholder="e.g. 50ft x 100ft, 4,000 sq.ft, or 0.25 acres"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Approximate plot dimensions or total site area.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Desired Number of Floors
                </label>
                <select
                  value={formData.num_floors}
                  onChange={(e) => handleChange('num_floors', Number(e.target.value))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value={1}>1 Floor (Single Level / Ranch)</option>
                  <option value={2}>2 Floors (Standard Multi-Level)</option>
                  <option value={3}>3 Floors (Townhouse / Loft Mezzanine)</option>
                  <option value={4}>4+ Floors (Commercial / Multi-Unit)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Rooms & Functional Zones Needed
              </label>
              <textarea
                value={formData.rooms_needed}
                onChange={(e) => handleChange('rooms_needed', e.target.value)}
                rows={3}
                placeholder="e.g. 4 Bedrooms, 3 Baths, Kitchen with Island Pantry, Home Office, Kids Playroom, Workshop..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">List the spaces your family or occupants will use everyday.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Needs & Accessibility Features
              </label>
              <input
                type="text"
                value={formData.special_requirements}
                onChange={(e) => handleChange('special_requirements', e.target.value)}
                placeholder="e.g. Wheelchair access, sound isolation for music/office, rooftop solar, rainwater garden..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Aesthetic & Architectural Style */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Step 3: Which visual aesthetic speaks to you?</h2>
              <p className="text-xs text-slate-500 mt-1">Select an architectural style direction for your project moodboard.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {STYLES.map((style) => {
                const isSelected = formData.style_preference === style.id;

                return (
                  <div
                    key={style.id}
                    onClick={() => handleChange('style_preference', style.id)}
                    className={`rounded-2xl border-2 overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/40 shadow-md ring-2 ring-sky-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="h-32 overflow-hidden bg-slate-900 relative">
                      <img src={style.image} alt={style.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                      <span className="absolute bottom-2 left-3 text-white font-bold text-xs">
                        {style.label}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-slate-500 leading-relaxed">{style.desc}</p>
                      
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                        <span className={isSelected ? 'text-sky-700' : 'text-slate-400'}>
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Plain English Vision Description */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Step 4: Describe Your Vision in Everyday Language</h2>
              <p className="text-xs text-slate-500 mt-1">
                No technical terms needed! Tell us about how you want to experience the space.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project Vision Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. Morning Sun Family Sanctuary"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Lifestyle Vision (Everyday Words)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={5}
                placeholder="Describe how mornings should feel, what you want to see when you look outside, where people gather, etc..."
                className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <div className="mt-2 p-3 bg-sky-50/70 rounded-xl border border-sky-100 text-xs text-sky-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tip:</strong> Designers love details like: "I want to watch the sunset from the deck", "I don't want kids waking up people downstairs", or "We love hosting big dinners in the kitchen".
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Budget Planning Expectation
                </label>
                <select
                  value={formData.budget_range}
                  onChange={(e) => handleChange('budget_range', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="Economy ($40,000 - $80,000)">Economy ($40,000 - $80,000)</option>
                  <option value="$100,000 - $180,000 (Planning Expectation)">Mid-Range ($100,000 - $180,000)</option>
                  <option value="Premium Custom ($200,000 - $350,000)">Premium Custom ($200,000 - $350,000)</option>
                  <option value="Enterprise / Large Scale ($500,000+)">Large Scale / Commercial ($500,000+)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Timeline
                </label>
                <select
                  value={formData.timeline_preference}
                  onChange={(e) => handleChange('timeline_preference', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="1 - 2 months (Expedited)">1 - 2 months (Expedited)</option>
                  <option value="3 - 4 months (Standard)">3 - 4 months (Standard)</option>
                  <option value="5 - 6 months (Comprehensive)">5 - 6 months (Comprehensive)</option>
                </select>
              </div>
            </div>

            {/* Optional Designer Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assign or Invite a Specific Architect (Optional)
              </label>
              <select
                value={formData.designer_id}
                onChange={(e) => handleChange('designer_id', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="">Leave Open (Post to all verified designers to review)</option>
                {designers.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.title || 'Architect'} (★ {d.rating})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Auto-Translated Architectural Matrix */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Translation Ready
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Step 5: Review Brief & Derived Architectural Specs</h2>
              <p className="text-xs text-slate-500 mt-1">
                Below is how your vision will be presented to the architect. Everything is translated into technical design parameters!
              </p>
            </div>

            {/* Live Translation Component */}
            <TechnicalTranslatorBadge
              technicalSummary={getLiveTechnicalSpecs()}
              clientWords={formData.description}
            />

            {/* Summary Review Grid */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Project Title</span>
                <span className="font-bold text-slate-800 text-sm">
                  {formData.title || 'Custom Vision Project'}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Structure Type</span>
                <span className="font-bold text-slate-800">
                  {BUILDING_TYPES.find(b => b.id === formData.building_type)?.label} ({formData.num_floors} Floors)
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Plot Dimensions</span>
                <span className="text-slate-700">{formData.plot_dimensions}</span>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Style Direction</span>
                <span className="text-slate-700">{formData.style_preference}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Rooms & Program</span>
                <span className="text-slate-700">{formData.rooms_needed}</span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting Vision...' : 'Submit Vision Brief to Designers'}
            </button>
          )}
        </div>

      </div>

      {/* Visual Home Guide Modal for Naive Customers */}
      <VisualHomeGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

    </div>
  );
}
