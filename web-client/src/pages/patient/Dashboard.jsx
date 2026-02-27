import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { 
  CalendarIcon, 
  DocumentTextIcon, 
  BeakerIcon, 
  CreditCardIcon 
} from '@heroicons/react/24/outline'

const PatientDashboard = () => {
  const { t } = useTranslation()

  const stats = [
    { name: 'Upcoming Appointments', value: '2', icon: CalendarIcon, href: '/patient/appointments', color: 'bg-blue-500' },
    { name: 'Active Prescriptions', value: '3', icon: DocumentTextIcon, href: '/patient/prescriptions', color: 'bg-green-500' },
    { name: 'Pending Lab Reports', value: '1', icon: BeakerIcon, href: '/patient/lab-reports', color: 'bg-purple-500' },
    { name: 'Pending Bills', value: '₹2,500', icon: CreditCardIcon, href: '/patient/bills', color: 'bg-orange-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('nav.dashboard')}</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/book-appointment" className="btn btn-primary">
            Book New Appointment
          </Link>
          <Link to="/patient/prescriptions" className="btn btn-outline">
            View Prescriptions
          </Link>
          <Link to="/patient/lab-reports" className="btn btn-outline">
            Download Reports
          </Link>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-primary-700 font-bold">RK</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Dr. Rajesh Kumar</p>
                <p className="text-sm text-gray-500">Cardiology • OPD</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">Tomorrow</p>
              <p className="text-sm text-gray-500">10:30 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
