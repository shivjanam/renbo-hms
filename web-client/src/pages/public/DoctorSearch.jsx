import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'

const DoctorSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedHospital, setSelectedHospital] = useState('')
  const [doctors, setDoctors] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const specializations = [
    { value: '', label: 'All Specializations' },
    { value: 'GENERAL_MEDICINE', label: 'General Medicine' },
    { value: 'CARDIOLOGY', label: 'Cardiology' },
    { value: 'ORTHOPEDICS', label: 'Orthopedics' },
    { value: 'NEUROLOGY', label: 'Neurology' },
    { value: 'PEDIATRICS', label: 'Pediatrics' },
    { value: 'GYNECOLOGY', label: 'Gynecology' },
    { value: 'DERMATOLOGY', label: 'Dermatology' },
    { value: 'ENT', label: 'ENT' },
    { value: 'OPHTHALMOLOGY', label: 'Ophthalmology' },
    { value: 'PSYCHIATRY', label: 'Psychiatry' },
    { value: 'ONCOLOGY', label: 'Oncology' },
    { value: 'UROLOGY', label: 'Urology' },
    { value: 'GASTROENTEROLOGY', label: 'Gastroenterology' },
    { value: 'PULMONOLOGY', label: 'Pulmonology' },
    { value: 'NEPHROLOGY', label: 'Nephrology' },
    { value: 'ENDOCRINOLOGY', label: 'Endocrinology' },
    { value: 'RHEUMATOLOGY', label: 'Rheumatology' },
  ]

  // Fetch doctors and hospitals on mount
  useEffect(() => {
    fetchDoctors()
    fetchHospitals()
  }, [])

  const fetchDoctors = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/api/v1/doctors')
      if (response.data && response.data.content) {
        setDoctors(response.data.content)
      } else if (Array.isArray(response.data)) {
        setDoctors(response.data)
      } else {
        // Use mock data if API doesn't return expected format
        setDoctors(getMockDoctors())
      }
    } catch (err) {
      console.error('Error fetching doctors:', err)
      // Use mock data on error
      setDoctors(getMockDoctors())
    } finally {
      setLoading(false)
    }
  }

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/api/v1/hospitals')
      if (response.data && response.data.content) {
        setHospitals(response.data.content)
      } else if (Array.isArray(response.data)) {
        setHospitals(response.data)
      } else {
        setHospitals(getMockHospitals())
      }
    } catch (err) {
      console.error('Error fetching hospitals:', err)
      setHospitals(getMockHospitals())
    }
  }

  // Mock data fallback
  const getMockDoctors = () => [
    { id: 1, firstName: 'Rajesh', lastName: 'Kumar', displayName: 'Dr. Rajesh Kumar', primarySpecialization: 'CARDIOLOGY', qualifications: 'MBBS, MD, DM (Cardiology)', experienceYears: 25, opdConsultationFee: 500, primaryHospitalId: 1, isActive: true },
    { id: 2, firstName: 'Priya', lastName: 'Sharma', displayName: 'Dr. Priya Sharma', primarySpecialization: 'CARDIOLOGY', qualifications: 'MBBS, DM (Cardiology)', experienceYears: 20, opdConsultationFee: 800, primaryHospitalId: 1, isActive: true },
    { id: 3, firstName: 'Amit', lastName: 'Patel', displayName: 'Dr. Amit Patel', primarySpecialization: 'ORTHOPEDICS', qualifications: 'MBBS, MS (Ortho)', experienceYears: 22, opdConsultationFee: 600, primaryHospitalId: 1, isActive: true },
    { id: 4, firstName: 'Sunita', lastName: 'Verma', displayName: 'Dr. Sunita Verma', primarySpecialization: 'NEUROLOGY', qualifications: 'MBBS, DM (Neurology)', experienceYears: 18, opdConsultationFee: 700, primaryHospitalId: 2, isActive: true },
    { id: 5, firstName: 'Vikram', lastName: 'Singh', displayName: 'Dr. Vikram Singh', primarySpecialization: 'PEDIATRICS', qualifications: 'MBBS, MD (Pediatrics)', experienceYears: 24, opdConsultationFee: 450, primaryHospitalId: 2, isActive: true },
    { id: 6, firstName: 'Neha', lastName: 'Gupta', displayName: 'Dr. Neha Gupta', primarySpecialization: 'GYNECOLOGY', qualifications: 'MBBS, MS (OBG)', experienceYears: 15, opdConsultationFee: 550, primaryHospitalId: 3, isActive: true },
    { id: 7, firstName: 'Arun', lastName: 'Mehta', displayName: 'Dr. Arun Mehta', primarySpecialization: 'DERMATOLOGY', qualifications: 'MBBS, MD (Derma)', experienceYears: 21, opdConsultationFee: 400, primaryHospitalId: 3, isActive: true },
    { id: 8, firstName: 'Kavita', lastName: 'Joshi', displayName: 'Dr. Kavita Joshi', primarySpecialization: 'ENT', qualifications: 'MBBS, MS (ENT)', experienceYears: 17, opdConsultationFee: 450, primaryHospitalId: 4, isActive: true },
    { id: 9, firstName: 'Rahul', lastName: 'Khanna', displayName: 'Dr. Rahul Khanna', primarySpecialization: 'CARDIOLOGY', qualifications: 'MBBS, DM (Cardiology), FACC', experienceYears: 23, opdConsultationFee: 1200, primaryHospitalId: 2, isActive: true },
    { id: 10, firstName: 'Anjali', lastName: 'Reddy', displayName: 'Dr. Anjali Reddy', primarySpecialization: 'CARDIOLOGY', qualifications: 'MBBS, MCh (CTVS)', experienceYears: 19, opdConsultationFee: 1500, primaryHospitalId: 2, isActive: true },
    { id: 11, firstName: 'Suresh', lastName: 'Nair', displayName: 'Dr. Suresh Nair', primarySpecialization: 'NEUROLOGY', qualifications: 'MBBS, MCh (Neuro)', experienceYears: 26, opdConsultationFee: 1400, primaryHospitalId: 2, isActive: true },
    { id: 12, firstName: 'Meera', lastName: 'Iyer', displayName: 'Dr. Meera Iyer', primarySpecialization: 'ONCOLOGY', qualifications: 'MBBS, DM (Oncology)', experienceYears: 16, opdConsultationFee: 1000, primaryHospitalId: 4, isActive: true },
    { id: 13, firstName: 'Prakash', lastName: 'Rao', displayName: 'Dr. Prakash Rao', primarySpecialization: 'NEPHROLOGY', qualifications: 'MBBS, DM (Nephrology)', experienceYears: 27, opdConsultationFee: 900, primaryHospitalId: 2, isActive: true },
    { id: 14, firstName: 'Shalini', lastName: 'Mishra', displayName: 'Dr. Shalini Mishra', primarySpecialization: 'UROLOGY', qualifications: 'MBBS, MCh (Urology)', experienceYears: 14, opdConsultationFee: 850, primaryHospitalId: 2, isActive: true },
    { id: 15, firstName: 'Deepak', lastName: 'Saxena', displayName: 'Dr. Deepak Saxena', primarySpecialization: 'ORTHOPEDICS', qualifications: 'MBBS, MS (Ortho), DNB', experienceYears: 20, opdConsultationFee: 750, primaryHospitalId: 2, isActive: true },
    { id: 16, firstName: 'Pooja', lastName: 'Agarwal', displayName: 'Dr. Pooja Agarwal', primarySpecialization: 'DERMATOLOGY', qualifications: 'MBBS, MCh (Plastic)', experienceYears: 13, opdConsultationFee: 1100, primaryHospitalId: 2, isActive: true },
    { id: 17, firstName: 'Manish', lastName: 'Tiwari', displayName: 'Dr. Manish Tiwari', primarySpecialization: 'GASTROENTEROLOGY', qualifications: 'MBBS, MD, DM (Gastro)', experienceYears: 21, opdConsultationFee: 900, primaryHospitalId: 3, isActive: true },
    { id: 18, firstName: 'Ritu', lastName: 'Malhotra', displayName: 'Dr. Ritu Malhotra', primarySpecialization: 'ENDOCRINOLOGY', qualifications: 'MBBS, DM (Endocrinology)', experienceYears: 18, opdConsultationFee: 750, primaryHospitalId: 3, isActive: true },
    { id: 19, firstName: 'Naresh', lastName: 'Trehan', displayName: 'Dr. Naresh Trehan', primarySpecialization: 'CARDIOLOGY', qualifications: 'MBBS, MS, FRCS, FACC', experienceYears: 35, opdConsultationFee: 2500, primaryHospitalId: 5, isActive: true },
    { id: 20, firstName: 'Sameer', lastName: 'Malhotra', displayName: 'Dr. Sameer Malhotra', primarySpecialization: 'CARDIOLOGY', qualifications: 'MBBS, MD, DM (Cardiology)', experienceYears: 28, opdConsultationFee: 1500, primaryHospitalId: 5, isActive: true },
  ]

  const getMockHospitals = () => [
    { id: 1, name: 'City General Hospital', hospitalCode: 'CGH001' },
    { id: 2, name: 'Apollo Healthcare', hospitalCode: 'APL002' },
    { id: 3, name: 'Fortis Memorial Research', hospitalCode: 'FMR003' },
    { id: 4, name: 'Max Super Specialty', hospitalCode: 'MAX004' },
    { id: 5, name: 'Medanta The Medicity', hospitalCode: 'MED005' },
  ]

  // Get specialization label
  const getSpecializationLabel = (value) => {
    const spec = specializations.find(s => s.value === value)
    return spec ? spec.label : value?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'General'
  }

  // Get hospital name
  const getHospitalName = (hospitalId) => {
    const hospital = hospitals.find(h => h.id === hospitalId)
    return hospital ? hospital.name : 'Hospital'
  }

  // Filter doctors based on search query and filters
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      // Search query filter
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch = !query || 
        (doctor.firstName?.toLowerCase().includes(query)) ||
        (doctor.lastName?.toLowerCase().includes(query)) ||
        (doctor.displayName?.toLowerCase().includes(query)) ||
        (`dr. ${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(query)) ||
        (doctor.primarySpecialization?.toLowerCase().includes(query)) ||
        (getSpecializationLabel(doctor.primarySpecialization).toLowerCase().includes(query)) ||
        (doctor.qualifications?.toLowerCase().includes(query))

      // Specialization filter
      const matchesSpecialization = !selectedSpecialization || 
        doctor.primarySpecialization === selectedSpecialization

      // Hospital filter
      const matchesHospital = !selectedHospital || 
        doctor.primaryHospitalId === parseInt(selectedHospital)

      // Only show active doctors
      const isActive = doctor.isActive !== false

      return matchesSearch && matchesSpecialization && matchesHospital && isActive
    })
  }, [doctors, searchQuery, selectedSpecialization, selectedHospital, hospitals])

  // Get search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return []
    
    const query = searchQuery.toLowerCase()
    const suggestions = []
    
    // Add matching doctor names
    doctors.forEach(doctor => {
      const name = doctor.displayName || `Dr. ${doctor.firstName} ${doctor.lastName}`
      if (name.toLowerCase().includes(query) && suggestions.length < 5) {
        suggestions.push({ type: 'doctor', id: doctor.id, text: name, subtext: getSpecializationLabel(doctor.primarySpecialization) })
      }
    })
    
    // Add matching specializations
    specializations.forEach(spec => {
      if (spec.value && spec.label.toLowerCase().includes(query) && suggestions.length < 8) {
        const count = doctors.filter(d => d.primarySpecialization === spec.value).length
        if (count > 0) {
          suggestions.push({ type: 'specialization', value: spec.value, text: spec.label, subtext: `${count} doctors` })
        }
      }
    })
    
    return suggestions
  }, [searchQuery, doctors])

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'specialization') {
      setSelectedSpecialization(suggestion.value)
      setSearchQuery('')
    } else {
      setSearchQuery(suggestion.text)
    }
    setShowSuggestions(false)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSpecialization('')
    setSelectedHospital('')
  }

  const hasActiveFilters = searchQuery || selectedSpecialization || selectedHospital

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find a Doctor</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading doctors...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Find a Doctor</h1>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input with Suggestions */}
          <div className="md:col-span-2 relative">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor name, specialization..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b last:border-b-0"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{suggestion.text}</div>
                      <div className="text-sm text-gray-500">{suggestion.subtext}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      suggestion.type === 'doctor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {suggestion.type === 'doctor' ? 'Doctor' : 'Specialty'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specialization Filter */}
          <div>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {specializations.map((spec) => (
                <option key={spec.value} value={spec.value}>
                  {spec.label}
                </option>
              ))}
            </select>
          </div>

          {/* Hospital Filter */}
          <div>
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Hospitals</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters & Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredDoctors.length}</span> of {doctors.length} doctors
            </span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* No Results */}
      {filteredDoctors.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <button
            onClick={clearFilters}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-700 font-bold text-xl">
                    {doctor.firstName?.[0] || 'D'}{doctor.lastName?.[0] || ''}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {doctor.displayName || `Dr. ${doctor.firstName} ${doctor.lastName}`}
                  </h3>
                  <p className="text-primary-600 text-sm font-medium">
                    {getSpecializationLabel(doctor.primarySpecialization)}
                  </p>
                  <p className="text-gray-500 text-sm truncate">{doctor.qualifications}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    <span className="font-medium">{doctor.experienceYears}</span> years experience
                  </span>
                  <span className="flex items-center text-yellow-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    4.8
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {getHospitalName(doctor.primaryHospitalId)}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">₹{doctor.opdConsultationFee || 500}</span>
                  <span className="text-gray-500 text-sm"> /consultation</span>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Available
                </span>
              </div>

              <Link
                to={`/book-appointment?doctor=${doctor.id}&specialization=${doctor.primarySpecialization}`}
                className="mt-4 w-full block text-center py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorSearch
