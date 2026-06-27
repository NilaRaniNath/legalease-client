import ManageUsersClient from "./ManageUsersClient";

async function getAllUsers() {
  try {
    const res = await fetch("http://localhost:8000/api/users", { cache: "no-store" });
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