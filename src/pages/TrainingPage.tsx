import { useEffect, useState } from "react";
import type { Training } from "../types/Training";
import { createTraining, deleteTraining, getAllTrainings } from "../services/trainingService";

export default function TrainingPage() {
  const [items, setItems] = useState<Training[]>([]);
  const [form, setForm] = useState<Training>({
    title: "",
    date: "",
    venue: "",
    resourcePerson: "",
    durationHours: undefined
  });

  const load = async () => {
    const res = await getAllTrainings();
    setItems(res.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTraining(form);
    setForm({ title: "", date: "", venue: "", resourcePerson: "", durationHours: undefined });
    load();
  };

  const remove = async (id?: number) => {
    if (!id) return;
    await deleteTraining(id);
    load();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Trainings</h1>

      {/* Create */}
      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid gap-3 md:grid-cols-3">
        <input className="border p-2 rounded" placeholder="Title"
               value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input type="date" className="border p-2 rounded" placeholder="Date"
               value={form.date || ""} onChange={e => setForm({ ...form, date: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Venue"
               value={form.venue || ""} onChange={e => setForm({ ...form, venue: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Resource Person"
               value={form.resourcePerson || ""} onChange={e => setForm({ ...form, resourcePerson: e.target.value })} />
        <input type="number" className="border p-2 rounded" placeholder="Duration (hours)"
               value={form.durationHours ?? ""} onChange={e => setForm({ ...form, durationHours: Number(e.target.value) })} />

        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 md:col-span-1">Add</button>
      </form>

      {/* List */}
      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Venue</th>
              <th className="p-2 text-left">Resource Person</th>
              <th className="p-2 text-left">Hours</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.title}</td>
                <td className="p-2">{t.date}</td>
                <td className="p-2">{t.venue}</td>
                <td className="p-2">{t.resourcePerson}</td>
                <td className="p-2">{t.durationHours}</td>
                <td className="p-2 text-center">
                  <button className="text-red-600 hover:underline" onClick={() => remove(t.id!)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td className="p-4 text-center text-gray-500" colSpan={6}>No trainings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
