import ManageUsersClient from "./ManageUsersClient";
import { API_URL } from "@/lib/config";

export const dynamic = 'force-dynamic';

async function getAllUsers() {
  try {
    const res = await fetch(`${API_URL}/api/users`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.users : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function ManageUsersPage() {
  const initialUsers = await getAllUsers();
  return <ManageUsersClient initialUsers={initialUsers} />;
}