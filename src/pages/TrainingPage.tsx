import { useEffect, useState } from "react";
import type { Training } from "../types/Training";
import { createTraining, deleteTraining, getAllTrainings } from "../services/trainingService";
import type { Attendance } from "../types/Attendance";
import { getByTraining, updateAttendanceStatus } from "../services/attendanceService";
import toast from "react-hot-toast";

export default function TrainingPage() {
  const [items, setItems] = useState<Training[]>([]);
  const [form, setForm] = useState<Training>({
    title: "",
    date: "",
    venue: "",
    resourcePerson: "",
    durationHours: undefined,
  });

  const [viewMode, setViewMode] = useState<"list" | "participants">("list");
  const [participants, setParticipants] = useState<Attendance[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

  // Load all trainings
  const load = async () => {
    try {
      const res = await getAllTrainings();
      setItems(res.data);
    } catch {
      toast.error("Failed to load trainings");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Create new training
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTraining(form);
      toast.success("Training created successfully!");
      setForm({
        title: "",
        date: "",
        venue: "",
        resourcePerson: "",
        durationHours: undefined,
      });
      load();
    } catch {
      toast.error("Failed to create training");
    }
  };

  // Delete training
  const remove = async (id?: number) => {
    if (!id) return;
    try {
      await deleteTraining(id);
      toast.success("Training deleted");
      load();
    } catch {
      toast.error("Failed to delete training");
    }
  };

  // View participants of specific training
  const viewParticipants = async (training: Training) => {
    try {
      const res = await getByTraining(training.id!);
      setParticipants(res.data);
      setSelectedTraining(training);
      setViewMode("participants");
    } catch {
      toast.error("Failed to load participants");
    }
  };

  // Update participant status
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await updateAttendanceStatus(id, newStatus);
      setParticipants((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
      toast.success(
        newStatus === "Completed"
          ? "🎉 Participant marked as completed!"
          : `Status updated to ${newStatus}`
      );
    } catch {
      toast.error("Failed to update status");
    }
  };


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Trainings</h1>

      {/* Create Training */}
      <form
        onSubmit={submit}
        className="bg-white p-4 rounded shadow grid gap-3 md:grid-cols-3"
      >
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          placeholder="Date"
          value={form.date || ""}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Venue"
          value={form.venue || ""}
          onChange={(e) => setForm({ ...form, venue: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Resource Person"
          value={form.resourcePerson || ""}
          onChange={(e) => setForm({ ...form, resourcePerson: e.target.value })}
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Duration (hours)"
          value={form.durationHours ?? ""}
          onChange={(e) =>
            setForm({ ...form, durationHours: Number(e.target.value) })
          }
        />

        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 md:col-span-1"
        >
          Add
        </button>
      </form>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("list")}
          className={`px-3 py-2 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
        >
          Trainings
        </button>
        <button
          onClick={() => setViewMode("participants")}
          disabled={!selectedTraining}
          className={`px-3 py-2 rounded ${viewMode === "participants"
            ? "bg-blue-600 text-white"
            : "bg-gray-100"
            }`}
        >
          Participants
        </button>
      </div>

      {/* Training List */}
      {viewMode === "list" && (
        <div className="overflow-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Venue</th>
                <th className="p-2 text-left">Resource Person</th>
                <th className="p-2 text-left">Hours</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-2">{t.title}</td>
                  <td className="p-2">{t.date}</td>
                  <td className="p-2">{t.venue}</td>
                  <td className="p-2">{t.resourcePerson}</td>
                  <td className="p-2">{t.durationHours}</td>
                  <td className="p-2 text-center space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => viewParticipants(t)}
                    >
                      View Participants
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => remove(t.id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    className="p-4 text-center text-gray-500"
                    colSpan={6}
                  >
                    No trainings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Participant View */}
      {viewMode === "participants" && selectedTraining && (
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Participants — {selectedTraining.title}
          </h2>
          <table className="min-w-full text-sm bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Staff Name</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{p.staff.fullName}</td>
                  <td className="p-2">{p.staff.role?.roleName}</td>
                  <td className="p-2 flex items-center gap-3">
                    {/* ✅ Status badge */}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${p.status === "Assigned"
                          ? "bg-gray-200 text-gray-700"
                          : p.status === "Attended"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {p.status === "Completed" && <span>✅</span>}
                    </span>



                    {/* Dropdown to change status */}
                    <select
                      value={p.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        await updateStatus(p.id!, newStatus);
                      }}
                      className="border p-1 rounded text-sm focus:ring-1 focus:ring-blue-400"
                    >
                      <option>Assigned</option>
                      <option>Attended</option>
                      <option>Completed</option>
                    </select>
                  </td>
                </tr>
              ))}

              {participants.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={3}>
                    No participants assigned.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
