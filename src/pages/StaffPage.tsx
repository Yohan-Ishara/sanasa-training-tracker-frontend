import { useEffect, useState } from "react";
import type { Staff } from "../types/Staff";
import type { Role } from "../types/Role";
import { createStaff, deleteStaff, getAllStaff, getByRole } from "../services/staffService";
import { getAllRoles } from "../services/roleService";
import toast from "react-hot-toast";

export default function StaffPage() {
  const [items, setItems] = useState<Staff[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState<Staff>({
    fullName: "",
    epfCode: "",
    nicNumber: "",
    branch: "",
    province: "",
    email: "",
    status: "Active",
    role: undefined
  });
  const [roleFilter, setRoleFilter] = useState<string>("");

  const load = async () => {
    const [s, r] = await Promise.all([getAllStaff(), getAllRoles()]);
    setItems(s.data);
    setRoles(r.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    const payload: Staff = {
      ...form,
      role: form.role?.id ? { id: form.role.id, roleName: form.role.roleName } : undefined
    };
        await createStaff(payload);
        toast.success("Staff member added successfully!");
        setForm({ fullName: "", epfCode: "", nicNumber: "", branch: "", province: "", email: "", status: "Active" });
        load();
    } catch (err) {
    toast.error("Failed to add staff. Please check your input.");
    }
}

  const remove = async (id?: number) => {
    if (!id) return;
    try {
    await deleteStaff(id);
    toast.success("Staff deleted!");
    load();
  } catch {
    toast.error("Delete failed");
  }
  };

  const applyRoleFilter = async (value: string) => {
    setRoleFilter(value);
    if (!value) { load(); return; }
    const res = await getByRole(value);
    setItems(res.data);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Staff</h1>

      {/* Create */}
      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid gap-3 md:grid-cols-3">
        <input className="border p-2 rounded" placeholder="Full Name"
               value={form.fullName || ""} onChange={e => setForm({ ...form, fullName: e.target.value })} />
        <input className="border p-2 rounded" placeholder="EPF Code"
               value={form.epfCode || ""} onChange={e => setForm({ ...form, epfCode: e.target.value })} />
        <input className="border p-2 rounded" placeholder="NIC Number"
               value={form.nicNumber || ""} onChange={e => setForm({ ...form, nicNumber: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Branch"
               value={form.branch || ""} onChange={e => setForm({ ...form, branch: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Province"
               value={form.province || ""} onChange={e => setForm({ ...form, province: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Email"
               value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} />

        <select className="border p-2 rounded"
                value={form.status || "Active"}
                onChange={e => setForm({ ...form, status: e.target.value })}>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <select className="border p-2 rounded"
                value={form.role?.id || 0}
                onChange={e => {
                  const id = Number(e.target.value);
                  const r = roles.find(x => x.id === id);
                  setForm({ ...form, role: r ? { id: r.id, roleName: r.roleName, roleLevel: r.roleLevel } : undefined });
                }}>
          <option value={0}>Select Role</option>
          {roles.map(r => <option key={r.id} value={r.id}>{r.roleName}</option>)}
        </select>

        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 md:col-span-1">Add</button>
      </form>

      {/* Filter */}
      <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="text-sm text-gray-600">Filter by Role</div>
        <select className="border p-2 rounded"
                value={roleFilter}
                onChange={(e) => applyRoleFilter(e.target.value)}>
          <option value="">All</option>
          {roles.map(r => <option key={r.id} value={r.roleName}>{r.roleName}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">EPF</th>
              <th className="p-2 text-left">NIC</th>
              <th className="p-2 text-left">Branch</th>
              <th className="p-2 text-left">Province</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.fullName}</td>
                <td className="p-2">{s.epfCode}</td>
                <td className="p-2">{s.nicNumber}</td>
                <td className="p-2">{s.branch}</td>
                <td className="p-2">{s.province}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.role?.roleName}</td>
                <td className="p-2">{s.status}</td>
                <td className="p-2 text-center">
                  <button className="text-red-600 hover:underline" onClick={() => remove(s.id!)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td className="p-4 text-center text-gray-500" colSpan={9}>No staff yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
