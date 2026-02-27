import { useState, useEffect } from 'react'
import api from '../../services/api'
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [specializations, setSpecializations] = useState([])
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const pageSize = 10

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobileNumber: '',
    primarySpecialization: '', qualifications: '', experienceYears: '',
    opdConsultationFee: '', registrationNumber: '', bio: ''
  })
  const [formErrors, setFormErrors] = useState({})

  const SPECIALIZATIONS = [
    { value: 'GENERAL_MEDICINE', label: 'General Medicine' },
    { value: 'CARDIOLOGY', label: 'Cardiology' },
    { value: 'ORTHOPEDICS', label: 'Orthopedics' },
    { value: 'PEDIATRICS', label: 'Pediatrics' },
    { value: 'GYNECOLOGY', label: 'Gynecology' },
    { value: 'DERMATOLOGY', label: 'Dermatology' },
    { value: 'NEUROLOGY', label: 'Neurology' },
    { value: 'OPHTHALMOLOGY', label: 'Ophthalmology' },
    { value: 'ENT', label: 'ENT' },
    { value: 'PSYCHIATRY', label: 'Psychiatry' },
    { value: 'GASTROENTEROLOGY', label: 'Gastroenterology' },
    { value: 'PULMONOLOGY', label: 'Pulmonology' },
    { value: 'UROLOGY', label: 'Urology' },
    { value: 'NEPHROLOGY', label: 'Nephrology' },
    { value: 'ONCOLOGY', label: 'Oncology' },
  ]

  useEffect(() => {
    fetchDoctors()
    fetchSpecializations()
  }, [currentPage])

  const fetchSpecializations = async () => {
    try {
      const response = await api.get('/api/v1/doctors/specializations')
      setSpecializations(response.data || SPECIALIZATIONS)
    } catch (err) {
      setSpecializations(SPECIALIZATIONS)
    }
  }

  const fetchDoctors = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = { page: currentPage, size: pageSize }
      if (searchQuery) params.query = searchQuery
      if (selectedSpecialization) params.specialization = selectedSpecialization
      
      const response = await api.get('/api/v1/doctors', { params })
      const data = response.data
      
      if (data?.content) {
        setDoctors(data.content)
        setTotalPages(data.totalPages || 1)
        setTotalElements(data.totalElements || data.content.length)
      } else if (Array.isArray(data)) {
        setDoctors(data)
        setTotalPages(1)
        setTotalElements(data.length)
      } else {
        throw new Error('Unable to load doctor data')
      }
    } catch (err) {
      console.error('Error fetching doctors:', err)
      const errorMessage = err.response?.status === 403 
        ? 'Access denied. Please check your permissions.'
        : err.response?.status === 401
        ? 'Session expired. Please login again.'
        : 'Failed to load doctors. Please check your connection.';
      setError(errorMessage)
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.mobileNumber.trim()) errors.mobileNumber = 'Mobile number is required'
    else if (!/^\d{10}$/.test(formData.mobileNumber)) errors.mobileNumber = 'Invalid mobile number'
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email address'
    if (!formData.primarySpecialization) errors.primarySpecialization = 'Specialization is required'
    if (!formData.opdConsultationFee) errors.opdConsultationFee = 'Consultation fee is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddDoctor = async () => {
    if (!validateForm()) return
    
    setActionLoading(true)
    try {
      await api.post('/api/v1/doctors', {
        ...formData,
        experienceYears: parseInt(formData.experienceYears) || 0,
        opdConsultationFee: parseFloat(formData.opdConsultationFee) || 0
      })
      setActionSuccess('Doctor added successfully!')
      setTimeout(() => {
        setShowAddModal(false)
        setActionSuccess(null)
        resetForm()
        fetchDoctors()
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add doctor')
      setActionLoading(false)
    }
  }

  const handleEditDoctor = async () => {
    if (!validateForm()) return
    
    setActionLoading(true)
    try {
      await api.put(`/api/v1/doctors/${selectedDoctor.id}`, {
        ...formData,
        experienceYears: parseInt(formData.experienceYears) || 0,
        opdConsultationFee: parseFloat(formData.opdConsultationFee) || 0
      })
      setActionSuccess('Doctor updated successfully!')
      setTimeout(() => {
        setShowEditModal(false)
        setActionSuccess(null)
        resetForm()
        fetchDoctors()
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update doctor')
      setActionLoading(false)
    }
  }

  const handleDeleteDoctor = async () => {
    setActionLoading(true)
    try {
      await api.delete(`/api/v1/doctors/${selectedDoctor.id}`)
      setActionSuccess('Doctor deleted successfully!')
      setTimeout(() => {
        setShowDeleteModal(false)
        setActionSuccess(null)
        setSelectedDoctor(null)
        fetchDoctors()
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete doctor')
      setActionLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', email: '', mobileNumber: '',
      primarySpecialization: '', qualifications: '', experienceYears: '',
      opdConsultationFee: '', registrationNumber: '', bio: ''
    })
    setFormErrors({})
    setActionLoading(false)
  }

  const openViewModal = (doctor) => {
    setSelectedDoctor(doctor)
    setShowViewModal(true)
  }

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor)
    setFormData({
      firstName: doctor.firstName || '',
      lastName: doctor.lastName || '',
      email: doctor.email || '',
      mobileNumber: doctor.mobileNumber || '',
      primarySpecialization: doctor.primarySpecialization || '',
      qualifications: doctor.qualifications || '',
      experienceYears: doctor.experienceYears?.toString() || '',
      opdConsultationFee: doctor.opdConsultationFee?.toString() || '',
      registrationNumber: doctor.registrationNumber || '',
      bio: doctor.bio || ''
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (doctor) => {
    setSelectedDoctor(doctor)
    setShowDeleteModal(true)
  }

  const formatSpecialization = (spec) => {
    if (!spec) return '-'
    const found = SPECIALIZATIONS.find(s => s.value === spec)
    return found?.label || spec.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const handleSearch = () => {
    setCurrentPage(0)
    fetchDoctors()
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage)
    }
  }

  // Filter doctors locally
  const filteredDoctors = doctors.filter(doctor => {
    let matches = true
    if (statusFilter) {
      matches = statusFilter === 'active' ? doctor.isActive !== false : doctor.isActive === false
    }
    return matches
  })

  const DoctorForm = ({ onSubmit, submitText }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
          <input
            type="tel"
            value={formData.mobileNumber}
            onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${formErrors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="10 digit mobile number"
          />
          {formErrors.mobileNumber && <p className="text-red-500 text-xs mt-1">{formErrors.mobileNumber}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
          <select
            value={formData.primarySpecialization}
            onChange={(e) => setFormData({...formData, primarySpecialization: e.target.value})}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${formErrors.primarySpecialization ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Specialization</option>
            {SPECIALIZATIONS.map(spec => (
              <option key={spec.value} value={spec.value}>{spec.label}</option>
            ))}
          </select>
          {formErrors.primarySpecialization && <p className="text-red-500 text-xs mt-1">{formErrors.primarySpecialization}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
          <input
            type="text"
            value={formData.qualifications}
            onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., MBBS, MD"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
          <input
            type="number"
            value={formData.experienceYears}
            onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee *</label>
          <input
            type="number"
            value={formData.opdConsultationFee}
            onChange={(e) => setFormData({...formData, opdConsultationFee: e.target.value})}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${formErrors.opdConsultationFee ? 'border-red-500' : 'border-gray-300'}`}
            min="0"
            placeholder="₹"
          />
          {formErrors.opdConsultationFee && <p className="text-red-500 text-xs mt-1">{formErrors.opdConsultationFee}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registration No.</label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          rows={3}
          placeholder="Brief description about the doctor"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => { resetForm(); setShowAddModal(false); setShowEditModal(false); }}
          disabled={actionLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={actionLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {actionLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : submitText}
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-gray-500 mt-1">Manage all registered doctors</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Doctor
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
          <button onClick={() => { setError(null); fetchDoctors(); }} className="text-red-700 hover:text-red-900 font-medium">
            Retry
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name, ID, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedSpecialization}
              onChange={(e) => { setSelectedSpecialization(e.target.value); setCurrentPage(0); }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Specializations</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec.value} value={spec.value}>{spec.label}</option>
              ))}
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button onClick={handleSearch} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-500">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <UserIcon className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No doctors found</p>
            <p className="text-sm mb-4">{error ? 'Please check your connection and try again' : 'Try adjusting your search criteria'}</p>
            {!error && (
              <button onClick={() => { resetForm(); setShowAddModal(true); }} className="text-primary-600 hover:text-primary-700 font-medium">
                Add your first doctor
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-primary-600">{doctor.employeeId || `D${doctor.id}`}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-600 font-medium">
                                {(doctor.firstName?.[0] || 'D').toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {doctor.displayName || `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim() || 'Doctor'}
                            </div>
                            <div className="text-sm text-gray-500">{doctor.email || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                          {formatSpecialization(doctor.primarySpecialization)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doctor.qualifications || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doctor.experienceYears ? `${doctor.experienceYears} years` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {doctor.opdConsultationFee ? `₹${doctor.opdConsultationFee}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          doctor.isActive !== false 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {doctor.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openViewModal(doctor)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" 
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => openEditModal(doctor)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(doctor)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
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
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} doctors
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

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add New Doctor</h2>
              <button onClick={() => { resetForm(); setShowAddModal(false); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {actionSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-green-600 font-medium">{actionSuccess}</p>
                </div>
              ) : (
                <DoctorForm onSubmit={handleAddDoctor} submitText="Add Doctor" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Doctor Modal */}
      {showViewModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Doctor Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xl">
                    {(selectedDoctor.firstName?.[0] || 'D').toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{selectedDoctor.displayName || `${selectedDoctor.firstName} ${selectedDoctor.lastName}`}</h3>
                  <p className="text-gray-500">{selectedDoctor.employeeId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Specialization</p>
                  <p className="font-medium">{formatSpecialization(selectedDoctor.primarySpecialization)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Qualification</p>
                  <p className="font-medium">{selectedDoctor.qualifications || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Experience</p>
                  <p className="font-medium">{selectedDoctor.experienceYears ? `${selectedDoctor.experienceYears} years` : '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Consultation Fee</p>
                  <p className="font-medium">{selectedDoctor.opdConsultationFee ? `₹${selectedDoctor.opdConsultationFee}` : '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Mobile</p>
                  <p className="font-medium">{selectedDoctor.mobileNumber || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{selectedDoctor.email || '-'}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setShowViewModal(false); openEditModal(selectedDoctor); }} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Edit Doctor
                </button>
                <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {showEditModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit Doctor</h2>
              <button onClick={() => { resetForm(); setShowEditModal(false); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {actionSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-green-600 font-medium">{actionSuccess}</p>
                </div>
              ) : (
                <DoctorForm onSubmit={handleEditDoctor} submitText="Update Doctor" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {actionSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-green-600 font-medium">{actionSuccess}</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Delete Doctor</h3>
                  <p className="text-gray-600">
                    Are you sure you want to delete <strong>{selectedDoctor.displayName || `${selectedDoctor.firstName} ${selectedDoctor.lastName}`}</strong>? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowDeleteModal(false); setSelectedDoctor(null); }}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteDoctor}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Deleting...
                      </>
                    ) : 'Delete Doctor'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorManagement
