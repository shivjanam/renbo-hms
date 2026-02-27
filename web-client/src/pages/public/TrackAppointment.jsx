import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

const TrackAppointment = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // Check if there's a token in URL
  const tokenFromUrl = searchParams.get('token')
  
  const [searchMethod, setSearchMethod] = useState(tokenFromUrl ? 'token' : 'mobile')
  const [accessToken, setAccessToken] = useState(tokenFromUrl || '')
  const [mobile, setMobile] = useState('')
  const [appointmentNumber, setAppointmentNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [appointment, setAppointment] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAppointment(null)
    
    try {
      let response
      
      if (searchMethod === 'token') {
        if (!accessToken.trim()) {
          setError('Please enter your access token')
          setLoading(false)
          return
        }
        response = await api.get('/api/v1/appointments/guest/view', {
          params: { token: accessToken }
        })
      } else {
        if (!mobile || mobile.length !== 10 || !appointmentNumber.trim()) {
          setError('Please enter valid mobile number and appointment number')
          setLoading(false)
          return
        }
        response = await api.get('/api/v1/appointments/guest/lookup', {
          params: { mobile, appointmentNumber }
        })
      }
      
      setAppointment(response.data)
    } catch (err) {
      console.error('Error looking up appointment:', err)
      setError(err.response?.data?.error || 'No appointment found. Please check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      SCHEDULED: 'bg-blue-100 text-blue-700',
      CONFIRMED: 'bg-green-100 text-green-700',
      CHECKED_IN: 'bg-yellow-100 text-yellow-700',
      IN_PROGRESS: 'bg-purple-100 text-purple-700',
      COMPLETED: 'bg-gray-100 text-gray-700',
      CANCELLED_BY_PATIENT: 'bg-red-100 text-red-700',
      CANCELLED_BY_HOSPITAL: 'bg-red-100 text-red-700',
    }
    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Track Your Appointment</h1>
          <p className="mt-2 text-gray-600">
            View your appointment details without logging in
          </p>
        </div>

        {!appointment ? (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            {/* Search Method Toggle */}
            <div className="flex border rounded-lg mb-6 overflow-hidden">
              <button
                onClick={() => setSearchMethod('mobile')}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  searchMethod === 'mobile'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Mobile + Appointment #
              </button>
              <button
                onClick={() => setSearchMethod('token')}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  searchMethod === 'token'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Access Token
              </button>
            </div>

            <form onSubmit={handleSearch}>
              {searchMethod === 'mobile' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit mobile number"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Number
                    </label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={appointmentNumber}
                        onChange={(e) => setAppointmentNumber(e.target.value.toUpperCase())}
                        placeholder="e.g., APT2026000001"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Token
                  </label>
                  <textarea
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="Paste your access token here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is the token you received after booking your appointment
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    Find My Appointment
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-500">
                Don't have an appointment?{' '}
                <button 
                  onClick={() => navigate('/book-appointment')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Book Now
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-50 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">Appointment Found</p>
                <p className="text-sm text-green-600">{appointment.appointmentNumber}</p>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="p-6">
              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(appointment.status)}`}>
                  {appointment.status?.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <UserIcon className="h-4 w-4" />
                    <span className="text-xs">Patient</span>
                  </div>
                  <p className="font-medium">{appointment.patientName}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <UserIcon className="h-4 w-4" />
                    <span className="text-xs">Doctor</span>
                  </div>
                  <p className="font-medium">{appointment.doctorName || 'Assigned Doctor'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <CalendarDaysIcon className="h-4 w-4" />
                    <span className="text-xs">Date</span>
                  </div>
                  <p className="font-medium">
                    {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <ClockIcon className="h-4 w-4" />
                    <span className="text-xs">Time Slot</span>
                  </div>
                  <p className="font-medium">{appointment.slotStartTime}</p>
                </div>
                
                {appointment.tokenNumber && (
                  <div className="bg-primary-50 p-4 rounded-lg col-span-2">
                    <p className="text-sm text-primary-600">Your Token Number</p>
                    <p className="text-3xl font-bold text-primary-700">#{appointment.tokenNumber}</p>
                  </div>
                )}
              </div>

              {appointment.consultationFee && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-bold text-lg">₹{appointment.consultationFee}</span>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setAppointment(null)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Search Another
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Print Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackAppointment
