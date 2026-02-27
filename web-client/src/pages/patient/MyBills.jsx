import { useState, useEffect } from 'react'
import api from '../../services/api'

const MyBills = () => {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBill, setSelectedBill] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [upiQrCode, setUpiQrCode] = useState(null)
  const [filter, setFilter] = useState('all') // all, pending, paid

  const paymentModes = [
    { id: 'upi', name: 'UPI (GPay, PhonePe, Paytm)', icon: '📱' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
  ]

  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/v1/invoices')
      setBills(response.data.data || [])
    } catch (err) {
      console.log('API not available, using mock data:', err.message)
      // Mock bills data
      setBills([
        {
          id: 1,
          invoiceNumber: 'INV-2026-0001',
          date: '2026-02-01',
          dueDate: '2026-02-15',
          doctorName: 'Dr. Rajesh Kumar',
          description: 'Consultation - Cardiology',
          items: [
            { name: 'Consultation Fee', amount: 500 },
            { name: 'ECG Test', amount: 300 },
          ],
          totalAmount: 800,
          paidAmount: 0,
          status: 'PENDING',
          paymentDate: null,
        },
        {
          id: 2,
          invoiceNumber: 'INV-2026-0002',
          date: '2026-01-28',
          dueDate: '2026-02-10',
          doctorName: 'Dr. Priya Sharma',
          description: 'Consultation - General Medicine',
          items: [
            { name: 'Consultation Fee', amount: 400 },
            { name: 'Blood Test - CBC', amount: 250 },
            { name: 'Medicines', amount: 350 },
          ],
          totalAmount: 1000,
          paidAmount: 1000,
          status: 'PAID',
          paymentDate: '2026-01-28',
          paymentMode: 'UPI',
          transactionId: 'UPI12345678',
        },
        {
          id: 3,
          invoiceNumber: 'INV-2026-0003',
          date: '2026-01-15',
          dueDate: '2026-01-30',
          doctorName: 'Dr. Amit Patel',
          description: 'Consultation - Orthopedics',
          items: [
            { name: 'Consultation Fee', amount: 600 },
            { name: 'X-Ray', amount: 500 },
            { name: 'Physiotherapy Session', amount: 400 },
          ],
          totalAmount: 1500,
          paidAmount: 1500,
          status: 'PAID',
          paymentDate: '2026-01-15',
          paymentMode: 'Card',
          transactionId: 'CARD98765432',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredBills = bills.filter(bill => {
    if (filter === 'pending') return bill.status === 'PENDING'
    if (filter === 'paid') return bill.status === 'PAID'
    return true
  })

  const totalPending = bills
    .filter(b => b.status === 'PENDING')
    .reduce((sum, b) => sum + (b.totalAmount - b.paidAmount), 0)

  const totalPaid = bills
    .filter(b => b.status === 'PAID')
    .reduce((sum, b) => sum + b.paidAmount, 0)

  const handlePayBill = (bill) => {
    setSelectedBill(bill)
    setSelectedPaymentMode(null)
    setPaymentSuccess(false)
    setUpiQrCode(null)
    setShowPaymentModal(true)
  }

  const generateUpiQrCode = (amount, invoiceNumber) => {
    const upiId = 'hospital@upi'
    const payeeName = 'City Hospital'
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&tn=Invoice-${invoiceNumber}&cu=INR`
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`
    return qrUrl
  }

  const processPayment = async () => {
    if (!selectedPaymentMode) return

    setPaymentProcessing(true)

    try {
      if (selectedPaymentMode.id === 'upi') {
        const qrUrl = generateUpiQrCode(
          selectedBill.totalAmount - selectedBill.paidAmount,
          selectedBill.invoiceNumber
        )
        setUpiQrCode(qrUrl)
        setPaymentProcessing(false)
      } else {
        // Simulate payment processing for card/netbanking
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Update bill status
        setBills(prev => prev.map(b => 
          b.id === selectedBill.id 
            ? { 
                ...b, 
                status: 'PAID', 
                paidAmount: b.totalAmount,
                paymentDate: new Date().toISOString().split('T')[0],
                paymentMode: selectedPaymentMode.name,
              } 
            : b
        ))
        
        setPaymentProcessing(false)
        setPaymentSuccess(true)
      }
    } catch (err) {
      setError('Payment failed. Please try again.')
      setPaymentProcessing(false)
    }
  }

  const handleVerifyUpiPayment = async () => {
    setPaymentProcessing(true)
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setBills(prev => prev.map(b => 
      b.id === selectedBill.id 
        ? { 
            ...b, 
            status: 'PAID', 
            paidAmount: b.totalAmount,
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMode: 'UPI',
          } 
        : b
    ))
    
    setPaymentProcessing(false)
    setPaymentSuccess(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            ✓ Paid
          </span>
        )
      case 'PENDING':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            ⏳ Pending
          </span>
        )
      case 'OVERDUE':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            ⚠️ Overdue
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bills</h1>
        <button 
          onClick={fetchBills}
          className="text-primary-600 hover:text-primary-700 text-sm"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500 mb-1">Total Bills</p>
          <p className="text-2xl font-bold text-gray-900">{bills.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500 mb-1">Pending Amount</p>
          <p className="text-2xl font-bold text-yellow-600">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500 mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'all', label: 'All Bills' },
          { id: 'pending', label: 'Pending' },
          { id: 'paid', label: 'Paid' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bills List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredBills.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No bills found</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredBills.map(bill => (
              <div key={bill.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-gray-900">{bill.invoiceNumber}</p>
                      {getStatusBadge(bill.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{bill.description}</p>
                    <p className="text-xs text-gray-500">
                      {bill.doctorName} • {new Date(bill.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{bill.totalAmount.toLocaleString()}
                    </p>
                    {bill.status === 'PENDING' && (
                      <button
                        onClick={() => handlePayBill(bill)}
                        className="mt-2 px-4 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                      >
                        Pay Now
                      </button>
                    )}
                    {bill.status === 'PAID' && (
                      <p className="text-xs text-green-600 mt-1">
                        Paid via {bill.paymentMode}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Bill Items */}
                <div className="mt-3 pt-3 border-t">
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-primary-600 hover:text-primary-700">
                      View Details
                    </summary>
                    <div className="mt-2 bg-gray-50 rounded-lg p-3">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-500">
                            <th className="text-left pb-2">Item</th>
                            <th className="text-right pb-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700">
                          {bill.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="py-1">{item.name}</td>
                              <td className="text-right py-1">₹{item.amount}</td>
                            </tr>
                          ))}
                          <tr className="border-t font-semibold">
                            <td className="pt-2">Total</td>
                            <td className="text-right pt-2">₹{bill.totalAmount}</td>
                          </tr>
                        </tbody>
                      </table>
                      {bill.status === 'PAID' && bill.transactionId && (
                        <p className="text-xs text-gray-500 mt-2">
                          Transaction ID: {bill.transactionId}
                        </p>
                      )}
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {paymentSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">
                  Your payment of ₹{selectedBill.totalAmount} has been received.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-left">
                  <p><strong>Invoice:</strong> {selectedBill.invoiceNumber}</p>
                  <p><strong>Amount:</strong> ₹{selectedBill.totalAmount}</p>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
                </div>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Done
                </button>
              </div>
            ) : paymentProcessing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Processing your payment...</p>
              </div>
            ) : upiQrCode ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Scan QR Code to Pay</h3>
                <div className="bg-white p-4 rounded-lg border inline-block mb-4">
                  <img src={upiQrCode} alt="UPI QR Code" className="w-48 h-48" />
                </div>
                <p className="text-2xl font-bold text-primary-600 mb-2">
                  ₹{selectedBill.totalAmount - selectedBill.paidAmount}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Scan with any UPI app (GPay, PhonePe, Paytm, etc.)
                </p>
                <div className="space-y-2">
                  <button 
                    onClick={handleVerifyUpiPayment}
                    className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    I've Made the Payment
                  </button>
                  <button 
                    onClick={() => {
                      setUpiQrCode(null)
                      setShowPaymentModal(false)
                    }}
                    className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Pay Bill</h3>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">{selectedBill.invoiceNumber}</p>
                  <p className="font-medium text-gray-900">{selectedBill.description}</p>
                  <p className="text-2xl font-bold text-primary-600 mt-2">
                    ₹{selectedBill.totalAmount - selectedBill.paidAmount}
                  </p>
                </div>

                <h4 className="font-medium mb-3">Select Payment Mode</h4>
                <div className="space-y-2 mb-6">
                  {paymentModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedPaymentMode(mode)}
                      className={`w-full p-3 border rounded-lg text-left flex items-center transition-colors ${
                        selectedPaymentMode?.id === mode.id 
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' 
                          : 'hover:border-primary-500 hover:bg-primary-50'
                      }`}
                    >
                      <span className="text-xl mr-3">{mode.icon}</span>
                      <span className="font-medium text-gray-900">{mode.name}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={processPayment}
                  disabled={!selectedPaymentMode}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    selectedPaymentMode
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Pay ₹{selectedBill.totalAmount - selectedBill.paidAmount}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBills
