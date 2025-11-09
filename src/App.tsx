import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import StaffPage from "./pages/StaffPage";
import TrainingPage from "./pages/TrainingPage";
import AttendancePage from "./pages/AttendancePage";
import RolePage from "./pages/RolePage";

export default function App() {
  const link = "px-3 py-2 rounded hover:bg-blue-50";
  const active = "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <div className="min-h-screen bg-gray-50">
      <BrowserRouter>
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="text-lg font-semibold">Sanasa Training Tracker</div>
            <nav className="flex gap-2">
              <NavLink to="/roles" className={({isActive}) => `${link} ${isActive ? active : ""}`}>Roles</NavLink>
              <NavLink to="/staff" className={({isActive}) => `${link} ${isActive ? active : ""}`}>Staff</NavLink>
              <NavLink to="/training" className={({isActive}) => `${link} ${isActive ? active : ""}`}>Training</NavLink>
              <NavLink to="/attendance" className={({isActive}) => `${link} ${isActive ? active : ""}`}>Attendance</NavLink>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/staff" replace />} />
            <Route path="/roles" element={<RolePage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}
