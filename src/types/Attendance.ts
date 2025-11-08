import type { Staff } from "./Staff";
import type {  Training } from "./Training";

export interface Attendance {
  id?: number;
  staff: Staff;
  training: Training;
  status: string; // e.g., "Attended", "Absent"
}
