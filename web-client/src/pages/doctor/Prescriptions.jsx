import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  EyeIcon,
  PrinterIcon,
  PlusIcon,
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  CalendarDaysIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const DoctorPrescriptions = () => {
  const { user } = useAuthStore()
  const [searchParams] = useSearchParams()
  const patientIdFilter = searchParams.get('patientId')
  
  const [prescriptions, setPrescriptions] = useState([])
  const [allPrescriptions, setAllPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // Modals
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState(null)
  
  // Edit form
  const [editForm, setEditForm] = useState({
    diagnosis: '',
    advice: '',
    followUpDate: '',
    followUpNotes: '',
    status: ''
  })
  
  const pageSize = 10

  useEffect(() => {
    fetchPrescriptions()
  }, [currentPage, user, patientIdFilter])

  const applyFilters = useCallback(() => {
    let filtered = [...allPrescriptions]
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(rx =>
        rx.patientName?.toLowerCase().includes(query) ||
        rx.prescriptionNumber?.toLowerCase().includes(query) ||
        rx.diagnosis?.toLowerCase().includes(query)
      )
    }
    
    if (dateFilter) {
      filtered = filtered.filter(rx => rx.prescriptionDate === dateFilter)
    }
    
    if (statusFilter) {
      filtered = filtered.filter(rx => rx.status === statusFilter)
    }
    
    setPrescriptions(filtered)
    setTotalElements(filtered.length)
    setTotalPages(Math.ceil(filtered.length / pageSize) || 1)
  }, [allPrescriptions, searchQuery, dateFilter, statusFilter])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const fetchPrescriptions = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const doctorId = user?.doctorId || user?.id
      
      if (!doctorId) {
        setError('Unable to identify doctor. Please login again.')
        setLoading(false)
        return
      }
      
      const params = { 
        doctorId,
        page: 0, 
        size: 100 
      }
      
      // If filtering by patient
      if (patientIdFilter) {
        params.patientId = patientIdFilter
      }
      
      const response = await api.get('/api/v1/prescriptions', { params })
      
      const data = response.data
      let prescriptionList = []
      
      if (data?.content) {
        prescriptionList = data.content
      } else if (Array.isArray(data)) {
        prescriptionList = data
      } else {
        throw new Error('Invalid prescription data format')
      }
      
      setAllPrescriptions(prescriptionList)
      setPrescriptions(prescriptionList)
      setTotalPages(Math.ceil(prescriptionList.length / pageSize) || 1)
      setTotalElements(prescriptionList.length)
      
    } catch (err) {
      console.error('Error fetching prescriptions:', err)
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.')
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view prescriptions.')
      } else {
        setError(`Failed to load prescriptions: ${err.message || 'Server error'}`)
      }
      
      setAllPrescriptions([])
      setPrescriptions([])
      setTotalPages(0)
      setTotalElements(0)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-blue-100 text-blue-700'
      case 'DISPENSED': return 'bg-green-100 text-green-700'
      case 'COMPLETED': return 'bg-gray-100 text-gray-700'
      case 'CANCELLED': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleView = (prescription) => {
    setSelectedPrescription(prescription)
    setShowViewModal(true)
  }

  const handleEdit = (prescription) => {
    setSelectedPrescription(prescription)
    setEditForm({
      diagnosis: prescription.diagnosis || '',
      advice: prescription.advice || '',
      followUpDate: prescription.followUpDate || '',
      followUpNotes: prescription.followUpNotes || '',
      status: prescription.status || 'ACTIVE'
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    setActionLoading(true)
    
    try {
      await api.put(`/api/v1/prescriptions/${selectedPrescription.id}`, editForm)
      
      setActionSuccess('Prescription updated successfully!')
      
      // Update local state
      setAllPrescriptions(prev => prev.map(rx => 
        rx.id === selectedPrescription.id 
          ? { ...rx, ...editForm }
          : rx
      ))
      
      setTimeout(() => {
        setShowEditModal(false)
        setActionSuccess(null)
        setSelectedPrescription(null)
      }, 1500)
      
    } catch (err) {
      console.error('Error updating prescription:', err)
      setError(err.response?.data?.message || 'Failed to update prescription')
      setActionLoading(false)
    }
  }

  const handlePrint = (prescription) => {
    setSelectedPrescription(prescription)
    setShowPrintModal(true)
  }

  const executePrint = () => {
    setActionLoading(true)
    setTimeout(() => {
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <html>
          <head>
            <title>Prescription - ${selectedPrescription.prescriptionNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              .header h1 { color: #2563eb; margin: 0; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
              .info-item { padding: 8px; background: #f3f4f6; border-radius: 4px; }
              .info-label { font-size: 12px; color: #666; }
              .info-value { font-weight: bold; }
              .diagnosis { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .advice { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .footer { margin-top: 40px; text-align: right; }
              .signature { border-top: 1px solid #333; width: 200px; margin-left: auto; padding-top: 10px; }
              @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>City General Hospital</h1>
              <p>123 Medical Street, Healthcare City</p>
              <p>Phone: +91 9876543210</p>
            </div>
            <h2>PRESCRIPTION</h2>
            <div class="info-grid">
              <div class="info-item"><div class="info-label">Rx Number</div><div class="info-value">${selectedPrescription.prescriptionNumber || '-'}</div></div>
              <div class="info-item"><div class="info-label">Date</div><div class="info-value">${selectedPrescription.prescriptionDate || '-'}</div></div>
              <div class="info-item"><div class="info-label">Patient Name</div><div class="info-value">${selectedPrescription.patientName || '-'}</div></div>
              <div class="info-item"><div class="info-label">Status</div><div class="info-value">${selectedPrescription.status || '-'}</div></div>
            </div>
            <div class="diagnosis">
              <strong>Diagnosis:</strong> ${selectedPrescription.diagnosis || 'Not specified'}
            </div>
            <div class="advice">
              <strong>Advice:</strong> ${selectedPrescription.advice || 'No specific advice'}
            </div>
            ${selectedPrescription.followUpDate ? `<p><strong>Follow-up Date:</strong> ${selectedPrescription.followUpDate}</p>` : ''}
            <div class="footer">
              <div class="signature">
                <p>${user?.displayName || 'Doctor'}</p>
                <p style="font-size: 12px; color: #666;">Authorized Signature</p>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
      setActionLoading(false)
      setShowPrintModal(false)
    }, 500)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setDateFilter('')
    setStatusFilter('')
  }

  const hasActiveFilters = searchQuery || dateFilter || statusFilter

  const paginatedPrescriptions = prescriptions.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-500 mt-1">
            {patientIdFilter ? 'Prescriptions for selected patient' : 'View and manage your prescriptions'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchPrescriptions}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <PlusIcon className="h-5 w-5" />
            New Prescription
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
          <button onClick={fetchPrescriptions} className="text-red-700 hover:text-red-900 font-medium">
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-gray-900">{allPrescriptions.length}</p>
          <p className="text-sm text-gray-500">Total Prescriptions</p>
        </div>
        <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('ACTIVE')}>
          <p className="text-2xl font-bold text-blue-600">
            {allPrescriptions.filter(rx => rx.status === 'ACTIVE').length}
          </p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('DISPENSED')}>
          <p className="text-2xl font-bold text-green-600">
            {allPrescriptions.filter(rx => rx.status === 'DISPENSED').length}
          </p>
          <p className="text-sm text-gray-500">Dispensed</p>
        </div>
        <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('COMPLETED')}>
          <p className="text-2xl font-bold text-gray-600">
            {allPrescriptions.filter(rx => rx.status === 'COMPLETED').length}
          </p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, prescription ID, or diagnosis..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(0); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
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
              <option value="ACTIVE">Active</option>
              <option value="DISPENSED">Dispensed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-500">Loading prescriptions...</p>
          </div>
        ) : paginatedPrescriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <DocumentTextIcon className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No prescriptions found</p>
            <p className="text-sm mb-4">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Create a new prescription to get started'}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-primary-600 hover:text-primary-700 font-medium">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rx Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPrescriptions.map((rx) => (
                    <tr key={rx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-primary-600">{rx.prescriptionNumber || `RX-${rx.id}`}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {(rx.patientName?.[0] || 'P').toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{rx.patientName || 'Patient'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarDaysIcon className="h-4 w-4 mr-1" />
                          {rx.prescriptionDate || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 truncate max-w-xs" title={rx.diagnosis}>
                          {rx.diagnosis || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rx.status)}`}>
                          {rx.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleView(rx)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" 
                            title="View Details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleEdit(rx)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Edit Prescription"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handlePrint(rx)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                            title="Print Prescription"
                          >
                            <PrinterIcon className="h-5 w-5" />
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
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} prescriptions
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

      {/* View Modal */}
      {showViewModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Prescription Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Rx Number</p>
                  <p className="font-medium">{selectedPrescription.prescriptionNumber}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{selectedPrescription.prescriptionDate}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Patient Name</p>
                  <p className="font-medium">{selectedPrescription.patientName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPrescription.status)}`}>
                    {selectedPrescription.status}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <p className="text-xs text-gray-500">Diagnosis</p>
                  <p className="font-medium">{selectedPrescription.diagnosis || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <p className="text-xs text-gray-500">Advice</p>
                  <p className="font-medium">{selectedPrescription.advice || '-'}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowViewModal(false); handleEdit(selectedPrescription); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PencilIcon className="h-5 w-5" />
                  Edit
                </button>
                <button
                  onClick={() => { setShowViewModal(false); handlePrint(selectedPrescription); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <PrinterIcon className="h-5 w-5" />
                  Print
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit Prescription</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
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
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm"><strong>Rx:</strong> {selectedPrescription.prescriptionNumber}</p>
                    <p className="text-sm"><strong>Patient:</strong> {selectedPrescription.patientName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                    <textarea
                      value={editForm.diagnosis}
                      onChange={(e) => setEditForm({...editForm, diagnosis: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Advice</label>
                    <textarea
                      value={editForm.advice}
                      onChange={(e) => setEditForm({...editForm, advice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                      <input
                        type="date"
                        value={editForm.followUpDate}
                        onChange={(e) => setEditForm({...editForm, followUpDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="DISPENSED">Dispensed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Notes</label>
                    <textarea
                      value={editForm.followUpNotes}
                      onChange={(e) => setEditForm({...editForm, followUpNotes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowEditModal(false)}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Print Confirmation Modal */}
      {showPrintModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PrinterIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Print Prescription</h3>
              <p className="text-gray-600">
                Print prescription <strong>{selectedPrescription.prescriptionNumber}</strong> for <strong>{selectedPrescription.patientName}</strong>?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPrintModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={executePrint}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Printing...
                  </>
                ) : (
                  <>
                    <PrinterIcon className="h-5 w-5" />
                    Print
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorPrescriptions
