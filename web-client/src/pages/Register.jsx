import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { sendOtp, register: registerUser, isLoading, error, clearError } = useAuthStore()
  
  // OTP flow state
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [sendingOtp, setSendingOtp] = useState(false)
  const otpInputRef = useRef(null)
  const countdownRef = useRef(null)

  // Form handling
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    defaultValues: {
      mobileNumber: '',
      otp: '',
      firstName: '',
      lastName: '',
    }
  })
  
  const mobileNumber = watch('mobileNumber')
  const otp = watch('otp')

  // Clear error on unmount
  useEffect(() => {
    return () => {
      clearError()
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }
  }, [clearError])

  // Auto-focus OTP input when shown
  useEffect(() => {
    if (otpSent && otpInputRef.current) {
      otpInputRef.current.focus()
    }
  }, [otpSent])

  // Start countdown timer
  const startCountdown = () => {
    setCountdown(60)
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Handle Send OTP button click
  const handleSendOtp = async () => {
    // Validate mobile number
    if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile number starting with 6-9')
      return
    }

    console.log('[Register] Sending OTP to:', mobileNumber)
    setSendingOtp(true)
    clearError()

    try {
      const result = await sendOtp(mobileNumber)
      console.log('[Register] Send OTP result:', result)
      
      if (result.success) {
        setOtpSent(true)
        startCountdown()
        toast.success('OTP sent successfully! Check your phone.')
        console.log('[Register] OTP sent successfully, showing OTP input')
      } else {
        const errorMsg = result.error || 'Failed to send OTP. Please try again.'
        toast.error(errorMsg)
        console.error('[Register] Send OTP failed:', errorMsg)
      }
    } catch (err) {
      console.error('[Register] Send OTP exception:', err)
      toast.error('Network error. Please check your connection.')
    } finally {
      setSendingOtp(false)
    }
  }

  // Handle OTP input change - auto verify when 6 digits entered
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setValue('otp', value)
    
    // Auto-submit when 6 digits entered
    if (value.length === 6 && !otpVerifying) {
      console.log('[Register] Auto-verifying OTP...')
      // Small delay to show user the complete OTP
      setTimeout(() => {
        handleSubmit(onSubmitRegistration)()
      }, 300)
    }
  }

  // Handle registration submission
  const onSubmitRegistration = async (data) => {
    console.log('[Register] Submitting registration:', { ...data, otp: '******' })
    
    if (!data.otp || data.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setOtpVerifying(true)
    
    try {
      const result = await registerUser({
        mobileNumber: data.mobileNumber,
        otp: data.otp,
        firstName: data.firstName || 'User',
        lastName: data.lastName || '',
      })
      
      console.log('[Register] Registration result:', result)
      
      if (result.success) {
        toast.success('Registration successful! Welcome!')
        navigate('/dashboard')
      } else {
        const errorMsg = result.error || 'Registration failed. Please try again.'
        toast.error(errorMsg)
        console.error('[Register] Registration failed:', errorMsg)
        
        // If OTP is invalid, allow retry
        if (errorMsg.includes('OTP') || errorMsg.includes('Invalid')) {
          setValue('otp', '')
          if (otpInputRef.current) {
            otpInputRef.current.focus()
          }
        }
      }
    } catch (err) {
      console.error('[Register] Registration exception:', err)
      toast.error('Network error. Please try again.')
    } finally {
      setOtpVerifying(false)
    }
  }

  // Handle resend OTP
  const handleResendOtp = () => {
    setValue('otp', '')
    handleSendOtp()
  }

  // Reset to change mobile number
  const handleChangeMobile = () => {
    setOtpSent(false)
    setValue('otp', '')
    setCountdown(0)
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          {t('auth.createAccount')}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            {t('auth.login')}
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmitRegistration)} className="space-y-6">
          {/* Mobile Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.mobileNumber')} *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                {...register('mobileNumber', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Enter a valid 10-digit mobile number',
                  },
                })}
                disabled={otpSent}
                className={`flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  otpSent ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Enter mobile number"
              />
            </div>
            {errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>
            )}
            {otpSent && (
              <button
                type="button"
                onClick={handleChangeMobile}
                className="mt-1 text-xs text-primary-600 hover:text-primary-500"
              >
                Change mobile number
              </button>
            )}
          </div>

          {/* OTP Section - Only shown after Send OTP success */}
          {otpSent && (
            <>
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register('firstName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register('lastName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP *
                </label>
                <div className="relative">
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={otpVerifying}
                    className={`w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      otpVerifying ? 'bg-gray-100' : ''
                    }`}
                    placeholder="• • • • • •"
                    autoComplete="one-time-code"
                  />
                  {otpVerifying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                    </div>
                  )}
                </div>
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    OTP sent to +91 {mobileNumber}
                  </p>
                  <p className="text-xs text-gray-400">{otp.length}/6 digits</p>
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={otpVerifying || otp.length !== 6}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  otpVerifying || otp.length !== 6
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {otpVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Verifying...
                  </span>
                ) : (
                  'Verify & Register'
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend OTP in <span className="font-medium text-primary-600">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={sendingOtp}
                    className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                  >
                    {sendingOtp ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </div>
            </>
          )}

          {/* Send OTP Button - Only shown before OTP is sent */}
          {!otpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                sendingOtp || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {sendingOtp || isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Sending OTP...
                </span>
              ) : (
                t('auth.sendOtp')
              )}
            </button>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
            <p>Debug: OTP for testing is <strong>123456</strong></p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Register
