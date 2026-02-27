/**
 * Hospital Configuration File
 * 
 * This configuration file allows the Hospital Showcase component to be
 * reused across multi-hospital platforms and white-label deployments.
 * 
 * To customize for a different hospital:
 * 1. Change the hospitalName
 * 2. Update the images array with new image paths
 * 3. Optionally update tagline, contact info, etc.
 */

// Default hospital configuration
export const hospitalConfig = {
  // Hospital Basic Info
  name: import.meta.env.VITE_HOSPITAL_NAME || 'Rainbow Health Clinic',
  tagline: import.meta.env.VITE_HOSPITAL_TAGLINE || 'Your Health, Our Priority',
  subtitle: 'Comprehensive Healthcare for You and Your Family',
  
  // Contact Information
  contact: {
    phone: ['8528695991', '8090945179'],
    email: 'info@rainbowhealthclinic.com',
    address: '200m North of Saidpur Kotwali, Near HR Restaurant, Saidpur - Ghazipur',
  },
  
  // Operating Hours
  operatingHours: {
    weekdays: '2:00 PM - 8:00 PM',
    weekends: '2:00 PM - 8:00 PM',
    emergency: '24/7',
  },
  
  // Specializations offered
  specializations: [
    'Pediatrics (MD Pediatrics)',
    'Gynecology & Obstetrics',
    'General Medicine',
    'Diabetes & Hypertension',
    'Skin Diseases',
  ],
  
  // Doctors
  doctors: [
    {
      name: 'Dr. Manoj Kumar Sonkar',
      specialization: 'MD Pediatrics',
      qualification: 'MBBS, DMCH (G.S.V.M. Kanpur)',
      description: 'Newborn & Child Disease Specialist',
    },
    {
      name: 'Dr. Neepu Chaurasiya',
      specialization: 'Gynecology & Obstetrics',
      qualification: 'MBBS, DGO, MS (G.S.V.M. Kanpur)',
      description: 'Ex. MO - IMS BHU',
    },
  ],
  
  // Showcase Images Configuration
  // Images are pre-cropped to 1920x600 banner size for consistent display
  // To resize new images, run: public/images/hospital/resize-images.ps1
  images: [
    {
      src: '/images/hospital/clinic_banner.jpg',
      alt: 'Rainbow Health Clinic Banner',
      title: 'Rainbow Health Clinic - Saidpur, Ghazipur',
      type: 'banner',
    },
    {
      src: '/images/hospital/doctor_clinic_1.jpg',
      alt: 'Doctor consultation at Rainbow Health Clinic',
      title: 'Expert Medical Consultation',
      type: 'interior',
    },
    {
      src: '/images/hospital/doctor_clinic_2.jpg',
      alt: 'Doctor at work station',
      title: 'Professional Healthcare',
      type: 'interior',
    },
    {
      src: '/images/hospital/doctor_icu.jpg',
      alt: 'ICU and Emergency Care',
      title: 'Advanced Medical Care',
      type: 'interior',
    },
    {
      // Stock image for hospital exterior - replace with actual photo
      src: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1920&h=600&fit=crop',
      alt: 'Hospital Building Exterior',
      title: 'Modern Healthcare Facility',
      type: 'exterior',
    },
  ],
  
  // Carousel Settings
  carouselSettings: {
    autoSlideInterval: 4000, // milliseconds
    showDots: true,
    showArrows: true,
    pauseOnHover: true,
    lazyLoad: true,
  },
  
  // Theme Colors (can be customized per hospital)
  theme: {
    primaryColor: '#2563eb', // blue-600
    secondaryColor: '#059669', // emerald-600
    accentColor: '#dc2626', // red-600
  },
  
  // Services Highlight
  services: [
    'Complete treatment for newborns and children',
    'Women\'s comprehensive healthcare',
    'Diabetes (Sugar) management',
    'Hypertension (BP) treatment',
    'Skin disease treatment',
  ],
};

// Export individual configurations for flexibility
export const getHospitalName = () => hospitalConfig.name;
export const getHospitalImages = () => hospitalConfig.images;
export const getCarouselSettings = () => hospitalConfig.carouselSettings;
export const getHospitalContact = () => hospitalConfig.contact;
export const getHospitalDoctors = () => hospitalConfig.doctors;

export default hospitalConfig;
