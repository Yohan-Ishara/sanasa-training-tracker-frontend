import type { Role } from "./Role";

export interface Staff {
  id?: number;
  fullName: string;
  epfCode?: string;
  nicNumber?: string;
  branch?: string;
  province?: string;
  email?: string;
  status?: string; // e.g., "Active" or "Inactive"
  role?: Role;
}
