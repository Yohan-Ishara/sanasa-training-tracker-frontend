import { useEffect, useState } from "react";
import type { Attendance } from "../types/Attendance";
import type { Staff } from "../types/Staff";
import type { Training } from "../types/Training";

import { getAllStaff } from "../services/staffService";
import { getAllTrainings } from "../services/trainingService";
import { assignParticipants } from "../services/attendanceService";
import toast from "react-hot-toast";
import { createAttendance, deleteAttendance, getByStaff, getByTraining, getAllAttendance } from "../services/attendanceService";

export default function AttendancePage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [items, setItems] = useState<Attendance[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);


  const toggleStaff = (id: number) => {
    setSelectedStaff(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };


  const [form, setForm] = useState<Attendance>({
    staff: { id: 0, fullName: "", designation: "" as any }, // designation not used here
    training: { id: 0, title: "" },
    status: "Attended"
  });

  const loadRefs = async () => {
    const [s, t] = await Promise.all([getAllStaff(), getAllTrainings()]);
    setStaff(s.data);
    setTrainings(t.data);
  };

  const loadAll = async () => {
    const res = await getAllAttendance();
    setItems(res.data);
  };

  useEffect(() => { loadRefs(); loadAll(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.staff?.id || !form.training?.id) return;

    // Payload only needs ids + status; extra fields are fine too
    const payload: Attendance = {
      staff: { id: form.staff.id, fullName: form.staff.fullName },
      training: { id: form.training.id, title: form.training.title },
      status: form.status
    };

    await createAttendance(payload);
    setForm({ ...form, status: "Attended" });
    loadAll();
  };

  const remove = async (id?: number) => {
    if (!id) return;
    await deleteAttendance(id);
    loadAll();
  };

  const filterByTraining = async (id: number) => {
    if (!id) { loadAll(); return; }
    const res = await getByTraining(id);
    setItems(res.data);
  };

  const filterByStaff = async (id: number) => {
    if (!id) { loadAll(); return; }
    const res = await getByStaff(id);
    setItems(res.data);
  };

  const assignSelectedStaff = async () => {
    if (!form.training?.id) {
      toast.error("Select a training first!");
      return;
    }
    if (selectedStaff.length === 0) {
      toast.error("Select at least one staff!");
      return;
    }
    await assignParticipants(form.training.id, selectedStaff);
    toast.success("Participants assigned successfully!");
    setSelectedStaff([]);
  };


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Attendance</h1>

      {/* Create */}
      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid gap-3 md:grid-cols-3">
        <select className="border p-2 rounded"
          value={form.staff?.id || 0}
          onChange={e => {
            const id = Number(e.target.value);
            const s = staff.find(x => x.id === id);
            setForm({ ...form, staff: s ? { id: s.id!, fullName: s.fullName, designation: "" as any } : { id: 0, fullName: "", designation: "" as any } });
          }}>
          <option value={0}>Select Staff</option>
          {staff.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
        </select>

        <select className="border p-2 rounded"
          value={form.training?.id || 0}
          onChange={e => {
            const id = Number(e.target.value);
            const t = trainings.find(x => x.id === id);
            setForm({ ...form, training: t ? { id: t.id!, title: t.title } : { id: 0, title: "" } });
          }}>
          <option value={0}>Select Training</option>
          {trainings.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>

        <select className="border p-2 rounded"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}>
          <option>Attended</option>
          <option>Absent</option>
          <option>Excused</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">Mark</button>
        <button type="button"
          onClick={assignSelectedStaff}
          className="bg-green-600 text-white rounded px-4 py-2 mt-2"
        >
          Assigns only the checked
        </button>

      </form>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow grid gap-3 md:grid-cols-3">
        <div>
          <div className="text-sm text-gray-600 mb-1">By Training</div>
          <select className="border p-2 rounded w-full" onChange={e => filterByTraining(Number(e.target.value))}>
            <option value={0}>All</option>
            {trainings.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">By Staff</div>
          <select className="border p-2 rounded w-full" onChange={e => filterByStaff(Number(e.target.value))}>
            <option value={0}>All</option>
            {staff.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left"></th>
              <th className="p-2 text-left">Staff</th>
              <th className="p-2 text-left">Training</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedStaff.includes(s.id!)}
                    onChange={() => toggleStaff(s.id!)}
                  />
                </td>
                <td className="p-2">{s.fullName}</td>
                <td className="p-2">{s.role?.roleName}</td>
              </tr>
            ))}
            {items.map(a => (
              <tr key={a.id} className="border-t">
                <td className="p-2">{a.staff?.fullName}</td>
                <td className="p-2">{a.training?.title}</td>
                <td className="p-2">{a.status}</td>
                <td className="p-2 text-center">
                  <button className="text-red-600 hover:underline" onClick={() => remove(a.id!)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td className="p-4 text-center text-gray-500" colSpan={4}>No records</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
