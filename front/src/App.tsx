import Home from "./views/home/Home";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Registrer";
import ProtectedRoute from "./views/components/ProtectedRoute";
import Consultorio from "./views/clinics/Consultorio";
import Administrators from "./views/admin/Administrators";
import Paciente from "./views/patients/Patients";
import Especialista from "./views/specialists/Specialists";
import SpecialistView from "./views/specialists/SpecialistView";
import Dating from "./views/dating/Dating";
import ScheduleDate from "./views/dating/ScheduleDate";
import CitaDetalle from "./views/dating/CitaDetalle";
import AddDatingView from "./views/record/AddDatingView";
import Record from "./views/record/Record";
import RequestReset from "./views/RequestReset";
import ResetPassword from "./views/ResetPassword";
import Pago from "./views/specialists/Pago";
import { ContactoAdmin, ContactoUsuario } from "./views/contacto/Contacte";
import PagosRealizados from "./views/pay/PagosRealizados";

import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* ... existing routes ... */}
          <Route path="/admin/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Administrators />
            </ProtectedRoute>} />

          <Route path="/admin/clinics" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Consultorio />
            </ProtectedRoute>} />

          <Route path="/admin/patients" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Paciente />
            </ProtectedRoute>} />

          <Route path="/admin/specialists" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Especialista />
            </ProtectedRoute>} />

          <Route path="/admin/specialists/view" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SpecialistView />
            </ProtectedRoute>} />

          <Route path="/admin/dating" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dating />
            </ProtectedRoute>} />

          <Route path="/admin/dating/scheduledate" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ScheduleDate />
            </ProtectedRoute>} />

          <Route path="/especialist/patients" element={
            <ProtectedRoute allowedRoles={['especialista']}>
              <Paciente />
            </ProtectedRoute>} />

          <Route path="/especialista/cita/view/:id_cita" element={
            <ProtectedRoute allowedRoles={['especialista']}>
              <AddDatingView />
            </ProtectedRoute>} />

          <Route path="/pago/:id_cita" element={
            <ProtectedRoute allowedRoles={['especialista']}>
              <Pago />
            </ProtectedRoute>} />

          <Route path="/pacientes/dating" element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <Dating />
            </ProtectedRoute>} />

          <Route path="/pacientes/dating/scheduledate" element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <ScheduleDate />
            </ProtectedRoute>} />

          <Route path="/record" element={<Record />} />

          <Route path="/cita/detalle/:id" element={<CitaDetalle />} />
          <Route path="/registrer" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sendcode" element={<RequestReset />} />
          <Route path="/verifycode" element={<ResetPassword />} />
          <Route path="/admin/contact" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ContactoAdmin />
            </ProtectedRoute>} />

          <Route path="/contact" element={<ContactoUsuario />} />

          <Route path="/pay" element={<PagosRealizados />} />

          <Route path="/dating" element={<Login />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
