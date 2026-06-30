// lib/api/lawyer.js

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


export async function getLawyerProfile(userId) {
  try {
    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/lawyer/profile?userId=${userId}`, {
      cache: "no-store", 
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return await res.json();
  } catch (error) {
    console.error("Error in getLawyerProfile:", error);
    return null;
  }
}




