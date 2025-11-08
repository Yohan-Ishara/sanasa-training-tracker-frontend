import api from "./api";
import type { Attendance } from "../types/Attendance";

export const getAllAttendance = () => api.get<Attendance[]>("/attendance");
export const createAttendance = (data: Attendance) => api.post("/attendance", data);
export const deleteAttendance = (id: number) => api.delete(`/attendance/${id}`);
export const getByStaff = (staffId: number) => api.get<Attendance[]>(`/attendance/staff/${staffId}`);
export const getByTraining = (trainingId: number) => api.get<Attendance[]>(`/attendance/training/${trainingId}`);
