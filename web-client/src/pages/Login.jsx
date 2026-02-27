import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { sendOtp, loginWithOtp, loginWithPassword, isLoading, error, clearError } = useAuthStore()
  
  // UI State
  const [loginMethod, setLoginMethod] = useState('otp') // 'otp' or 'password'
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const otpInputRef = useRef(null)
  const countdownRef = useRef(null)

  const { register, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm()
  const mobileNumber = watch('mobileNumber')
  const otp = watch('otp')

  // Clear error and countdown on unmount
  useEffect(() => {
    return () => {
      if (clearError) clearError()
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }
  }, [clearError])

  // Auto-focus OTP input when shown
  useEffect(() => {
    if (otpSent && otpInputRef.current) {
      setTimeout(() => {
        otpInputRef.current?.focus()
      }, 100)
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

    console.log('[Login] Sending OTP to:', mobileNumber)
    setSendingOtp(true)
    if (clearError) clearError()

    try {
      const result = await sendOtp(mobileNumber)
      console.log('[Login] Send OTP result:', result)
      
      if (result.success) {
        setOtpSent(true)
        startCountdown()
        toast.success('OTP sent successfully! Check your phone.')
        console.log('[Login] OTP sent successfully, showing OTP input')
      } else {
        const errorMsg = result.error || 'Failed to send OTP. Please try again.'
        toast.error(errorMsg)
        console.error('[Login] Send OTP failed:', errorMsg)
      }
    } catch (err) {
      console.error('[Login] Send OTP exception:', err)
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
      console.log('[Login] Auto-verifying OTP...')
      setTimeout(() => {
        onSubmitOtp({ mobileNumber, otp: value })
      }, 300)
    }
  }

  // Handle OTP login
  const onSubmitOtp = async (data) => {
    const otpValue = data.otp || otp
    console.log('[Login] Submitting OTP login:', { mobile: data.mobileNumber, otp: '******' })
    
    if (!otpValue || otpValue.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setOtpVerifying(true)
    
    try {
      const result = await loginWithOtp(data.mobileNumber, otpValue)
      console.log('[Login] OTP login result:', result)
      
      if (result.success) {
        toast.success('Login successful! Welcome back!')
        navigate('/dashboard')
      } else {
        const errorMsg = result.error || 'Login failed. Please try again.'
        toast.error(errorMsg)
        console.error('[Login] OTP login failed:', errorMsg)
        
        // If OTP is invalid, allow retry
        if (errorMsg.includes('OTP') || errorMsg.includes('Invalid')) {
          setValue('otp', '')
          if (otpInputRef.current) {
            otpInputRef.current.focus()
          }
        }
      }
    } catch (err) {
      console.error('[Login] OTP login exception:', err)
      toast.error('Network error. Please try again.')
    } finally {
      setOtpVerifying(false)
    }
  }

  // Handle password login
  const onSubmitPassword = async (data) => {
    console.log('[Login] Submitting password login:', { username: data.username })
    
    try {
      const result = await loginWithPassword(data.username, data.password)
      console.log('[Login] Password login result:', result)
      
      if (result.success) {
        toast.success('Login successful! Welcome back!')
        navigate('/dashboard')
      } else {
        toast.error(result.error || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('[Login] Password login exception:', err)
      toast.error('Network error. Please try again.')
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

  // Switch login method
  const switchLoginMethod = (method) => {
    setLoginMethod(method)
    setOtpSent(false)
    setValue('otp', '')
    setCountdown(0)
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }
    reset()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t('auth.login')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              {t('auth.createAccount')}
            </Link>
          </p>
        </div>

        {/* Login method tabs */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              loginMethod === 'otp'
                ? 'bg-white text-primary-600 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => switchLoginMethod('otp')}
          >
            {t('auth.loginWithOtp')}
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              loginMethod === 'password'
                ? 'bg-white text-primary-600 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => switchLoginMethod('password')}
          >
            {t('auth.loginWithPassword')}
          </button>
        </div>

        {loginMethod === 'otp' ? (
          <form onSubmit={handleSubmit(onSubmitOtp)} className="space-y-6">
            {/* Mobile Number */}
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                {t('auth.mobileNumber')}
              </label>
              <div className="mt-1 flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +91
                </span>
                <input
                  id="mobileNumber"
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

            {/* Send OTP Button - Only shown before OTP is sent */}
            {!otpSent ? (
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
            ) : (
              <>
                {/* OTP Input */}
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    {t('auth.otp')}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      ref={otpInputRef}
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp || ''}
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
                    <p className="text-xs text-gray-500">OTP sent to +91 {mobileNumber}</p>
                    <p className="text-xs text-gray-400">{(otp || '').length}/6 digits</p>
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={otpVerifying || isLoading || (otp || '').length !== 6}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                    otpVerifying || isLoading || (otp || '').length !== 6
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {otpVerifying || isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Verifying...
                    </span>
                  ) : (
                    t('auth.verifyOtp')
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
                      {sendingOtp ? 'Sending...' : t('auth.resendOtp')}
                    </button>
                  )}
                </div>
              </>
            )}
          </form>
        ) : (
          /* Password Login Form */
          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username / Email / Mobile
              </label>
              <input
                id="username"
                type="text"
                {...register('username', { required: 'This field is required' })}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter username, email or mobile"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Logging in...
                </span>
              ) : (
                t('auth.login')
              )}
            </button>
          </form>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

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

export default Login
