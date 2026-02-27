import { useState, useEffect } from 'react'
import api from '../../services/api'
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon,
  EyeIcon,
  PrinterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  CurrencyRupeeIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const BillingManagement = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [activeTab, setActiveTab] = useState('invoices')
  const pageSize = 10

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState(null)
  
  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMode: 'CASH',
    transactionId: '',
    notes: ''
  })

  // Create Invoice Form
  const [invoiceForm, setInvoiceForm] = useState({
    patientId: '',
    patientSearch: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    taxPercentage: 0,
    discountPercentage: 0,
    notes: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)

  // Summary stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    paidAmount: 0,
    totalInvoices: 0
  })

  useEffect(() => {
    fetchInvoices()
  }, [currentPage, statusFilter])

  const fetchInvoices = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = { page: currentPage, size: pageSize }
      if (statusFilter) params.status = statusFilter
      if (searchQuery) params.query = searchQuery
      
      const response = await api.get('/api/v1/invoices', { params })
      const data = response.data?.data || response.data
      
      if (data?.content) {
        // Normalize invoice data to handle different field names
        const normalizedInvoices = data.content.map(normalizeInvoice)
        setInvoices(normalizedInvoices)
        setTotalPages(data.totalPages || 1)
        setTotalElements(data.totalElements || data.content.length)
        calculateStats(normalizedInvoices)
      } else if (Array.isArray(data)) {
        const normalizedInvoices = data.map(normalizeInvoice)
        setInvoices(normalizedInvoices)
        setTotalPages(1)
        setTotalElements(data.length)
        calculateStats(normalizedInvoices)
      } else {
        throw new Error('Unable to load billing data')
      }
    } catch (err) {
      console.error('Error fetching invoices:', err)
      const errorMessage = err.response?.status === 403 
        ? 'Access denied. Please check your permissions.'
        : 'Failed to load billing data. Please check your connection.';
      setError(errorMessage)
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  const searchPatients = async (query) => {
    if (query.length < 2) return
    try {
      const response = await api.get(`/api/v1/patients?query=${query}&size=10`)
      const data = response.data?.data || response.data
      setPatients(data?.content || data || [])
    } catch (err) {
      console.error('Error searching patients:', err)
    }
  }

  // Helper to normalize invoice data (handle different field names from backend)
  const normalizeInvoice = (inv) => ({
    ...inv,
    totalAmount: inv.totalAmount || inv.grandTotal || inv.amount || 0,
    paidAmount: inv.paidAmount || inv.amountPaid || 0,
    status: inv.status || inv.paymentStatus || 'PENDING'
  })

  const calculateStats = (invoiceData) => {
    const normalizedData = invoiceData.map(normalizeInvoice)
    const total = normalizedData.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
    const paid = normalizedData.filter(inv => inv.status === 'PAID' || inv.status === 'SUCCESS').reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
    const pending = normalizedData.filter(inv => inv.status === 'PENDING' || inv.status === 'PARTIALLY_PAID').reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
    
    setStats({
      totalRevenue: total,
      paidAmount: paid,
      pendingAmount: pending,
      totalInvoices: normalizedData.length
    })
  }

  const validateInvoiceForm = () => {
    const errors = {}
    if (!selectedPatient) errors.patient = 'Please select a patient'
    if (invoiceForm.items.length === 0) errors.items = 'Add at least one item'
    if (invoiceForm.items.some(item => !item.description.trim())) errors.items = 'All items must have a description'
    if (invoiceForm.items.some(item => item.unitPrice <= 0)) errors.items = 'All items must have a valid price'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const calculateInvoiceTotal = () => {
    const subtotal = invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const taxAmount = (subtotal * invoiceForm.taxPercentage) / 100
    const discountAmount = (subtotal * invoiceForm.discountPercentage) / 100
    return {
      subtotal,
      taxAmount,
      discountAmount,
      total: subtotal + taxAmount - discountAmount
    }
  }

  const handleCreateInvoice = async () => {
    if (!validateInvoiceForm()) return
    
    setActionLoading(true)
    try {
      const totals = calculateInvoiceTotal()
      const invoiceData = {
        patientId: selectedPatient.id,
        items: invoiceForm.items,
        subtotal: totals.subtotal,
        taxPercentage: invoiceForm.taxPercentage,
        taxAmount: totals.taxAmount,
        discountPercentage: invoiceForm.discountPercentage,
        discountAmount: totals.discountAmount,
        totalAmount: totals.total,
        notes: invoiceForm.notes
      }
      
      await api.post('/api/v1/invoices', invoiceData)
      setActionSuccess('Invoice created successfully!')
      setTimeout(() => {
        setShowCreateModal(false)
        setActionSuccess(null)
        resetInvoiceForm()
        fetchInvoices()
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create invoice')
      setActionLoading(false)
    }
  }

  const resetInvoiceForm = () => {
    setInvoiceForm({
      patientId: '',
      patientSearch: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      taxPercentage: 0,
      discountPercentage: 0,
      notes: ''
    })
    setFormErrors({})
    setSelectedPatient(null)
    setPatients([])
    setActionLoading(false)
  }

  const addInvoiceItem = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [...invoiceForm.items, { description: '', quantity: 1, unitPrice: 0 }]
    })
  }

  const removeInvoiceItem = (index) => {
    if (invoiceForm.items.length <= 1) return
    setInvoiceForm({
      ...invoiceForm,
      items: invoiceForm.items.filter((_, i) => i !== index)
    })
  }

  const updateInvoiceItem = (index, field, value) => {
    const newItems = [...invoiceForm.items]
    newItems[index][field] = field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value
    setInvoiceForm({ ...invoiceForm, items: newItems })
  }

  // Open payment modal for an invoice
  const openPaymentModal = (invoice) => {
    setSelectedInvoice(invoice)
    const pendingAmount = (invoice.totalAmount || 0) - (invoice.paidAmount || 0)
    setPaymentForm({
      amount: pendingAmount,
      paymentMode: 'CASH',
      transactionId: '',
      notes: ''
    })
    setShowPaymentModal(true)
    setActionSuccess(null)
    setError(null)
  }

  // Handle recording a payment
  const handleRecordPayment = async () => {
    if (!selectedInvoice) return
    
    const pendingAmount = (selectedInvoice.totalAmount || 0) - (selectedInvoice.paidAmount || 0)
    
    // Validate payment amount
    if (paymentForm.amount <= 0) {
      setError('Payment amount must be greater than 0')
      return
    }
    if (paymentForm.amount > pendingAmount) {
      setError(`Payment amount cannot exceed pending amount (₹${pendingAmount.toLocaleString()})`)
      return
    }
    
    setActionLoading(true)
    setError(null)
    
    try {
      // Try to call the payment API
      const paymentData = {
        invoiceId: selectedInvoice.id,
        amount: paymentForm.amount,
        paymentMode: paymentForm.paymentMode,
        transactionId: paymentForm.transactionId || null,
        notes: paymentForm.notes || null
      }
      
      console.log('[Billing] Recording payment:', paymentData)
      
      // Try different API endpoints
      try {
        await api.post(`/api/v1/invoices/${selectedInvoice.id}/payments`, paymentData)
      } catch (e1) {
        console.log('First payment endpoint failed, trying alternative...')
        try {
          await api.post(`/api/v1/payments`, paymentData)
        } catch (e2) {
          console.log('Second payment endpoint failed, trying PATCH...')
          // Try updating the invoice directly
          const newPaidAmount = (selectedInvoice.paidAmount || 0) + paymentForm.amount
          const newStatus = newPaidAmount >= selectedInvoice.totalAmount ? 'PAID' : 'PARTIALLY_PAID'
          await api.patch(`/api/v1/invoices/${selectedInvoice.id}`, {
            paidAmount: newPaidAmount,
            status: newStatus,
            paymentMode: paymentForm.paymentMode
          })
        }
      }
      
      setActionSuccess('Payment recorded successfully!')
      console.log('[Billing] Payment recorded successfully')
      
      // Close modal and refresh data after a short delay
      setTimeout(() => {
        setShowPaymentModal(false)
        setSelectedInvoice(null)
        setActionSuccess(null)
        setActionLoading(false)
        // IMPORTANT: Refresh the invoice list to show updated data
        fetchInvoices()
      }, 1500)
      
    } catch (err) {
      console.error('[Billing] Payment recording failed:', err)
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to record payment. Please try again.')
      setActionLoading(false)
    }
  }

  const handleExport = async (format) => {
    setActionLoading(true)
    try {
      // For demo, generate CSV locally
      if (format === 'csv') {
        const csvData = invoices.map(inv => ({
          'Invoice #': inv.invoiceNumber,
          'Patient': inv.patientName,
          'UHID': inv.patientUhid,
          'Date': inv.invoiceDate,
          'Amount': inv.totalAmount,
          'Paid': inv.paidAmount,
          'Status': inv.status
        }))
        
        const headers = Object.keys(csvData[0])
        const csvContent = [
          headers.join(','),
          ...csvData.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
        ].join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
      } else if (format === 'pdf') {
        // Generate PDF using browser print
        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice Report</title>
              <style>
                body { font-family: Arial; padding: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background: #f5f5f5; }
                .header { margin-bottom: 20px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Invoice Report</h1>
                <p>Generated: ${new Date().toLocaleDateString()}</p>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoices.map(inv => `
                    <tr>
                      <td>${inv.invoiceNumber || '-'}</td>
                      <td>${inv.patientName || '-'}</td>
                      <td>${inv.invoiceDate || '-'}</td>
                      <td>₹${(inv.totalAmount || 0).toLocaleString()}</td>
                      <td>${inv.status || '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
      
      setActionSuccess(`Exported as ${format.toUpperCase()} successfully!`)
      setTimeout(() => {
        setShowExportModal(false)
        setActionSuccess(null)
        setActionLoading(false)
      }, 1500)
    } catch (err) {
      setError('Failed to export data')
      setActionLoading(false)
    }
  }

  const handlePrintInvoice = (invoice) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial; padding: 20px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #2563eb; margin: 0; }
            .info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .info-block { flex: 1; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f5f5f5; }
            .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
            .status { padding: 4px 12px; border-radius: 4px; display: inline-block; }
            .status-paid { background: #dcfce7; color: #166534; }
            .status-pending { background: #fef3c7; color: #92400e; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>City General Hospital</h1>
            <p>123 Medical Street, Healthcare City</p>
            <p>Phone: +91 9876543210 | Email: billing@hospital.com</p>
          </div>
          <h2>INVOICE</h2>
          <div class="info">
            <div class="info-block">
              <p><strong>Invoice #:</strong> ${invoice.invoiceNumber || '-'}</p>
              <p><strong>Date:</strong> ${invoice.invoiceDate || '-'}</p>
              <p><strong>Status:</strong> <span class="status ${invoice.status === 'PAID' ? 'status-paid' : 'status-pending'}">${invoice.status}</span></p>
            </div>
            <div class="info-block" style="text-align: right;">
              <p><strong>Patient:</strong> ${invoice.patientName || '-'}</p>
              <p><strong>UHID:</strong> ${invoice.patientUhid || '-'}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Consultation & Services</td>
                <td>1</td>
                <td>₹${(invoice.totalAmount || 0).toLocaleString()}</td>
                <td>₹${(invoice.totalAmount || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            <p>Total Amount: ₹${(invoice.totalAmount || 0).toLocaleString()}</p>
            <p>Amount Paid: ₹${(invoice.paidAmount || 0).toLocaleString()}</p>
            <p>Balance Due: ₹${((invoice.totalAmount || 0) - (invoice.paidAmount || 0)).toLocaleString()}</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': case 'SUCCESS': return 'bg-green-100 text-green-700'
      case 'PENDING': return 'bg-yellow-100 text-yellow-700'
      case 'PARTIALLY_PAID': return 'bg-blue-100 text-blue-700'
      case 'CANCELLED': return 'bg-red-100 text-red-700'
      case 'OVERDUE': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString('en-IN')}`
  const formatStatus = (status) => status ? status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : 'Pending'

  const handleSearch = () => {
    setCurrentPage(0)
    fetchInvoices()
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setCurrentPage(newPage)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing Management</h1>
          <p className="text-gray-500 mt-1">Manage invoices, payments and financial records</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export
          </button>
          <button 
            onClick={() => { resetInvoiceForm(); setShowCreateModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Create Invoice
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
          <button onClick={() => { setError(null); fetchInvoices(); }} className="text-red-700 hover:text-red-900 font-medium">
            Retry
          </button>
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-full">
              <CurrencyRupeeIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('PAID')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('PENDING')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Amount</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pendingAmount)}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Invoices</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalInvoices}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-t-xl border border-b-0 px-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-4 px-2 border-b-2 font-medium transition-colors ${
              activeTab === 'invoices' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-4 px-2 border-b-2 font-medium transition-colors ${
              activeTab === 'payments' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Payments
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-t-0 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice number, patient name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="PARTIALLY_PAID">Partially Paid</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button onClick={handleSearch} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-b-xl shadow-sm border border-t-0 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-500">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <DocumentTextIcon className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No invoices found</p>
            <p className="text-sm mb-4">{error ? 'Please check your connection and try again' : 'Try adjusting your filters'}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-primary-600">{invoice.invoiceNumber || `INV-${invoice.id}`}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{invoice.patientName || 'Patient'}</div>
                          <div className="text-sm text-gray-500">{invoice.patientUhid || '-'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.invoiceDate || invoice.createdAt || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.totalAmount || invoice.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {formatCurrency(invoice.paidAmount || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.paymentMode || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                          {formatStatus(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => { setSelectedInvoice(invoice); setShowViewModal(true); }}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" 
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handlePrintInvoice(invoice)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Print"
                          >
                            <PrinterIcon className="h-5 w-5" />
                          </button>
                          {(invoice.status === 'PENDING' || invoice.status === 'PARTIALLY_PAID') && (
                            <button 
                              onClick={() => openPaymentModal(invoice)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                              title="Record Payment"
                            >
                              <BanknotesIcon className="h-5 w-5" />
                            </button>
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
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} invoices
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="px-4 py-2 text-sm font-medium">Page {currentPage + 1} of {totalPages || 1}</span>
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

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create New Invoice</h2>
              <button onClick={() => { resetInvoiceForm(); setShowCreateModal(false); }} className="p-2 hover:bg-gray-100 rounded-lg">
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
                <div className="space-y-6">
                  {/* Patient Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient *</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search patient by name or UHID..."
                        value={invoiceForm.patientSearch}
                        onChange={(e) => {
                          setInvoiceForm({...invoiceForm, patientSearch: e.target.value})
                          searchPatients(e.target.value)
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${formErrors.patient ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {patients.length > 0 && !selectedPatient && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {patients.map(patient => (
                            <button
                              key={patient.id}
                              onClick={() => {
                                setSelectedPatient(patient)
                                setInvoiceForm({...invoiceForm, patientSearch: `${patient.firstName} ${patient.lastName} (${patient.uhid})`})
                                setPatients([])
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b last:border-b-0"
                            >
                              <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                              <p className="text-sm text-gray-500">{patient.uhid} | {patient.mobileNumber}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {selectedPatient && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                          <p className="text-sm text-gray-500">{selectedPatient.uhid}</p>
                        </div>
                        <button onClick={() => { setSelectedPatient(null); setInvoiceForm({...invoiceForm, patientSearch: ''}); }} className="text-red-500 hover:text-red-700">
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                    {formErrors.patient && <p className="text-red-500 text-xs mt-1">{formErrors.patient}</p>}
                  </div>

                  {/* Invoice Items */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Invoice Items *</label>
                      <button onClick={addInvoiceItem} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        + Add Item
                      </button>
                    </div>
                    <div className="space-y-2">
                      {invoiceForm.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-6">
                            <input
                              type="text"
                              placeholder="Description"
                              value={item.description}
                              onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              placeholder="Qty"
                              value={item.quantity}
                              onChange={(e) => updateInvoiceItem(index, 'quantity', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                              min="1"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="number"
                              placeholder="Unit Price"
                              value={item.unitPrice}
                              onChange={(e) => updateInvoiceItem(index, 'unitPrice', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                              min="0"
                            />
                          </div>
                          <div className="col-span-1">
                            <button
                              onClick={() => removeInvoiceItem(index)}
                              disabled={invoiceForm.items.length <= 1}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {formErrors.items && <p className="text-red-500 text-xs mt-1">{formErrors.items}</p>}
                  </div>

                  {/* Tax & Discount */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax (%)</label>
                      <input
                        type="number"
                        value={invoiceForm.taxPercentage}
                        onChange={(e) => setInvoiceForm({...invoiceForm, taxPercentage: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        value={invoiceForm.discountPercentage}
                        onChange={(e) => setInvoiceForm({...invoiceForm, discountPercentage: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={invoiceForm.notes}
                      onChange={(e) => setInvoiceForm({...invoiceForm, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      rows={2}
                      placeholder="Additional notes for this invoice"
                    />
                  </div>

                  {/* Invoice Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Invoice Summary</h4>
                    {(() => {
                      const totals = calculateInvoiceTotal()
                      return (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatCurrency(totals.subtotal)}</span>
                          </div>
                          {totals.taxAmount > 0 && (
                            <div className="flex justify-between text-gray-600">
                              <span>Tax ({invoiceForm.taxPercentage}%)</span>
                              <span>+{formatCurrency(totals.taxAmount)}</span>
                            </div>
                          )}
                          {totals.discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount ({invoiceForm.discountPercentage}%)</span>
                              <span>-{formatCurrency(totals.discountAmount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Total</span>
                            <span>{formatCurrency(totals.total)}</span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => { resetInvoiceForm(); setShowCreateModal(false); }}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateInvoice}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Creating...
                        </>
                      ) : 'Create Invoice'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {showViewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Invoice Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Invoice Number</p>
                  <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{selectedInvoice.invoiceDate}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Patient</p>
                  <p className="font-medium">{selectedInvoice.patientName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                    {formatStatus(selectedInvoice.status)}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-medium text-lg">{formatCurrency(selectedInvoice.totalAmount)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Amount Paid</p>
                  <p className="font-medium text-lg text-green-600">{formatCurrency(selectedInvoice.paidAmount)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handlePrintInvoice(selectedInvoice)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <PrinterIcon className="h-5 w-5" />
                  Print Invoice
                </button>
                <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
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
                <h3 className="text-xl font-semibold mb-4">Export Invoices</h3>
                <p className="text-gray-600 mb-6">Choose export format for {invoices.length} invoices</p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleExport('csv')}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DocumentTextIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">CSV File</p>
                        <p className="text-sm text-gray-500">Best for Excel/Sheets</p>
                      </div>
                    </div>
                    <ArrowDownTrayIcon className="h-5 w-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <DocumentTextIcon className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">PDF Report</p>
                        <p className="text-sm text-gray-500">Printable format</p>
                      </div>
                    </div>
                    <ArrowDownTrayIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
                <button
                  onClick={() => { setShowExportModal(false); setActionSuccess(null); }}
                  className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Record Payment</h2>
              <button 
                onClick={() => { setShowPaymentModal(false); setSelectedInvoice(null); setActionSuccess(null); setError(null); }} 
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {actionSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-green-600 font-medium text-lg">{actionSuccess}</p>
                  <p className="text-gray-500 mt-2">Refreshing invoice data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Invoice Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Invoice</span>
                      <span className="font-medium text-primary-600">{selectedInvoice.invoiceNumber || `INV-${selectedInvoice.id}`}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Patient</span>
                      <span className="font-medium">{selectedInvoice.patientName || 'Patient'}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Total Amount</span>
                      <span className="font-medium">{formatCurrency(selectedInvoice.totalAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Already Paid</span>
                      <span className="font-medium text-green-600">{formatCurrency(selectedInvoice.paidAmount || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-700">Pending Amount</span>
                      <span className="font-bold text-lg text-red-600">
                        {formatCurrency((selectedInvoice.totalAmount || 0) - (selectedInvoice.paidAmount || 0))}
                      </span>
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Payment Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={paymentForm.amount}
                        onChange={(e) => setPaymentForm({...paymentForm, amount: parseFloat(e.target.value) || 0})}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg font-medium"
                        min="0"
                        max={(selectedInvoice.totalAmount || 0) - (selectedInvoice.paidAmount || 0)}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Max: {formatCurrency((selectedInvoice.totalAmount || 0) - (selectedInvoice.paidAmount || 0))}
                    </p>
                  </div>

                  {/* Payment Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode *</label>
                    <select
                      value={paymentForm.paymentMode}
                      onChange={(e) => setPaymentForm({...paymentForm, paymentMode: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="CASH">Cash</option>
                      <option value="CARD">Card</option>
                      <option value="UPI">UPI</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CHEQUE">Cheque</option>
                      <option value="ONLINE">Online Payment</option>
                    </select>
                  </div>

                  {/* Transaction ID (for non-cash payments) */}
                  {paymentForm.paymentMode !== 'CASH' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                      <input
                        type="text"
                        value={paymentForm.transactionId}
                        onChange={(e) => setPaymentForm({...paymentForm, transactionId: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter transaction reference"
                      />
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                      value={paymentForm.notes}
                      onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={2}
                      placeholder="Add any notes about this payment"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => { setShowPaymentModal(false); setSelectedInvoice(null); setError(null); }}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRecordPayment}
                      disabled={actionLoading || paymentForm.amount <= 0}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <BanknotesIcon className="h-5 w-5" />
                          Record Payment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BillingManagement
