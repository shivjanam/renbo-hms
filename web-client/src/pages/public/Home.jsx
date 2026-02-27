import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  CalendarIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import HospitalShowcase from '../../components/HospitalShowcase'
import hospitalConfig from '../../config/hospitalConfig'

const Home = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: CalendarIcon,
      title: 'Book Appointments',
      description: 'Book OPD, teleconsultation, or follow-up appointments with ease.',
    },
    {
      icon: UserGroupIcon,
      title: 'Expert Doctors',
      description: 'Access to qualified specialists across all medical departments.',
    },
    {
      icon: ClipboardDocumentListIcon,
      title: 'Digital Records',
      description: 'Access your prescriptions, lab reports, and medical history anytime.',
    },
    {
      icon: PhoneIcon,
      title: 'Teleconsultation',
      description: 'Consult doctors from the comfort of your home via video call.',
    },
  ]

  const stats = [
    { label: 'Years of Service', value: '15+' },
    { label: 'Happy Patients', value: '50,000+' },
    { label: 'Expert Doctors', value: '20+' },
    { label: 'Specializations', value: '12+' },
  ]

  return (
    <div>
      {/* Hospital Showcase - Hero Section with Carousel */}
      <HospitalShowcase
        hospitalName={hospitalConfig.name}
        hospitalTagline={hospitalConfig.tagline}
        hospitalSubtitle={hospitalConfig.subtitle}
        images={hospitalConfig.images}
        autoSlideInterval={hospitalConfig.carouselSettings.autoSlideInterval}
        showDots={hospitalConfig.carouselSettings.showDots}
        showArrows={hospitalConfig.carouselSettings.showArrows}
        pauseOnHover={hospitalConfig.carouselSettings.pauseOnHover}
        lazyLoad={hospitalConfig.carouselSettings.lazyLoad}
        height="lg"
      />

      {/* Quick Actions Bar */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5" />
                <span className="font-medium">{hospitalConfig.contact.phone.join(' / ')}</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                <span>{hospitalConfig.operatingHours.weekdays}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/book-appointment"
                className="px-4 py-2 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                Book Appointment
              </Link>
              <Link
                to="/track-appointment"
                className="px-4 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Track Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare services for you and your family
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitalConfig.services.map((service, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HeartIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <p className="text-gray-700 font-medium">{service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Doctors
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert healthcare professionals dedicated to your well-being
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {hospitalConfig.doctors.map((doctor, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-primary-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-white">
                      {doctor.name.split(' ').slice(1, 3).map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                    <p className="text-primary-600 font-medium">{doctor.specialization}</p>
                    <p className="text-sm text-gray-600 mt-1">{doctor.qualification}</p>
                    <p className="text-sm text-gray-500 mt-2">{doctor.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              View All Doctors
              <UserGroupIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience seamless healthcare with our modern hospital management system
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 sm:p-12 text-white text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Book your appointment today and experience world-class healthcare
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/book-appointment"
                className="px-8 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                {t('appointment.bookAppointment')}
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600">{hospitalConfig.contact.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">{hospitalConfig.contact.phone.join(' / ')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Operating Hours</h3>
                    <p className="text-gray-600">Daily: {hospitalConfig.operatingHours.weekdays}</p>
                    <p className="text-gray-600">Emergency: {hospitalConfig.operatingHours.emergency}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Book Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Appointment</h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Need to see a doctor? Book your appointment in just a few clicks!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    to="/book-appointment"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <CalendarIcon className="h-5 w-5" />
                    Book Now
                  </Link>
                  <a
                    href={`tel:${hospitalConfig.contact.phone[0]}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <PhoneIcon className="h-5 w-5" />
                    Call Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Trust Badges */}
      <section className="py-8 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-green-600" />
              <span>Certified Healthcare</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartIcon className="h-5 w-5 text-red-500" />
              <span>Patient-Centric Care</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-primary-600" />
              <span>24/7 Emergency</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
