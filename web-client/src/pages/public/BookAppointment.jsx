import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

const BookAppointment = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, user } = useAuthStore()
  
  // Check if doctor is pre-selected via URL param
  const preSelectedDoctorId = searchParams.get('doctor')
  
  const [step, setStep] = useState(1)
  const [isLoadingPreselected, setIsLoadingPreselected] = useState(!!preSelectedDoctorId)
  
  // Selection state
  const [selectedSpecialization, setSelectedSpecialization] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null)
  
  // Guest info state
  const [guestName, setGuestName] = useState('')
  const [guestMobile, setGuestMobile] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpSessionId, setOtpSessionId] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [otpVerifying, setOtpVerifying] = useState(false)
  
  // Ref for OTP input to maintain focus
  const otpInputRef = useRef(null)
  
  // Data state
  const [doctors, setDoctors] = useState([])
  const [availableSlots, setAvailableSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [upiQrCode, setUpiQrCode] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [bookingResult, setBookingResult] = useState(null)

  // Specializations list
  const specializations = [
    { id: 'GENERAL_MEDICINE', name: 'General Medicine', icon: '🏥' },
    { id: 'CARDIOLOGY', name: 'Cardiology', icon: '❤️' },
    { id: 'ORTHOPEDICS', name: 'Orthopedics', icon: '🦴' },
    { id: 'GYNECOLOGY', name: 'Gynecology', icon: '👶' },
    { id: 'PEDIATRICS', name: 'Pediatrics', icon: '🧒' },
    { id: 'NEUROLOGY', name: 'Neurology', icon: '🧠' },
    { id: 'DERMATOLOGY', name: 'Dermatology', icon: '🔬' },
    { id: 'ENT', name: 'ENT', icon: '👂' },
    { id: 'OPHTHALMOLOGY', name: 'Ophthalmology', icon: '👁️' },
    { id: 'GASTROENTEROLOGY', name: 'Gastroenterology', icon: '🫁' },
    { id: 'PSYCHIATRY', name: 'Psychiatry', icon: '🧘' },
    { id: 'PULMONOLOGY', name: 'Pulmonology', icon: '🫀' },
  ]

  const paymentModes = [
    { id: 'upi', name: 'UPI (GPay, PhonePe, Paytm)', icon: '📱' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
    { id: 'cash', name: 'Pay at Hospital', icon: '💵' },
  ]

  // Pre-fill guest info if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setGuestName(user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim())
      setGuestMobile(user.mobileNumber || '')
      setGuestEmail(user.email || '')
      setOtpVerified(true) // Skip OTP for logged-in users
    }
  }, [isAuthenticated, user])

  // Handle pre-selected doctor from URL (e.g., from "Find a Doctor" page)
  useEffect(() => {
    if (preSelectedDoctorId) {
      fetchPreSelectedDoctor(preSelectedDoctorId)
    }
  }, [preSelectedDoctorId])

  const fetchPreSelectedDoctor = async (doctorId) => {
    setIsLoadingPreselected(true)
    setError(null)
    
    try {
      // Fetch doctor details
      const response = await api.get(`/api/v1/doctors/${doctorId}`)
      const doctorData = response.data?.data || response.data
      
      if (doctorData) {
        // Format doctor data for the component
        const formattedDoctor = {
          id: doctorData.id,
          name: doctorData.displayName || `Dr. ${doctorData.firstName || ''} ${doctorData.lastName || ''}`.trim(),
          experience: doctorData.experienceYears || 0,
          fee: doctorData.opdConsultationFee || doctorData.consultationFee || 500,
          rating: doctorData.rating || 4.5,
          qualification: doctorData.qualifications || 'MBBS',
          availability: doctorData.isActive ? 'Available Today' : 'Not Available',
          specialization: doctorData.primarySpecialization
        }
        
        // Find and set the specialization
        const spec = specializations.find(s => s.id === doctorData.primarySpecialization)
        if (spec) {
          setSelectedSpecialization(spec)
        } else {
          // Create a generic specialization object
          setSelectedSpecialization({
            id: doctorData.primarySpecialization,
            name: doctorData.primarySpecialization?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'General',
            icon: '🏥'
          })
        }
        
        // Set the selected doctor
        setSelectedDoctor(formattedDoctor)
        
        // Jump directly to step 3 (Date & Time selection)
        setStep(3)
      } else {
        throw new Error('Doctor not found')
      }
    } catch (err) {
      console.error('Error fetching pre-selected doctor:', err)
      setError('Could not load doctor details. Please select a doctor manually.')
      // Stay on step 1 if there's an error
      setStep(1)
    } finally {
      setIsLoadingPreselected(false)
    }
  }

  const getNextDates = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  useEffect(() => {
    if (selectedSpecialization) {
      fetchDoctors(selectedSpecialization.id)
    }
  }, [selectedSpecialization])

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots(selectedDoctor.id, selectedDate)
    }
  }, [selectedDoctor, selectedDate])

  const fetchDoctors = async (specializationId) => {
    setLoading(true)
    setError(null)
    setDoctors([])
    
    try {
      let doctorList = []
      
      try {
        const response = await api.get('/api/v1/doctors', {
          params: { specialization: specializationId, size: 50 }
        })
        const data = response.data
        if (data?.content && data.content.length > 0) {
          doctorList = data.content
        } else if (Array.isArray(data) && data.length > 0) {
          doctorList = data
        }
      } catch (err) {
        console.log('First API format failed:', err.message)
      }
      
      if (doctorList.length === 0) {
        try {
          const response = await api.get('/api/v1/doctors', { params: { size: 100 } })
          const data = response.data
          const allDoctors = data?.content || (Array.isArray(data) ? data : [])
          
          doctorList = allDoctors.filter(doc => {
            const docSpec = (doc.primarySpecialization || '').toUpperCase()
            const searchSpec = specializationId.toUpperCase()
            return docSpec === searchSpec || 
                   docSpec.includes(searchSpec) || 
                   searchSpec.includes(docSpec.replace('_', ''))
          })
        } catch (err) {
          console.log('Fallback API failed:', err.message)
        }
      }
      
      const formattedDoctors = doctorList.map(doc => ({
        id: doc.id,
        name: doc.displayName || `Dr. ${doc.firstName || ''} ${doc.lastName || ''}`.trim(),
        experience: doc.experienceYears || 0,
        fee: doc.opdConsultationFee || doc.consultationFee || 500,
        rating: doc.rating || 4.5,
        qualification: doc.qualifications || 'MBBS',
        availability: doc.isActive ? 'Available Today' : 'Not Available'
      }))
      
      setDoctors(formattedDoctors)
      
      if (formattedDoctors.length === 0) {
        setError(`No doctors found for ${selectedSpecialization.name}. Please try another specialization.`)
      }
    } catch (err) {
      console.error('Error fetching doctors:', err)
      setError('Unable to load doctors. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to check if a time slot is in the past for a given date
  const isSlotInPast = (slotTime, slotDate) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const selectedDay = new Date(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate())
    
    // If selected date is in the future, slot is not in the past
    if (selectedDay > today) {
      return false
    }
    
    // If selected date is today, check if time has passed
    if (selectedDay.getTime() === today.getTime()) {
      const [hours, minutes] = slotTime.split(':').map(Number)
      const slotDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
      
      // Add 30 minute buffer - don't allow booking for slots within next 30 mins
      const bufferTime = new Date(now.getTime() + 30 * 60 * 1000)
      
      return slotDateTime <= bufferTime
    }
    
    // If selected date is in the past (shouldn't happen, but just in case)
    return true
  }

  const fetchAvailableSlots = async (doctorId, date) => {
    setLoading(true)
    setAvailableSlots([])
    
    try {
      const dateStr = date.toISOString().split('T')[0]
      
      try {
        const response = await api.get(`/api/v1/appointments/slots`, {
          params: { doctorId, date: dateStr }
        })
        if (response.data?.data && response.data.data.length > 0) {
          // Filter out past slots for today
          const slots = response.data.data.map(slot => ({
            ...slot,
            available: slot.available && !isSlotInPast(slot.time, date),
            isPast: isSlotInPast(slot.time, date)
          }))
          setAvailableSlots(slots)
          return
        }
      } catch (err) {
        console.log('Slots API not available:', err.message)
      }
      
      const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30']
      const afternoonSlots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30']
      
      const allSlots = [...morningSlots, ...afternoonSlots].map(time => {
        const isPast = isSlotInPast(time, date)
        return {
          time,
          available: !isPast && Math.random() > 0.2, // Mark past slots as unavailable
          isPast
        }
      })
      
      setAvailableSlots(allSlots)
    } catch (err) {
      console.error('Error fetching slots:', err)
      const fallbackSlots = [
        { time: '09:00' }, { time: '10:00' }, { time: '11:00' },
        { time: '14:00' }, { time: '15:00' }, { time: '16:00' },
        { time: '17:00' }, { time: '18:00' }, { time: '19:00' },
      ].map(slot => ({
        ...slot,
        available: !isSlotInPast(slot.time, date),
        isPast: isSlotInPast(slot.time, date)
      }))
      setAvailableSlots(fallbackSlots)
    } finally {
      setLoading(false)
    }
  }

  // OTP Functions
  const handleSendOtp = async () => {
    if (!guestMobile || guestMobile.length !== 10) {
      setOtpError('Please enter a valid 10-digit mobile number')
      return
    }
    
    setLoading(true)
    setOtpError('')
    
    try {
      const response = await api.post('/api/v1/appointments/guest/send-otp', {
        mobile: guestMobile
      })
      
      setOtpSessionId(response.data.sessionId)
      setOtpSent(true)
      
      // In development, show OTP in console
      if (response.data.otp) {
        console.log('Development OTP:', response.data.otp)
      }
    } catch (err) {
      setOtpError(err.response?.data?.error || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (otpValue = otp) => {
    if (!otpValue || otpValue.length !== 6) {
      setOtpError('Please enter the 6-digit OTP')
      return
    }
    
    setOtpVerifying(true)
    setOtpError('')
    
    try {
      await api.post('/api/v1/appointments/guest/verify-otp', {
        sessionId: otpSessionId,
        otp: otpValue
      })
      
      setOtpVerified(true)
    } catch (err) {
      setOtpError(err.response?.data?.error || 'Invalid OTP. Please try again.')
    } finally {
      setOtpVerifying(false)
    }
  }

  // Handle OTP input change with auto-verification
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
    setOtpError('')
    
    // Auto-verify when 6 digits are entered
    if (value.length === 6) {
      handleVerifyOtp(value)
    }
  }

  const handleSpecializationSelect = (spec) => {
    setSelectedSpecialization(spec)
    setSelectedDoctor(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    setError(null)
    setStep(2)
  }

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor)
    setSelectedDate(null)
    setSelectedSlot(null)
    setStep(3)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
  }

  const handleSlotSelect = (slot) => {
    if (!slot.available) return
    setSelectedSlot(slot)
    setStep(4)
  }

  const handlePaymentModeSelect = (mode) => {
    setSelectedPaymentMode(mode)
  }

  const generateUpiQrCode = (amount, orderId) => {
    const upiId = 'hospital@upi'
    const payeeName = 'City Hospital'
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&tn=Appointment-${orderId}&cu=INR`
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`
  }

  const handleConfirmAndPay = async () => {
    if (!selectedPaymentMode) {
      setError('Please select a payment mode')
      return
    }
    
    if (!guestName.trim()) {
      setError('Please enter your name')
      return
    }
    
    if (!otpVerified && !isAuthenticated) {
      setError('Please verify your mobile number first')
      return
    }

    setShowPaymentModal(true)
    setPaymentProcessing(true)
    setError(null)

    try {
      // Use guest booking endpoint for non-authenticated users
      const bookingData = {
        patientName: guestName,
        patientMobile: guestMobile,
        patientEmail: guestEmail,
        doctorId: selectedDoctor.id,
        hospitalId: 1,
        appointmentDate: selectedDate.toISOString().split('T')[0],
        slotTime: selectedSlot.time,
        paymentMode: selectedPaymentMode.id,
        amount: selectedDoctor.fee,
        otpSessionId: otpSessionId
      }

      let response
      if (isAuthenticated) {
        // Use authenticated endpoint
        response = await api.post('/api/v1/appointments', {
          ...bookingData,
          patientId: user?.patientId
        })
      } else {
        // Use guest booking endpoint
        response = await api.post('/api/v1/appointments/guest/book', bookingData)
      }
      
      setBookingResult(response.data)

      if (selectedPaymentMode.id === 'upi') {
        const qrUrl = generateUpiQrCode(selectedDoctor.fee, response.data.appointmentNumber)
        setUpiQrCode(qrUrl)
        setPaymentProcessing(false)
      } else if (selectedPaymentMode.id === 'card' || selectedPaymentMode.id === 'netbanking') {
        setTimeout(() => {
          setPaymentProcessing(false)
          setPaymentSuccess(true)
        }, 2000)
      } else if (selectedPaymentMode.id === 'cash') {
        setTimeout(() => {
          setPaymentProcessing(false)
          setPaymentSuccess(true)
        }, 1500)
      }
    } catch (err) {
      console.error('Booking error:', err)
      setError(err.response?.data?.error || 'Failed to book appointment. Please try again.')
      setPaymentProcessing(false)
      setShowPaymentModal(false)
    }
  }

  const handleVerifyUpiPayment = async () => {
    setPaymentProcessing(true)
    setTimeout(() => {
      setPaymentProcessing(false)
      setPaymentSuccess(true)
    }, 2000)
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
  }

  // Guest Info Form Component
  const GuestInfoForm = () => (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-medium text-blue-900 mb-4">
        {isAuthenticated ? 'Your Details' : 'Guest Booking - Verify Your Details'}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={guestMobile}
              onChange={(e) => setGuestMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              disabled={otpVerified || isAuthenticated}
              required
            />
            {!isAuthenticated && !otpVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || otpSent}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
            )}
            {otpVerified && (
              <span className="flex items-center px-3 bg-green-100 text-green-700 rounded-lg">
                ✓ Verified
              </span>
            )}
          </div>
        </div>
        
        {otpSent && !otpVerified && !isAuthenticated && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP *</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={otpInputRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 text-center text-xl tracking-[0.5em] font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  maxLength={6}
                  autoFocus
                  disabled={otpVerifying}
                />
                {otpVerifying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={otpVerifying || otp.length !== 6}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">OTP sent to {guestMobile}</p>
              <p className="text-xs text-gray-400">{otp.length}/6 digits</p>
            </div>
            {otp.length === 6 && !otpVerifying && (
              <p className="text-xs text-green-600 mt-1">Auto-verifying...</p>
            )}
          </div>
        )}
        
        {otpError && (
          <p className="text-sm text-red-600">{otpError}</p>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      
      {!isAuthenticated && (
        <p className="text-sm text-blue-700 mt-4">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="underline font-medium">
            Login here
          </button>
          {' '}for faster booking.
        </p>
      )}
    </div>
  )

  // Show loading state when fetching pre-selected doctor
  if (isLoadingPreselected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('appointment.bookAppointment')}</h1>
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Loading doctor details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('appointment.bookAppointment')}</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 4 && (
                <div className={`w-full h-1 mx-2 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} 
                     style={{ width: '100px' }} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">Specialization</span>
          <span className="text-sm text-gray-600">Doctor</span>
          <span className="text-sm text-gray-600">Date & Time</span>
          <span className="text-sm text-gray-600">Confirm</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">✕</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border p-8">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">{t('appointment.selectSpecialization')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {specializations.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => handleSpecializationSelect(spec)}
                  className={`p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left ${
                    selectedSpecialization?.id === spec.id ? 'border-primary-500 bg-primary-50' : ''
                  }`}
                >
                  <span className="text-2xl mb-2 block">{spec.icon}</span>
                  <span className="font-medium text-gray-900 text-sm">{spec.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">{t('appointment.selectDoctor')}</h2>
            <p className="text-gray-500 mb-6">Showing doctors for: <strong>{selectedSpecialization?.name}</strong></p>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-500">Loading doctors...</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👨‍⚕️</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Doctors Available</h3>
                <p className="text-gray-500 mb-6">{error || `No doctors found for ${selectedSpecialization?.name}.`}</p>
                <button onClick={() => setStep(1)} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Choose Another Specialization
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => handleDoctorSelect(doctor)}
                    className={`w-full p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left flex items-center ${
                      selectedDoctor?.id === doctor.id ? 'border-primary-500 bg-primary-50' : ''
                    }`}
                  >
                    <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-primary-700 font-bold text-lg">
                        {doctor.name.split(' ').filter(n => n).slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{doctor.name}</p>
                      <p className="text-sm text-gray-500">{doctor.qualification} • {doctor.experience} years</p>
                      <p className="text-xs text-green-600 mt-1">{doctor.availability}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">₹{doctor.fee}</p>
                      <div className="flex items-center text-sm text-gray-500 justify-end">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{doctor.rating}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">{t('appointment.selectDate')}</h2>
            <p className="text-gray-500 mb-6">Doctor: <strong>{selectedDoctor?.name}</strong></p>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Select Date</h3>
              <div className="grid grid-cols-7 gap-2">
                {getNextDates().map((date, i) => {
                  const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
                  const isToday = i === 0
                  return (
                    <button
                      key={i}
                      onClick={() => handleDateSelect(date)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        isSelected ? 'border-primary-500 bg-primary-500 text-white' 
                        : isToday ? 'border-primary-300 bg-primary-50'
                        : 'hover:border-primary-500 hover:bg-primary-50'
                      }`}
                    >
                      <p className={`text-xs ${isSelected ? 'text-primary-100' : 'text-gray-500'}`}>
                        {date.toLocaleDateString('en', { weekday: 'short' })}
                      </p>
                      <p className={`font-medium ${isSelected ? 'text-white' : ''}`}>{date.getDate()}</p>
                      <p className={`text-xs ${isSelected ? 'text-primary-100' : 'text-gray-500'}`}>
                        {date.toLocaleDateString('en', { month: 'short' })}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
            
            {selectedDate && (
              <div>
                <h3 className="font-medium mb-3">Available Slots for {formatDate(selectedDate)}</h3>
                {loading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No slots available. Please select another date.</p>
                  </div>
                ) : availableSlots.every(s => !s.available) ? (
                  <div className="text-center py-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-700 font-medium">All slots have passed or are booked for today.</p>
                    <p className="text-yellow-600 text-sm mt-1">Please select tomorrow or another date.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Morning</p>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {availableSlots.filter(s => parseInt(s.time.split(':')[0]) < 12).map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => handleSlotSelect(slot)}
                            disabled={!slot.available}
                            className={`p-2 border rounded-lg text-sm transition-colors ${
                              slot.isPast 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                : !slot.available 
                                  ? 'bg-red-50 text-red-400 cursor-not-allowed line-through border-red-200'
                                  : selectedSlot?.time === slot.time 
                                    ? 'border-primary-500 bg-primary-500 text-white'
                                    : 'hover:border-primary-500 hover:bg-primary-50 border-gray-300'
                            }`}
                            title={slot.isPast ? 'This time has passed' : !slot.available ? 'Slot booked' : 'Available'}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Afternoon / Evening</p>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {availableSlots.filter(s => parseInt(s.time.split(':')[0]) >= 12).map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => handleSlotSelect(slot)}
                            disabled={!slot.available}
                            className={`p-2 border rounded-lg text-sm transition-colors ${
                              slot.isPast 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                : !slot.available 
                                  ? 'bg-red-50 text-red-400 cursor-not-allowed line-through border-red-200'
                                  : selectedSlot?.time === slot.time 
                                    ? 'border-primary-500 bg-primary-500 text-white'
                                    : 'hover:border-primary-500 hover:bg-primary-50 border-gray-300'
                            }`}
                            title={slot.isPast ? 'This time has passed' : !slot.available ? 'Slot booked' : 'Available'}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 border border-gray-300 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                        <span>Booked</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-gray-200 rounded opacity-50"></div>
                        <span>Past</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Confirm Appointment</h2>
            
            {/* Guest/User Info Form */}
            <GuestInfoForm />
            
            {/* Appointment Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-medium mb-4">Appointment Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Doctor</p>
                  <p className="font-medium">{selectedDoctor?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Specialization</p>
                  <p className="font-medium">{selectedSpecialization?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{selectedDate?.toLocaleDateString('en-IN', { 
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
                  })}</p>
                </div>
                <div>
                  <p className="text-gray-500">Time</p>
                  <p className="font-medium">{selectedSlot?.time}</p>
                </div>
                <div>
                  <p className="text-gray-500">Consultation Fee</p>
                  <p className="font-medium text-lg text-primary-600">₹{selectedDoctor?.fee}</p>
                </div>
                <div>
                  <p className="text-gray-500">Type</p>
                  <p className="font-medium">OPD Visit</p>
                </div>
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div className="mb-6">
              <h3 className="font-medium mb-4">Select Payment Mode</h3>
              <div className="grid grid-cols-2 gap-3">
                {paymentModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handlePaymentModeSelect(mode)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedPaymentMode?.id === mode.id 
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' 
                        : 'hover:border-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{mode.icon}</span>
                    <span className="font-medium text-gray-900 text-sm">{mode.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleConfirmAndPay}
              disabled={!selectedPaymentMode || !otpVerified || !guestName.trim()}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                selectedPaymentMode && otpVerified && guestName.trim()
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {!otpVerified && !isAuthenticated 
                ? 'Please verify your mobile number first'
                : selectedPaymentMode?.id === 'cash' 
                  ? `Confirm Booking (Pay ₹${selectedDoctor?.fee} at Hospital)`
                  : `Pay ₹${selectedDoctor?.fee} & Confirm`
              }
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {paymentSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  {selectedPaymentMode?.id === 'cash' ? 'Booking Confirmed!' : 'Payment Successful!'}
                </h3>
                <p className="text-gray-600 mb-4">Your appointment has been booked successfully.</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-left">
                  <p><strong>Appointment #:</strong> {bookingResult?.appointmentNumber || 'N/A'}</p>
                  <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
                  <p><strong>Date:</strong> {selectedDate?.toLocaleDateString('en-IN')}</p>
                  <p><strong>Time:</strong> {selectedSlot?.time}</p>
                  <p><strong>Token:</strong> #{bookingResult?.tokenNumber || Math.floor(Math.random() * 100) + 1}</p>
                  {bookingResult?.accessToken && (
                    <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-blue-800 font-medium">Save This Access Token:</p>
                      <p className="text-blue-600 text-xs break-all">{bookingResult.accessToken}</p>
                      <p className="text-blue-700 text-xs mt-1">Use this token to view your appointment later.</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {isAuthenticated ? (
                    <button 
                      onClick={() => navigate('/patient/appointments')}
                      className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      View My Appointments
                    </button>
                  ) : (
                    <button 
                      onClick={() => navigate('/')}
                      className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Back to Home
                    </button>
                  )}
                </div>
              </div>
            ) : paymentProcessing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Processing your {selectedPaymentMode?.id === 'cash' ? 'booking' : 'payment'}...</p>
              </div>
            ) : upiQrCode ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Scan QR Code to Pay</h3>
                <div className="bg-white p-4 rounded-lg border inline-block mb-4">
                  <img src={upiQrCode} alt="UPI QR Code" className="w-48 h-48" />
                </div>
                <p className="text-2xl font-bold text-primary-600 mb-2">₹{selectedDoctor?.fee}</p>
                <p className="text-sm text-gray-500 mb-4">Scan with any UPI app</p>
                <div className="space-y-2">
                  <button onClick={handleVerifyUpiPayment} className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    I've Made the Payment
                  </button>
                  <button onClick={() => { setShowPaymentModal(false); setUpiQrCode(null); }} className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

export default BookAppointment
