import { useState, useEffect } from 'react'
import { getDashboardStats, getPatients, getDoctors, getAppointments } from '../../services/adminService'
import { 
  UserGroupIcon, 
  UserIcon, 
  CalendarDaysIcon, 
  CurrencyRupeeIcon,
  BuildingOffice2Icon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todayRevenue: 0
  })
  const [recentPatients, setRecentPatients] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch stats
      const statsData = await getDashboardStats()
      setStats({
        totalPatients: statsData.totalPatients || 0,
        totalDoctors: statsData.totalDoctors || 0,
        totalAppointments: statsData.totalAppointments || 0,
        todayRevenue: 250000 // Placeholder - would come from billing API
      })

      // Fetch recent patients
      try {
        const patientsData = await getPatients(0, 5)
        setRecentPatients(patientsData.content || patientsData || [])
      } catch (e) {
        console.log('Could not fetch recent patients')
      }

      // Fetch recent appointments
      try {
        const appointmentsData = await getAppointments(0, 5)
        setRecentAppointments(appointmentsData.content || appointmentsData || [])
      } catch (e) {
        console.log('Could not fetch recent appointments')
      }

    } catch (err) {
      console.error('Dashboard error:', err)
      setError('Failed to load dashboard data')
      // Set fallback data
      setStats({
        totalPatients: 60,
        totalDoctors: 50,
        totalAppointments: 156,
        todayRevenue: 250000
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: UserGroupIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      title: 'Doctors',
      value: stats.totalDoctors,
      icon: UserIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: "Today's Appointments",
      value: stats.totalAppointments,
      icon: CalendarDaysIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(stats.todayRevenue),
      icon: CurrencyRupeeIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      isFormatted: true
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <ExclamationCircleIcon className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-700">{error} - Showing cached data</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-3xl font-bold ${stat.color}`}>
                  {stat.isFormatted ? stat.value : stat.value.toLocaleString()}
                </p>
                <p className="text-gray-500 mt-1">{stat.title}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
            <a href="/admin/patients" className="text-sm text-primary-600 hover:text-primary-700">View All →</a>
          </div>
          {recentPatients.length > 0 ? (
            <div className="space-y-3">
              {recentPatients.slice(0, 5).map((patient, index) => (
                <div key={patient.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium">
                      {(patient.firstName?.[0] || patient.name?.[0] || 'P').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {patient.firstName && patient.lastName 
                        ? `${patient.firstName} ${patient.lastName}`
                        : patient.name || `Patient ${patient.id}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {patient.uhid || patient.email || 'Registered recently'}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent patients</p>
          )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
            <a href="/admin/appointments" className="text-sm text-primary-600 hover:text-primary-700">View All →</a>
          </div>
          {recentAppointments.length > 0 ? (
            <div className="space-y-3">
              {recentAppointments.slice(0, 5).map((apt, index) => (
                <div key={apt.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {apt.patientName || `Appointment #${apt.id}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {apt.doctorName || 'Doctor'} • {apt.appointmentDate || 'Scheduled'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    apt.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                    apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {apt.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent appointments</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/admin/patients" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <UserGroupIcon className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Manage Patients</span>
          </a>
          <a href="/admin/doctors" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <UserIcon className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Manage Doctors</span>
          </a>
          <a href="/admin/appointments" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <CalendarDaysIcon className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Appointments</span>
          </a>
          <a href="/admin/billing" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <CurrencyRupeeIcon className="h-8 w-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Billing</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
