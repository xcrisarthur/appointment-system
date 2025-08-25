import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AppointmentList from "./pages/AppointmentList";
import CreateAppointment from "./pages/CreateAppointment";
import ParticipantsPage from "./pages/ParticipantsPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/create"
          element={
            <ProtectedRoute>
              <CreateAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/:id/participants"
          element={
            <ProtectedRoute>
              <ParticipantsPage />
            </ProtectedRoute>
          }
        />

        {/* default */}
        <Route path="*" element={<Navigate to="/appointments" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
