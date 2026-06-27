import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import UserCommentsClient from "./UserCommentsClient";

// সার্ভার সাইড ডেটা ফেচিং ফাংশন
async function getUserComments(email) {
  try {
    const res = await fetch(`http://localhost:8000/api/user-comments?email=${email}`, {
      cache: "no-store", // সবসময় লেটেস্ট ডেটা আনার জন্য
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    console.error("Error fetching user comments on server:", err);
    return [];
  }
}

export default async function UserCommentsPage() {
  const reqHeaders = await headers();
  let currentUser = null;

  try {
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (session?.user) {
      currentUser = session.user;
    }
  } catch (err) {
    console.error("Error fetching session:", err);
  }

  // যদি ইউজার লগইন না থাকে
  if (!currentUser) {
    return <div className="text-center p-10 text-red-400">Please sign in to view your comments.</div>;
  }

  // 💡 useEffect ছাড়া সরাসরি সার্ভারেই ডেটা ফেচ করা হলো
  const initialComments = await getUserComments(currentUser.email);

  return (
    <UserCommentsClient 
      initialComments={initialComments} 
      currentUser={currentUser} 
    />
  );
}