import api from "./api";
import type { Role } from "../types/Role";

export const getAllRoles = () => api.get<Role[]>("/roles");
export const createRole = (data: Role) => api.post("/roles", data);
export const deleteRole = (id: number) => api.delete(`/roles/${id}`);
