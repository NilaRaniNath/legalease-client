import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import UpdateProfileForm from "./UpdateProfileForm";


  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
async function getUserProfile(email) {
  if (!email) return null;
  try {
    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/user/${encodeURIComponent(email)}`, {
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
        {currentUser && <UpdateProfileForm user={currentUser} />}
      </div>
    </div>
  );
}