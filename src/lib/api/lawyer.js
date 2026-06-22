// lib/api/lawyer.js

const BASE_URL = "http://localhost:8000/api";

// ১. লয়ার প্রোফাইল ডেটা সার্ভার থেকে আনা
export async function getLawyerProfile(userId) {
  try {
    const res = await fetch(`${BASE_URL}/lawyer/profile?userId=${userId}`, {
      cache: "no-store", // প্রতিবার লাইভ ফ্রেশ ডেটা সার্ভার থেকে রিকোয়েস্ট করবে
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return await res.json();
  } catch (error) {
    console.error("Error in getLawyerProfile:", error);
    return null;
  }
}

// ২. লয়ারের নিজস্ব সার্ভিস লিস্ট সার্ভার থেকে আনা
export async function getLawyerServices(userId) {
  try {
    const res = await fetch(`${BASE_URL}/lawyer/services?userId=${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch services");
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error in getLawyerServices:", error);
    return [];
  }
}


