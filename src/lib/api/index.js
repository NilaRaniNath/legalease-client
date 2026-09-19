import { apiGet, apiPost, apiPatch, apiPut, apiDelete } from "./client";

export const lawyerApi = {
  getProfile: (email) =>
    apiGet(`/api/lawyer/profile?email=${encodeURIComponent(email)}`),

  saveProfile: (payload) => apiPost("/api/lawyer/profile", payload),

  deleteProfile: (userId) => apiDelete(`/api/lawyer/profile/${userId}`),

  getByEmail: (email) =>
    apiGet(`/api/lawyers/email/${encodeURIComponent(email)}`),

  getAll: (params = {}) => {
    const query = new URLSearchParams(params);
    return apiGet(`/api/lawyer/all?${query.toString()}`);
  },

  getFeatured: () => apiGet("/api/lawyer/featured"),
};

export const hiringApi = {
  getClientHistory: (email) =>
    apiGet(`/api/hiring/client/${encodeURIComponent(email)}`),

  getLawyerRequests: (email) =>
    apiGet(`/api/hiring/lawyer/${encodeURIComponent(email)}`),

  createRequest: (payload) => apiPost("/api/hiring/request", payload),

  updateStatus: (id, status) =>
    apiPatch(`/api/hiring/update-status/${id}`, { status }),

  checkPaid: (clientEmail, lawyerId) =>
    apiGet(
      `/api/hirings/check?clientEmail=${encodeURIComponent(
        clientEmail
      )}&lawyerId=${encodeURIComponent(lawyerId)}`
    ),
};

export const commentApi = {
  getForLawyer: (lawyerId) => apiGet(`/api/comments/${lawyerId}`),

  getUserComments: (email) =>
    apiGet(`/api/user-comments?email=${encodeURIComponent(email)}`),

  create: (payload) => apiPost("/api/comments", payload),

  update: (id, payload) => apiPut(`/api/comments/${id}`, payload),

  remove: (id, email) =>
    apiDelete(`/api/comments/${id}?email=${encodeURIComponent(email)}`),
};

export const userApi = {
  getByEmail: (email) => apiGet(`/user/${encodeURIComponent(email)}`),

  upsert: (email, payload) =>
    apiPut(`/user/${encodeURIComponent(email)}`, payload),

  updateProfile: (email, payload) =>
    apiPatch(`/user/update-profile/${encodeURIComponent(email)}`, payload),
};

export const adminApi = {
  getUsers: () => apiGet("/api/users"),

  changeRole: (id, role) => apiPatch(`/api/users/${id}/role`, { role }),

  deleteUser: (id) => apiDelete(`/api/users/${id}`),

  getTransactions: () => apiGet("/api/transactions"),

  getAnalytics: () => apiGet("/api/admin/analytics"),
};

export const aiApi = {
  analyzeIssue: (issue) => apiPost("/api/ai/analyze-issue", { issue }),
};

export const messageApi = {
  getByHiring: (hiringId) =>
    apiGet(`/api/messages/${encodeURIComponent(hiringId)}`),

  send: (payload) => apiPost("/api/messages", payload),

  markRead: (messageId, readerEmail) =>
    apiPatch(`/api/messages/${messageId}/read`, { readerEmail }),
};

export const availabilityApi = {
  get: (lawyerEmail) =>
    apiGet(`/api/availability?lawyerEmail=${encodeURIComponent(lawyerEmail)}`),

  save: (payload) => apiPost("/api/availability", payload),

  remove: (lawyerEmail) =>
    apiDelete(`/api/availability?lawyerEmail=${encodeURIComponent(lawyerEmail)}`),
};

export const bookingApi = {
  create: (payload) => apiPost("/api/bookings", payload),

  listForLawyer: (lawyerEmail) =>
    apiGet(`/api/bookings?lawyerEmail=${encodeURIComponent(lawyerEmail)}`),

  listForClient: (clientEmail) =>
    apiGet(`/api/bookings?clientEmail=${encodeURIComponent(clientEmail)}`),

  updateStatus: (id, payload) =>
    apiPatch(`/api/bookings/${encodeURIComponent(id)}`, payload),
};

export const caseApi = {
  get: (id) => apiGet(`/api/cases/${encodeURIComponent(id)}`),

  listForUser: (userId, email) =>
    apiGet(
      `/api/cases/user/${encodeURIComponent(userId)}${
        email ? `?email=${encodeURIComponent(email)}` : ""
      }`
    ),

  create: (payload) => apiPost("/api/cases", payload),

  updateStatus: (id, payload) =>
    apiPatch(`/api/cases/${encodeURIComponent(id)}/status`, payload),
};