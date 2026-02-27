import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

const DoctorAppointments = () => {
  const { user } = useAuthStore()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0])
  const pageSize = 10

  useEffect(() => {
    fetchAppointments()
  }, [currentPage, statusFilter, dateFilter])

  const fetchAppointments = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = { page: currentPage, size: pageSize }
      if (statusFilter) params.status = statusFilter
      if (dateFilter) params.date = dateFilter
      
      const response = await api.get('/api/v1/appointments', { params })
      
      const data = response.data
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
      setError('Could not load appointments. Showing sample data.')
      setAppointments(getSampleAppointments())
      setTotalPages(1)
      setTotalElements(10)
    } finally {
      setLoading(false)
    }
  }

  const getSampleAppointments = () => [
    { id: 1, appointmentNumber: 'APT001', patientName: 'Rajesh Kumar', patientMobile: '9876543210', appointmentDate: dateFilter, slotStartTime: '09:00', slotEndTime: '09:30', status: 'SCHEDULED', appointmentType: 'CONSULTATION', chiefComplaint: 'Chest pain', tokenNumber: 'T001' },
    { id: 2, appointmentNumber: 'APT002', patientName: 'Priya Sharma', patientMobile: '9876543211', appointmentDate: dateFilter, slotStartTime: '09:30', slotEndTime: '10:00', status: 'CHECKED_IN', appointmentType: 'FOLLOW_UP', chiefComplaint: 'Follow-up visit', tokenNumber: 'T002' },
    { id: 3, appointmentNumber: 'APT003', patientName: 'Amit Singh', patientMobile: '9876543212', appointmentDate: dateFilter, slotStartTime: '10:00', slotEndTime: '10:30', status: 'IN_PROGRESS', appointmentType: 'CONSULTATION', chiefComplaint: 'Fever and cold', tokenNumber: 'T003' },
    { id: 4, appointmentNumber: 'APT004', patientName: 'Sunita Devi', patientMobile: '9876543213', appointmentDate: dateFilter, slotStartTime: '10:30', slotEndTime: '11:00', status: 'COMPLETED', appointmentType: 'CONSULTATION', chiefComplaint: 'Back pain', tokenNumber: 'T004' },
    { id: 5, appointmentNumber: 'APT005', patientName: 'Vikram Patel', patientMobile: '9876543214', appointmentDate: dateFilter, slotStartTime: '11:00', slotEndTime: '11:30', status: 'SCHEDULED', appointmentType: 'CONSULTATION', chiefComplaint: 'Headache', tokenNumber: 'T005' },
    { id: 6, appointmentNumber: 'APT006', patientName: 'Anita Roy', patientMobile: '9876543215', appointmentDate: dateFilter, slotStartTime: '11:30', slotEndTime: '12:00', status: 'CANCELLED_BY_PATIENT', appointmentType: 'FOLLOW_UP', chiefComplaint: 'Cancelled', tokenNumber: 'T006' },
    { id: 7, appointmentNumber: 'APT007', patientName: 'Suresh Nair', patientMobile: '9876543216', appointmentDate: dateFilter, slotStartTime: '14:00', slotEndTime: '14:30', status: 'SCHEDULED', appointmentType: 'CONSULTATION', chiefComplaint: 'Joint pain', tokenNumber: 'T007' },
    { id: 8, appointmentNumber: 'APT008', patientName: 'Kavita Joshi', patientMobile: '9876543217', appointmentDate: dateFilter, slotStartTime: '14:30', slotEndTime: '15:00', status: 'SCHEDULED', appointmentType: 'CONSULTATION', chiefComplaint: 'Skin rash', tokenNumber: 'T008' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-700'
      case 'CHECKED_IN':
      case 'IN_QUEUE':
        return 'bg-yellow-100 text-yellow-700'
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-700'
      case 'COMPLETED':
        return 'bg-green-100 text-green-700'
      case 'CANCELLED_BY_PATIENT':
      case 'CANCELLED_BY_HOSPITAL':
        return 'bg-red-100 text-red-700'
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatStatus = (status) => {
    if (!status) return 'Scheduled'
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatTime = (time) => {
    if (!time) return '-'
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${minutes} ${ampm}`
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage)
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      apt.patientName?.toLowerCase().includes(query) ||
      apt.appointmentNumber?.toLowerCase().includes(query) ||
      apt.patientMobile?.includes(query)
    )
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 mt-1">Manage your appointment schedule</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <ExclamationCircleIcon className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-700">{error}</span>
        </div>
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'All', count: appointments.length, color: 'bg-gray-100 text-gray-700', filter: '' },
          { label: 'Scheduled', count: appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length, color: 'bg-blue-100 text-blue-700', filter: 'SCHEDULED' },
          { label: 'In Progress', count: appointments.filter(a => a.status === 'IN_PROGRESS' || a.status === 'CHECKED_IN').length, color: 'bg-yellow-100 text-yellow-700', filter: 'IN_PROGRESS' },
          { label: 'Completed', count: appointments.filter(a => a.status === 'COMPLETED').length, color: 'bg-green-100 text-green-700', filter: 'COMPLETED' },
          { label: 'Cancelled', count: appointments.filter(a => a.status?.includes('CANCELLED')).length, color: 'bg-red-100 text-red-700', filter: 'CANCELLED_BY_PATIENT' },
        ].map((stat, idx) => (
          <button
            key={idx}
            onClick={() => { setStatusFilter(stat.filter); setCurrentPage(0); }}
            className={`bg-white rounded-lg border p-4 text-center hover:shadow-md transition-shadow ${statusFilter === stat.filter ? 'ring-2 ring-primary-500' : ''}`}
          >
            <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
            <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${stat.color}`}>
              {stat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, phone, or appointment ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              <option value="CHECKED_IN">Checked In</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED_BY_PATIENT">Cancelled</option>
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
        ) : filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <CalendarDaysIcon className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No appointments found</p>
            <p className="text-sm">Try adjusting your filters or select a different date</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chief Complaint</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-sm font-medium bg-primary-100 text-primary-700 rounded">
                          {apt.tokenNumber || apt.appointmentNumber || `#${apt.id}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {(apt.patientName?.[0] || 'P').toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{apt.patientName || 'Patient'}</div>
                            <div className="text-sm text-gray-500">{apt.patientMobile || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {formatTime(apt.slotStartTime)} - {formatTime(apt.slotEndTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                          {(apt.appointmentType || 'Consultation').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 truncate max-w-xs" title={apt.chiefComplaint}>
                          {apt.chiefComplaint || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(apt.status)}`}>
                          {formatStatus(apt.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_QUEUE', 'IN_PROGRESS'].includes(apt.status) && (
                            <Link
                              to={`/doctor/consultation/${apt.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                            >
                              <PlayIcon className="h-4 w-4" />
                              {apt.status === 'IN_PROGRESS' ? 'Continue' : 'Start'}
                            </Link>
                          )}
                          {apt.status === 'COMPLETED' && (
                            <Link
                              to={`/doctor/consultation/${apt.id}`}
                              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              View
                            </Link>
                          )}
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

export default DoctorAppointments
