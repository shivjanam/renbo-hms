import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts
import Layout from './components/Layout'
import PublicLayout from './components/PublicLayout'

// Public Pages
import Home from './pages/public/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import DoctorSearch from './pages/public/DoctorSearch'
import BookAppointment from './pages/public/BookAppointment'
import TrackAppointment from './pages/public/TrackAppointment'

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard'
import MyAppointments from './pages/patient/MyAppointments'
import MyPrescriptions from './pages/patient/MyPrescriptions'
import MyLabReports from './pages/patient/MyLabReports'
import MyBills from './pages/patient/MyBills'

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard'
import DoctorAppointments from './pages/doctor/Appointments'
import DoctorPatients from './pages/doctor/Patients'
import DoctorPrescriptions from './pages/doctor/Prescriptions'
import PatientConsultation from './pages/doctor/PatientConsultation'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import PatientManagement from './pages/admin/PatientManagement'
import DoctorManagement from './pages/admin/DoctorManagement'
import AppointmentManagement from './pages/admin/AppointmentManagement'
import BillingManagement from './pages/admin/BillingManagement'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'

// Common
import NotFound from './pages/NotFound'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.primaryRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

function App() {
  const { isAuthenticated, user } = useAuthStore()

  // Determine default route based on user role
  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login'
    
    switch (user?.primaryRole) {
      case 'PATIENT':
      case 'FAMILY_MEMBER':
        return '/patient/dashboard'
      case 'DOCTOR':
      case 'SPECIALIST':
      case 'CONSULTANT':
        return '/doctor/dashboard'
      case 'HOSPITAL_ADMIN':
      case 'SUPER_ADMIN':
        return '/admin/dashboard'
      case 'RECEPTIONIST':
        return '/reception/dashboard'
      case 'NURSE':
      case 'NURSE_HEAD':
        return '/nurse/dashboard'
      case 'LAB_TECHNICIAN':
      case 'LAB_HEAD':
        return '/lab/dashboard'
      case 'PHARMACIST':
      case 'PHARMACY_HEAD':
        return '/pharmacy/dashboard'
      default:
        return '/dashboard'
    }
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<DoctorSearch />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/track-appointment" element={<TrackAppointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Patient Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['PATIENT', 'FAMILY_MEMBER']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/appointments" element={<MyAppointments />} />
        <Route path="/patient/prescriptions" element={<MyPrescriptions />} />
        <Route path="/patient/lab-reports" element={<MyLabReports />} />
        <Route path="/patient/bills" element={<MyBills />} />
      </Route>

      {/* Doctor Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['DOCTOR', 'SPECIALIST', 'CONSULTANT']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/patients" element={<DoctorPatients />} />
        <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
        <Route path="/doctor/consultation/:appointmentId" element={<PatientConsultation />} />
      </Route>

      {/* Admin Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['HOSPITAL_ADMIN', 'SUPER_ADMIN']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/patients" element={<PatientManagement />} />
        <Route path="/admin/doctors" element={<DoctorManagement />} />
        <Route path="/admin/appointments" element={<AppointmentManagement />} />
        <Route path="/admin/billing" element={<BillingManagement />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>

      {/* Redirects */}
      <Route path="/dashboard" element={<Navigate to={getDefaultRoute()} replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
