// lib/api/lawyer.js
// Backward-compatible helper re-exporting the centralized lawyer API.

import { lawyerApi } from "./index";

export const getLawyerProfile = lawyerApi.getProfile;

export { lawyerApi };