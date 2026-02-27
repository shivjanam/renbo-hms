import api from './api'

/**
 * Admin API Service
 * Provides centralized API calls for admin modules
 */

// ============ Dashboard ============
export const getDashboardStats = async () => {
  try {
    const [patientsRes, doctorsRes, appointmentsRes, hospitalsRes] = await Promise.all([
      api.get('/api/v1/patients?page=0&size=1'),
      api.get('/api/v1/doctors?page=0&size=1'),
      api.get('/api/v1/appointments?page=0&size=1'),
      api.get('/api/v1/hospitals?page=0&size=1')
    ])
    
    return {
      totalPatients: patientsRes.data?.totalElements || patientsRes.data?.length || 0,
      totalDoctors: doctorsRes.data?.totalElements || doctorsRes.data?.length || 0,
      totalAppointments: appointmentsRes.data?.totalElements || appointmentsRes.data?.length || 0,
      totalHospitals: hospitalsRes.data?.totalElements || hospitalsRes.data?.length || 0
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
}

// ============ Patients ============
export const getPatients = async (page = 0, size = 10, search = '') => {
  try {
    const params = { page, size }
    if (search) params.query = search
    
    const response = await api.get('/api/v1/patients', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching patients:', error)
    throw error
  }
}

export const getPatientById = async (id) => {
  const response = await api.get(`/api/v1/patients/${id}`)
  return response.data
}

export const createPatient = async (patientData) => {
  const response = await api.post('/api/v1/patients', patientData)
  return response.data
}

export const updatePatient = async (id, patientData) => {
  const response = await api.put(`/api/v1/patients/${id}`, patientData)
  return response.data
}

export const deletePatient = async (id) => {
  const response = await api.delete(`/api/v1/patients/${id}`)
  return response.data
}

// ============ Doctors ============
export const getDoctors = async (page = 0, size = 10, search = '') => {
  try {
    const params = { page, size }
    if (search) params.query = search
    
    const response = await api.get('/api/v1/doctors', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching doctors:', error)
    throw error
  }
}

export const getDoctorById = async (id) => {
  const response = await api.get(`/api/v1/doctors/${id}`)
  return response.data
}

export const getDoctorList = async () => {
  const response = await api.get('/api/v1/doctors/list')
  return response.data
}

export const getSpecializations = async () => {
  const response = await api.get('/api/v1/doctors/specializations')
  return response.data
}

// ============ Hospitals ============
export const getHospitals = async (page = 0, size = 10) => {
  try {
    const response = await api.get('/api/v1/hospitals', { params: { page, size } })
    return response.data
  } catch (error) {
    console.error('Error fetching hospitals:', error)
    throw error
  }
}

export const getHospitalList = async () => {
  const response = await api.get('/api/v1/hospitals/list')
  return response.data
}

// ============ Appointments ============
export const getAppointments = async (page = 0, size = 10, filters = {}) => {
  try {
    const params = { page, size, ...filters }
    const response = await api.get('/api/v1/appointments', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching appointments:', error)
    throw error
  }
}

export const getAppointmentById = async (id) => {
  const response = await api.get(`/api/v1/appointments/${id}`)
  return response.data
}

export const updateAppointmentStatus = async (id, status) => {
  const response = await api.patch(`/api/v1/appointments/${id}/status`, { status })
  return response.data
}

// ============ Billing/Invoices ============
export const getInvoices = async (page = 0, size = 10, filters = {}) => {
  try {
    const params = { page, size, ...filters }
    const response = await api.get('/api/v1/invoices', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching invoices:', error)
    throw error
  }
}

export const getInvoiceById = async (id) => {
  const response = await api.get(`/api/v1/invoices/${id}`)
  return response.data
}

export const getPayments = async (page = 0, size = 10) => {
  try {
    const response = await api.get('/api/v1/payments', { params: { page, size } })
    return response.data
  } catch (error) {
    console.error('Error fetching payments:', error)
    throw error
  }
}

// ============ Reports ============
export const getRevenueReport = async (startDate, endDate) => {
  try {
    const response = await api.get('/api/v1/reports/revenue', {
      params: { startDate, endDate }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching revenue report:', error)
    throw error
  }
}

export const getAppointmentReport = async (startDate, endDate) => {
  try {
    const response = await api.get('/api/v1/reports/appointments', {
      params: { startDate, endDate }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching appointment report:', error)
    throw error
  }
}

// ============ Users ============
export const getUsers = async (page = 0, size = 10, role = '') => {
  try {
    const params = { page, size }
    if (role) params.role = role
    const response = await api.get('/api/v1/users', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// ============ Settings ============
export const getSystemSettings = async () => {
  try {
    const response = await api.get('/api/v1/settings')
    return response.data
  } catch (error) {
    console.error('Error fetching settings:', error)
    throw error
  }
}

export const updateSystemSettings = async (settings) => {
  const response = await api.put('/api/v1/settings', settings)
  return response.data
}

export default {
  getDashboardStats,
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getDoctors,
  getDoctorById,
  getDoctorList,
  getSpecializations,
  getHospitals,
  getHospitalList,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getInvoices,
  getInvoiceById,
  getPayments,
  getRevenueReport,
  getAppointmentReport,
  getUsers,
  getSystemSettings,
  updateSystemSettings
}
