import ManageUsersClient from "./ManageUsersClient";
const NEXT_PUBLIC_BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;
async function getAllUsers() {
  try {
    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/users`, { cache: "no-store" });
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