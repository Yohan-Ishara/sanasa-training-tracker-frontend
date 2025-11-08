import api from "./api";
import type { Training } from "../types/Training";

export const getAllTrainings = () => api.get<Training[]>("/trainings");
export const createTraining = (data: Training) => api.post("/trainings", data);
export const deleteTraining = (id: number) => api.delete(`/trainings/${id}`);
