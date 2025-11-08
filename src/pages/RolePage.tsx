import { useEffect, useState } from "react";
import type { Role } from "../types/Role";
import { createRole, deleteRole, getAllRoles } from "../services/roleService";

export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState<Role>({ roleName: "", roleLevel: undefined });

  const loadRoles = async () => {
    const res = await getAllRoles();
    setRoles(res.data);
  };

  useEffect(() => { loadRoles(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRole(form);
    setForm({ roleName: "", roleLevel: undefined });
    loadRoles();
  };

  const remove = async (id?: number) => {
    if (!id) return;
    await deleteRole(id);
    loadRoles();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Roles</h1>

      {/* Create Role */}
      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid gap-3 md:grid-cols-3">
        <input
          className="border p-2 rounded"
          placeholder="Role Name"
          value={form.roleName || ""}
          onChange={(e) => setForm({ ...form, roleName: e.target.value })}
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Role Level (optional)"
          value={form.roleLevel ?? ""}
          onChange={(e) =>
            setForm({ ...form, roleLevel: e.target.value ? Number(e.target.value) : undefined })
          }
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">
          Add Role
        </button>
      </form>

      {/* Role List */}
      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Role Name</th>
              <th className="p-2 text-left">Role Level</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{r.roleName}</td>
                <td className="p-2">{r.roleLevel ?? "-"}</td>
                <td className="p-2 text-center">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => remove(r.id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {roles.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={4}>
                  No roles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
