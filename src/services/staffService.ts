import api from "./api";
import type { Staff } from "../types/Staff";

export const getAllStaff = () => api.get<Staff[]>("/staff");
export const createStaff = (data: Staff) => api.post("/staff", data);
export const deleteStaff = (id: number) => api.delete(`/staff/${id}`);
export const getByRole = (roleName: string) => api.get<Staff[]>(`/staff/role/${encodeURIComponent(roleName)}`);
