import ManageUsersClient from "./ManageUsersClient";

export const dynamic = 'force-dynamic';

const API_URL=process.env.API_URL;
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