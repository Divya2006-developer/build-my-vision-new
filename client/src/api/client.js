// API client with automatic token attachment

const API_BASE_URL = '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('bmv_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If payload is FormData, do not set Content-Type header (browser sets boundary)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = (data && data.error) || response.statusText || 'Request failed';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => apiRequest('/auth/me'),

  // Designers & Portfolios
  getDesigners: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/designers${query ? `?${query}` : ''}`);
  },
  getDesignerById: (id) => apiRequest(`/designers/${id}`),
  updateDesignerProfile: (profile) => apiRequest('/designers/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  getPortfolios: (category) => apiRequest(`/designers/portfolios${category ? `?category=${category}` : ''}`),
  getMyPortfolios: () => apiRequest('/designers/portfolios/my'),
  createPortfolio: (data) => apiRequest('/designers/portfolios', { method: 'POST', body: JSON.stringify(data) }),
  updatePortfolio: (id, data) => apiRequest(`/designers/portfolios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePortfolio: (id) => apiRequest(`/designers/portfolios/${id}`, { method: 'DELETE' }),

  // Projects / Visions
  getProjects: () => apiRequest('/projects'),
  getProjectById: (id) => apiRequest(`/projects/${id}`),
  createProject: (projectData) => apiRequest('/projects', { method: 'POST', body: JSON.stringify(projectData) }),
  acceptProject: (id) => apiRequest(`/projects/${id}/accept`, { method: 'PUT' }),
  updateProjectStatus: (id, status) => apiRequest(`/projects/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Design Proposals & Style Choice Options (Staircases, Roofs, Layouts)
  getProposals: (projectId) => apiRequest(`/projects/${projectId}/proposals`),
  createProposal: (projectId, data) => apiRequest(`/projects/${projectId}/proposals`, { method: 'POST', body: JSON.stringify(data) }),
  chooseProposalOption: (projectId, proposalId, data) =>
    apiRequest(`/projects/${projectId}/proposals/${proposalId}/choose`, { method: 'PUT', body: JSON.stringify(data) }),

  // Deliverables & Pinpoint Revisions
  addDeliverable: (projectId, deliverableData) =>
    apiRequest(`/projects/${projectId}/deliverables`, { method: 'POST', body: JSON.stringify(deliverableData) }),
  updateDeliverableStatus: (deliverableId, status) =>
    apiRequest(`/projects/deliverables/${deliverableId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  addRevision: (deliverableId, revisionData) =>
    apiRequest(`/projects/deliverables/${deliverableId}/revisions`, { method: 'POST', body: JSON.stringify(revisionData) }),

  // Messages & Chat
  getMessages: (projectId) => apiRequest(`/messages/${projectId}`),
  sendMessage: (projectId, messageData) =>
    apiRequest(`/messages/${projectId}`, { method: 'POST', body: JSON.stringify(messageData) }),

  // Reviews
  createReview: (reviewData) => apiRequest('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
  getDesignerReviews: (designerId) => apiRequest(`/reviews/designer/${designerId}`),

  // File Upload
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest('/upload', { method: 'POST', body: formData });
  },

  // DB Status
  getDbStatus: () => apiRequest('/db-status')
};
