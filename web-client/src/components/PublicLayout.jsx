import { Outlet, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const PublicLayout = () => {
  const { t, i18n } = useTranslation()
  const location = useLocation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-primary-600">HMS</span>
                <span className="ml-2 text-gray-600 hidden sm:block">Hospital Management</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium ${
                  location.pathname === '/' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/doctors"
                className={`text-sm font-medium ${
                  location.pathname === '/doctors' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {t('nav.doctors')}
              </Link>
              <Link
                to="/book-appointment"
                className={`text-sm font-medium ${
                  location.pathname === '/book-appointment' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {t('appointment.bookAppointment')}
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
              >
                {i18n.language === 'en' ? 'हिंदी' : 'English'}
              </button>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                {t('auth.login')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Management System</h3>
              <p className="text-sm text-gray-600">
                Comprehensive healthcare management solution for Indian hospitals.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/doctors" className="text-sm text-gray-600 hover:text-primary-600">Find Doctors</Link></li>
                <li><Link to="/book-appointment" className="text-sm text-gray-600 hover:text-primary-600">Book Appointment</Link></li>
                <li><Link to="/login" className="text-sm text-gray-600 hover:text-primary-600">Patient Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Phone: +91 1234567890</li>
                <li>Email: info@hospital.com</li>
                <li>Emergency: 108</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Working Hours</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>OPD: 9:00 AM - 5:00 PM</li>
                <li>Emergency: 24x7</li>
                <li>Lab: 7:00 AM - 9:00 PM</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            <p>&copy; 2026 Hospital Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
