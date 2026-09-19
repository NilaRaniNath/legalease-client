import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import UpdateProfileForm from "./UpdateProfileForm";


  const API_URL = process.env.API_URL;
async function getUserProfile(email) {
  if (!email) return null;
  try {
    const res = await fetch(`${API_URL}/user/${encodeURIComponent(email)}`, {
      cache: "no-store",
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    return null;
  }
}

export default async function UpdateProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const dbUser = await getUserProfile(session?.user?.email);

  const currentUser = dbUser || session?.user;

  return (
    <div className="min-h-screen bg-[#0B1524] text-slate-100 p-4 md:p-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        {currentUser && <UpdateProfileForm user={currentUser} imgbbApiKey={process.env.IMGBB_API_KEY} />}
      </div>
    </div>
  );
}