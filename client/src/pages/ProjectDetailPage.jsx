import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Layers,
  MessageSquare,
  Sparkles,
  Download,
  Star,
  CheckCircle,
  Clock,
  Send,
  User,
  HardHat,
  FileCheck2,
  Calendar,
  Share2,
  Award,
  BookOpen,
  Check,
  Upload,
  X
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ProjectTimeline from '../components/ProjectTimeline';
import DeliveryViewer from '../components/DeliveryViewer';
import ChatRoom from '../components/ChatRoom';
import TechnicalTranslatorBadge from '../components/TechnicalTranslatorBadge';
import DesignChoiceProposals from '../components/DesignChoiceProposals';
import VisualHomeGuideModal from '../components/VisualHomeGuideModal';

export default function ProjectDetailPage({ projectId, setCurrentView }) {
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('deliverables'); // 'deliverables' | 'chat' | 'specs' | 'proposals' | 'handover'
  const [selectedDeliverableIndex, setSelectedDeliverableIndex] = useState(0);

  // Modals state
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deliverableForm, setDeliverableForm] = useState({
    title: '',
    stage: 'concept_draft',
    description: '',
    file_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    version: 1
  });

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fetchProjectData = async () => {
    try {
      const data = await api.getProjectById(projectId);
      setProject(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Loading project collaboration workspace...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h3 className="font-bold text-slate-800">Project not found</h3>
        <button
          onClick={() => setCurrentView(user?.role === 'designer' ? 'designer-dashboard' : 'customer-dashboard')}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const deliverables = project.deliverables || [];
  const currentDeliverable = deliverables[selectedDeliverableIndex] || deliverables[0];

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.createReview({
        projectId: project.id,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewSubmitted(true);
      alert('Thank you! Your architectural review has been published to the designer’s profile.');
    } catch (err) {
      console.error(err);
      alert('Failed to submit review: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleUploadDeliverable = async (e) => {
    e.preventDefault();
    if (!deliverableForm.title.trim()) return;

    setUploading(true);
    try {
      await api.addDeliverable(project.id, deliverableForm);
      setShowUploadModal(false);
      setDeliverableForm({
        title: '',
        stage: 'concept_draft',
        description: '',
        file_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        version: (project.deliverables?.length || 0) + 1
      });
      await fetchProjectData();
      alert('Deliverable uploaded! The client has been notified to review.');
    } catch (err) {
      console.error(err);
      alert('Failed to upload deliverable: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const otherPartyName = user?.role === 'customer'
    ? (project.designer_name || 'Assigned Architect')
    : (project.customer_name || 'Client');

  const otherPartyRole = user?.role === 'customer' ? 'Architect' : 'Client';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb & Quick Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => setCurrentView(user?.role === 'designer' ? 'designer-dashboard' : 'customer-dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {user?.role === 'designer' ? 'Designer Studio' : 'My Visions'}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowGuideModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 text-xs font-bold transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            Visual Home Guide (No Jargon)
          </button>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {project.building_type.replace(/_/g, ' ')}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
            {project.style_preference}
          </span>
        </div>
      </div>

      {/* Project Workspace Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{project.title}</h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100 uppercase tracking-wider">
              {project.status.replace(/_/g, ' ')}
            </span>
          </div>

          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            "{project.description}"
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span>Dimensions: <strong className="text-slate-800">{project.plot_dimensions || 'N/A'}</strong></span>
            <span>Floors: <strong className="text-slate-800">{project.num_floors}</strong></span>
            <span>Budget Plan: <strong className="text-slate-800">{project.budget_range}</strong></span>
          </div>
        </div>

        {/* Assigned Collaborators */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shrink-0">
          <div className="text-right text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Collaborating Designer</span>
            <span className="font-extrabold text-slate-900">{project.designer_name || 'Open Request'}</span>
            <span className="text-[11px] text-slate-500 block">{project.designer_title || 'Architectural Lead'}</span>
          </div>
          <img
            src={project.designer_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'}
            alt="Designer"
            className="w-11 h-11 rounded-full object-cover ring-2 ring-sky-500/20"
          />
        </div>
      </div>

      {/* 5-Stage Request-to-Delivery Timeline Stepper */}
      <ProjectTimeline currentStatus={project.status} />

      {/* Workspace Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('deliverables')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'deliverables'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          Schematics & Pinpoint Revisions ({deliverables.length})
        </button>

        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'proposals'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-sky-400" />
          Design Choices & Styles ({project.proposals?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'chat'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-sky-400" />
          Live Discussion & Chat
        </button>

        <button
          onClick={() => setActiveTab('specs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'specs'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Architectural Translation Matrix
        </button>

        <button
          onClick={() => setActiveTab('handover')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'handover'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          Final Delivery & Blueprints Handover
        </button>
      </div>

      {/* TAB 1: Deliverables & Pinpoint Revisions */}
      {activeTab === 'deliverables' && (
        <div className="space-y-6">
          {user?.role === 'designer' && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload New Deliverable / Blueprints
              </button>
            </div>
          )}
          {deliverables.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800">No schematics uploaded yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                The designer is currently working on initial concept drafts and 3D studies.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Deliverables Version Selector Sidebar */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Deliverable Iterations
                </span>
                {deliverables.map((d, index) => (
                  <div
                    key={d.id || index}
                    onClick={() => setSelectedDeliverableIndex(index)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                      selectedDeliverableIndex === index
                        ? 'bg-sky-50 border-sky-400 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                      <span>v{d.version} • {d.stage.replace(/_/g, ' ')}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        d.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {d.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-1">{d.title}</p>
                    <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>{d.revisions?.length || 0} pin annotations</span>
                      <span>{new Date(d.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Interactive Pinpoint Viewer Canvas */}
              <div className="lg:col-span-3">
                <DeliveryViewer
                  deliverable={currentDeliverable}
                  projectId={project.id}
                  onRefresh={fetchProjectData}
                />
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 2: Design Choice Proposals */}
      {activeTab === 'proposals' && (
        <DesignChoiceProposals
          projectId={project.id}
          onRefresh={fetchProjectData}
          onOpenGuide={() => setShowGuideModal(true)}
        />
      )}

      {/* TAB 3: Real-Time Chat Room */}
      {activeTab === 'chat' && (
        <ChatRoom
          projectId={project.id}
          otherPartyName={otherPartyName}
          otherPartyRole={otherPartyRole}
          onSwitchTab={setActiveTab}
          onOpenGuide={() => setShowGuideModal(true)}
        />
      )}

      {/* TAB 3: Architectural Translation Matrix */}
      {activeTab === 'specs' && (
        <div className="space-y-6">
          <TechnicalTranslatorBadge
            technicalSummary={project.technical_summary}
            clientWords={project.description}
          />
        </div>
      )}

      {/* TAB 4: Final Handover & Blueprints */}
      {activeTab === 'handover' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
          
          <div className="border-b border-slate-100 pb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Milestone Handover
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Construction Blueprints & Permitting Package
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Once approved, all architectural CAD drawings, structural calculation sheets, and 3D photometrics are archived here for download.
            </p>
          </div>

          {/* Downloadable Package Items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-600 bg-sky-50 px-2 py-0.5 rounded">PDF Vector</span>
                <h4 className="font-bold text-sm text-slate-900 mt-2">Architectural Blueprint Set (24"x36")</h4>
                <p className="text-xs text-slate-500 mt-1">Full 1/4" scale plan, building elevations, and window schedules.</p>
              </div>
              <a
                href={currentDeliverable?.file_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="mt-4 px-3 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Blueprint PDF
              </a>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded">CAD DWG</span>
                <h4 className="font-bold text-sm text-slate-900 mt-2">AutoCAD / Revit Project Source</h4>
                <p className="text-xs text-slate-500 mt-1">Editable 3D BIM model and layers for structural engineering review.</p>
              </div>
              <a
                href={currentDeliverable?.file_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="mt-4 px-3 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download CAD Archive
              </a>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">4K Renders</span>
                <h4 className="font-bold text-sm text-slate-900 mt-2">Photometric 3D Light Renderings</h4>
                <p className="text-xs text-slate-500 mt-1">High-resolution exterior and interior daylight study renders.</p>
              </div>
              <a
                href={currentDeliverable?.file_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="mt-4 px-3 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download 4K Renders
              </a>
            </div>

          </div>

          {/* Customer Review Section */}
          {user?.role === 'customer' && !reviewSubmitted && (
            <div className="mt-8 pt-8 border-t border-slate-100 bg-sky-50/40 rounded-2xl p-6 border border-sky-100">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Rate Your Experience with {project.designer_name}
                </h3>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                Did the architect translate your vision accurately without confusing jargon? Leave your feedback for future visionaries!
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`p-2 rounded-xl border transition-all ${
                          reviewRating >= star ? 'bg-amber-100 border-amber-300 text-amber-600' : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${reviewRating >= star ? 'fill-amber-400' : ''}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{reviewRating}.0 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Review & Testimonial
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Share how the architect understood your needs and delivered your vision..."
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingReview ? 'Submitting...' : 'Post Designer Review'}
                </button>
              </form>
            </div>
          )}

        </div>
      )}

      {/* Modal: Upload Deliverable (Concept Draft, 2D/3D Schematics, or Final Design Handover) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-600" />
                Upload Architectural Deliverable
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDeliverable} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deliverable Stage
                </label>
                <select
                  value={deliverableForm.stage}
                  onChange={(e) => {
                    const stg = e.target.value;
                    let defaultTitle = '2D Floor Plan & Spatial Flow v1';
                    if (stg === 'schematic_drawings') defaultTitle = '3D Photometric Light Study & Elevations';
                    if (stg === 'final_delivery') defaultTitle = 'Complete Final Architectural Blueprints Package (PDF + CAD)';
                    setDeliverableForm({ ...deliverableForm, stage: stg, title: defaultTitle });
                  }}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="concept_draft">Stage 3: Concept Draft (Floorplan & Spatial Layout)</option>
                  <option value="schematic_drawings">Stage 3: 3D Schematics & Daylight Study</option>
                  <option value="final_delivery">Stage 5: Final Delivery (Permit Blueprints & Handover)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deliverable Title
                </label>
                <input
                  type="text"
                  value={deliverableForm.title}
                  onChange={(e) => setDeliverableForm({ ...deliverableForm, title: e.target.value })}
                  placeholder="e.g. 2D Floor Plan with L-Shaped Staircase"
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Blueprint / Render Image URL
                </label>
                <input
                  type="text"
                  value={deliverableForm.file_url}
                  onChange={(e) => setDeliverableForm({ ...deliverableForm, file_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  The client will be able to inspect this in full-screen and click to place pinpoint feedback pins.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Architect's Plain-Language Note to Client
                </label>
                <textarea
                  value={deliverableForm.description}
                  onChange={(e) => setDeliverableForm({ ...deliverableForm, description: e.target.value })}
                  rows={3}
                  placeholder="Explain what has been updated based on their requests..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {uploading ? 'Publishing...' : 'Publish Deliverable to Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visual Home Guide Modal for Naive Customers (Staircases, Roofs, Layouts) */}
      <VisualHomeGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

    </div>
  );
}
