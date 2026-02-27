import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

const DoctorDashboard = () => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    todayAppointments: 0,
    completed: 0,
    inQueue: 0,
    totalPatients: 0
  })
  const [todayQueue, setTodayQueue] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Try to fetch appointments for today
      const today = new Date().toISOString().split('T')[0]
      const response = await api.get('/api/v1/appointments', {
        params: { date: today, size: 50 }
      })

      const appointments = response.data?.content || response.data || []
      
      // Calculate stats
      const completed = appointments.filter(a => a.status === 'COMPLETED').length
      const inQueue = appointments.filter(a => 
        ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_QUEUE'].includes(a.status)
      ).length

      setStats({
        todayAppointments: appointments.length,
        completed,
        inQueue,
        totalPatients: appointments.length
      })

      // Set queue (pending appointments)
      const queueAppointments = appointments.filter(a => 
        ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_QUEUE', 'IN_PROGRESS'].includes(a.status)
      ).slice(0, 5)
      setTodayQueue(queueAppointments)

      // Set upcoming appointments
      setUpcomingAppointments(appointments.slice(0, 5))

    } catch (err) {
      console.error('Dashboard error:', err)
      setError('Could not load dashboard data')
      // Set fallback data
      setStats({
        todayAppointments: 12,
        completed: 8,
        inQueue: 4,
        totalPatients: 156
      })
      setTodayQueue(getSampleQueue())
      setUpcomingAppointments(getSampleQueue())
    } finally {
      setLoading(false)
    }
  }

  const getSampleQueue = () => [
    { id: 1, patientName: 'Rajesh Kumar', appointmentTime: '10:00 AM', status: 'IN_QUEUE', tokenNumber: 'T001', chiefComplaint: 'Chest pain' },
    { id: 2, patientName: 'Priya Sharma', appointmentTime: '10:30 AM', status: 'CHECKED_IN', tokenNumber: 'T002', chiefComplaint: 'Follow-up' },
    { id: 3, patientName: 'Amit Singh', appointmentTime: '11:00 AM', status: 'SCHEDULED', tokenNumber: 'T003', chiefComplaint: 'Fever and cold' },
    { id: 4, patientName: 'Sunita Devi', appointmentTime: '11:30 AM', status: 'SCHEDULED', tokenNumber: 'T004', chiefComplaint: 'Back pain' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700'
      case 'IN_QUEUE':
      case 'CHECKED_IN':
        return 'bg-yellow-100 text-yellow-700'
      case 'COMPLETED':
        return 'bg-green-100 text-green-700'
      case 'SCHEDULED':
      case 'CONFIRMED':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatStatus = (status) => {
    if (!status) return 'Scheduled'
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.displayName || 'Doctor'}</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <ExclamationCircleIcon className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-700">{error} - Showing sample data</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-primary-600">{stats.todayAppointments}</p>
              <p className="text-gray-500">Today's Appointments</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-full">
              <CalendarDaysIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-gray-500">Completed</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-orange-600">{stats.inQueue}</p>
              <p className="text-gray-500">In Queue</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
              <p className="text-gray-500">Total Patients</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Queue */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Patient Queue</h2>
            <Link to="/doctor/appointments" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          
          {todayQueue.length > 0 ? (
            <div className="space-y-3">
              {todayQueue.map((patient, index) => (
                <div key={patient.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {patient.tokenNumber || `#${index + 1}`}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{patient.patientName || 'Patient'}</p>
                      <p className="text-sm text-gray-500">
                        {patient.slotStartTime || patient.appointmentTime || '-'} • {patient.chiefComplaint || 'Consultation'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                      {formatStatus(patient.status)}
                    </span>
                    <Link 
                      to={`/doctor/consultation/${patient.id}`}
                      className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Start
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ClockIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No patients in queue</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/doctor/appointments"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <CalendarDaysIcon className="h-8 w-8 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">View Appointments</span>
            </Link>
            <Link 
              to="/doctor/patients"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <UserGroupIcon className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">My Patients</span>
            </Link>
            <Link 
              to="/doctor/prescriptions"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Prescriptions</span>
            </Link>
            <Link 
              to="/doctor/appointments"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <CheckCircleIcon className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Today's Schedule</span>
            </Link>
          </div>

          {/* Today's Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Today's Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-600">Appointments</p>
                <p className="font-semibold text-blue-900">{stats.todayAppointments}</p>
              </div>
              <div>
                <p className="text-blue-600">Completed</p>
                <p className="font-semibold text-blue-900">{stats.completed}</p>
              </div>
              <div>
                <p className="text-blue-600">Pending</p>
                <p className="font-semibold text-blue-900">{stats.inQueue}</p>
              </div>
              <div>
                <p className="text-blue-600">Cancelled</p>
                <p className="font-semibold text-blue-900">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
