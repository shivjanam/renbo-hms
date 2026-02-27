import { useState, useEffect } from 'react'
import { getAppointments } from '../../services/adminService'
import { 
  MagnifyingGlassIcon, 
  CalendarDaysIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const pageSize = 10

  useEffect(() => {
    fetchAppointments()
  }, [currentPage, searchQuery, statusFilter, dateFilter])

  const fetchAppointments = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const filters = {}
      if (statusFilter) filters.status = statusFilter
      if (dateFilter) filters.date = dateFilter
      
      const data = await getAppointments(currentPage, pageSize, filters)
      
      if (data.content) {
        setAppointments(data.content)
        setTotalPages(data.totalPages || 1)
        setTotalElements(data.totalElements || data.content.length)
      } else if (Array.isArray(data)) {
        setAppointments(data)
        setTotalPages(1)
        setTotalElements(data.length)
      } else {
        throw new Error('Invalid data format')
      }
    } catch (err) {
      console.error('Error fetching appointments:', err)
      setError('Failed to load appointments. Using sample data.')
      setAppointments(getSampleAppointments())
      setTotalPages(1)
      setTotalElements(10)
    } finally {
      setLoading(false)
    }
  }

  const getSampleAppointments = () => [
    { id: 1, appointmentNumber: 'APT001', patientName: 'Rajesh Kumar', doctorName: 'Dr. Anil Gupta', appointmentDate: '2026-02-03', appointmentTime: '10:00 AM', status: 'SCHEDULED', type: 'CONSULTATION' },
    { id: 2, appointmentNumber: 'APT002', patientName: 'Priya Sharma', doctorName: 'Dr. Meera Reddy', appointmentDate: '2026-02-03', appointmentTime: '11:30 AM', status: 'COMPLETED', type: 'FOLLOW_UP' },
    { id: 3, appointmentNumber: 'APT003', patientName: 'Amit Singh', doctorName: 'Dr. Vikash Sharma', appointmentDate: '2026-02-03', appointmentTime: '02:00 PM', status: 'IN_PROGRESS', type: 'CONSULTATION' },
    { id: 4, appointmentNumber: 'APT004', patientName: 'Sunita Devi', doctorName: 'Dr. Priya Iyer', appointmentDate: '2026-02-03', appointmentTime: '03:30 PM', status: 'SCHEDULED', type: 'CONSULTATION' },
    { id: 5, appointmentNumber: 'APT005', patientName: 'Vikram Patel', doctorName: 'Dr. Rahul Menon', appointmentDate: '2026-02-03', appointmentTime: '04:00 PM', status: 'CANCELLED', type: 'EMERGENCY' },
    { id: 6, appointmentNumber: 'APT006', patientName: 'Anita Roy', doctorName: 'Dr. Anil Gupta', appointmentDate: '2026-02-04', appointmentTime: '09:00 AM', status: 'SCHEDULED', type: 'CONSULTATION' },
    { id: 7, appointmentNumber: 'APT007', patientName: 'Suresh Nair', doctorName: 'Dr. Meera Reddy', appointmentDate: '2026-02-04', appointmentTime: '10:30 AM', status: 'SCHEDULED', type: 'FOLLOW_UP' },
    { id: 8, appointmentNumber: 'APT008', patientName: 'Kavita Joshi', doctorName: 'Dr. Vikash Sharma', appointmentDate: '2026-02-04', appointmentTime: '11:00 AM', status: 'CONFIRMED', type: 'CONSULTATION' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-700'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-700'
      case 'COMPLETED':
        return 'bg-green-100 text-green-700'
      case 'CANCELLED':
        return 'bg-red-100 text-red-700'
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'CONSULTATION':
        return 'bg-purple-100 text-purple-700'
      case 'FOLLOW_UP':
        return 'bg-indigo-100 text-indigo-700'
      case 'EMERGENCY':
        return 'bg-red-100 text-red-700'
      case 'VIDEO_CALL':
        return 'bg-cyan-100 text-cyan-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatStatus = (status) => {
    if (!status) return 'Pending'
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(0)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-500 mt-1">View and manage all appointments</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <CalendarDaysIcon className="h-5 w-5" />
            Calendar View
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <ExclamationCircleIcon className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-700">{error}</span>
        </div>
      )}

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'All', count: totalElements, color: 'bg-gray-100 text-gray-700' },
          { label: 'Scheduled', count: appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length, color: 'bg-blue-100 text-blue-700' },
          { label: 'In Progress', count: appointments.filter(a => a.status === 'IN_PROGRESS').length, color: 'bg-yellow-100 text-yellow-700' },
          { label: 'Completed', count: appointments.filter(a => a.status === 'COMPLETED').length, color: 'bg-green-100 text-green-700' },
          { label: 'Cancelled', count: appointments.filter(a => a.status === 'CANCELLED').length, color: 'bg-red-100 text-red-700' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
            <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${stat.color}`}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, doctor, or appointment ID..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(0); }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <CalendarDaysIcon className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No appointments found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-primary-600">
                          {apt.appointmentNumber || `APT${apt.id}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 text-sm font-medium">
                              {(apt.patientName?.[0] || 'P').toUpperCase()}
                            </span>
                          </div>
                          <span className="ml-3 text-sm text-gray-900">{apt.patientName || 'Patient'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {apt.doctorName || 'Doctor'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{apt.appointmentDate || '-'}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          {apt.appointmentTime || apt.slotTime || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(apt.type || apt.appointmentType)}`}>
                          {(apt.type || apt.appointmentType || 'Consultation').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(apt.status)}`}>
                          {formatStatus(apt.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors" title="View">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors" title="Confirm">
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Cancel">
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t">
              <div className="text-sm text-gray-500">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} appointments
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="px-4 py-2 text-sm font-medium">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AppointmentManagement
