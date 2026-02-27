import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BeakerIcon,
  CreditCardIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
} from '@heroicons/react/24/outline'

const Layout = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Navigation based on user role
  const getNavigation = () => {
    const role = user?.primaryRole

    if (role === 'PATIENT' || role === 'FAMILY_MEMBER') {
      return [
        { name: t('nav.dashboard'), href: '/patient/dashboard', icon: HomeIcon },
        { name: t('nav.appointments'), href: '/patient/appointments', icon: CalendarIcon },
        { name: t('nav.prescriptions'), href: '/patient/prescriptions', icon: DocumentTextIcon },
        { name: t('nav.labReports'), href: '/patient/lab-reports', icon: BeakerIcon },
        { name: t('nav.billing'), href: '/patient/bills', icon: CreditCardIcon },
      ]
    }

    if (['DOCTOR', 'SPECIALIST', 'CONSULTANT'].includes(role)) {
      return [
        { name: t('nav.dashboard'), href: '/doctor/dashboard', icon: HomeIcon },
        { name: t('nav.appointments'), href: '/doctor/appointments', icon: CalendarIcon },
        { name: t('nav.patients'), href: '/doctor/patients', icon: UserGroupIcon },
        { name: t('nav.prescriptions'), href: '/doctor/prescriptions', icon: DocumentTextIcon },
      ]
    }

    if (['HOSPITAL_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return [
        { name: t('nav.dashboard'), href: '/admin/dashboard', icon: HomeIcon },
        { name: t('nav.patients'), href: '/admin/patients', icon: UserGroupIcon },
        { name: t('nav.doctors'), href: '/admin/doctors', icon: UserCircleIcon },
        { name: t('nav.appointments'), href: '/admin/appointments', icon: CalendarIcon },
        { name: t('nav.billing'), href: '/admin/billing', icon: CreditCardIcon },
        { name: t('nav.reports'), href: '/admin/reports', icon: ChartBarIcon },
        { name: t('nav.settings'), href: '/admin/settings', icon: Cog6ToothIcon },
      ]
    }

    return [
      { name: t('nav.dashboard'), href: '/dashboard', icon: HomeIcon },
    ]
  }

  const navigation = getNavigation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <span className="text-xl font-bold text-primary-600">HMS</span>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <span className="text-xl font-bold text-primary-600">Hospital MS</span>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-medium">
                    {user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.displayName}</p>
                <p className="text-xs text-gray-500">{user?.primaryRole?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:ml-0" />

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                  <span className="ml-2 hidden sm:block">{t('nav.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
