import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  EyeIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  PhoneIcon,
  CalendarDaysIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const DoctorPatients = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchDoctorPatients()
  }, [currentPage, user])

  const fetchDoctorPatients = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Get doctor ID from user context
      const doctorId = user?.doctorId || user?.id
      
      if (!doctorId) {
        setError('Unable to identify doctor. Please login again.')
        setLoading(false)
        return
      }
      
      // Fetch patients linked to this doctor via appointments
      const response = await api.get(`/api/v1/appointments/doctor/${doctorId}/patients`, {
        params: { page: currentPage, size: pageSize }
      })
      
      const data = response.data
      
      if (data?.content) {
        setPatients(data.content)
        setTotalPages(data.totalPages || 1)
        setTotalElements(data.totalElements || data.content.length)
      } else if (Array.isArray(data)) {
        setPatients(data)
        setTotalPages(1)
        setTotalElements(data.length)
      } else {
        throw new Error('Invalid data format')
      }
    } catch (err) {
      console.error('Error fetching patients:', err)
      
      // Check specific error types
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.')
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view patients. Please contact admin.')
      } else if (err.response?.status === 404) {
        setError('Patient data not available. No appointments found.')
      } else {
        setError(`Failed to load patients: ${err.message || 'Server error'}`)
      }
      
      setPatients([])
      setTotalPages(0)
      setTotalElements(0)
    } finally {
      setLoading(false)
    }
  }

  const formatBloodGroup = (bg) => {
    if (!bg) return '-'
    return bg.replace('_POSITIVE', '+').replace('_NEGATIVE', '-')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(0)
    fetchDoctorPatients()
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleViewPrescriptions = (patientId) => {
    navigate(`/doctor/prescriptions?patientId=${patientId}`)
  }

  // Local filtering for search
  const filteredPatients = patients.filter(patient => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      patient.patientName?.toLowerCase().includes(query) ||
      patient.uhid?.toLowerCase().includes(query) ||
      patient.patientMobile?.includes(query)
    )
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-500 mt-1">Patients from your appointments</p>
        </div>
        <button
          onClick={fetchDoctorPatients}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
          <button 
            onClick={fetchDoctorPatients} 
            className="text-red-700 hover:text-red-900 font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, UHID, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-500">Loading your patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <UserGroupIcon className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No patients found</p>
            <p className="text-sm text-center max-w-md mt-2">
              {error 
                ? 'Please check your connection and try again.' 
                : 'Patients will appear here once they have appointments with you.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Visits</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient, idx) => (
                    <tr key={patient.id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-primary-600">
                          {patient.uhid || `P${patient.id || idx + 1}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {(patient.patientName?.[0] || 'P').toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.patientName || 'Unknown Patient'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.gender || ''} {patient.age ? `• ${patient.age}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {patient.patientMobile || patient.mobileNumber || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarDaysIcon className="h-4 w-4 mr-1" />
                          {patient.lastVisit || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                          {patient.totalVisits || 1} visits
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" 
                            title="View Profile"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleViewPrescriptions(patient.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="View Prescriptions"
                          >
                            <DocumentTextIcon className="h-5 w-5" />
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
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} patients
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
                  Page {currentPage + 1} of {totalPages || 1}
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

export default DoctorPatients
