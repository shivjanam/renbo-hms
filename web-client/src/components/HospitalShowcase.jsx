import { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

/**
 * HospitalShowcase Component
 * 
 * A reusable, configurable hospital header/showcase section with:
 * - Auto-sliding image carousel
 * - Manual navigation (arrows + dots)
 * - Hospital name overlay
 * - Fully responsive design
 * - Lazy loading for images
 * 
 * @example
 * <HospitalShowcase
 *   hospitalName="Rainbow Health Clinic"
 *   hospitalTagline="Your Health, Our Priority"
 *   images={[
 *     { src: '/images/hospital1.jpg', alt: 'Hospital', title: 'Our Facility' },
 *   ]}
 *   autoSlideInterval={4000}
 *   showDots={true}
 *   showArrows={true}
 * />
 */
const HospitalShowcase = ({
  hospitalName = 'Hospital',
  hospitalTagline = 'Your Health, Our Priority',
  hospitalSubtitle = '',
  images = [],
  autoSlideInterval = 4000,
  showDots = true,
  showArrows = true,
  pauseOnHover = true,
  lazyLoad = true,
  height = 'lg', // sm, md, lg, xl, full
  overlay = true,
  onSlideChange = null,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [loadedImages, setLoadedImages] = useState(new Set([0]))
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Default images if none provided
  const defaultImages = [
    {
      src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200',
      alt: 'Hospital Exterior',
      title: 'Modern Healthcare Facility',
    },
    {
      src: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200',
      alt: 'Doctor Consultation',
      title: 'Expert Medical Care',
    },
  ]

  const displayImages = images.length > 0 ? images : defaultImages

  // Height classes mapping
  const heightClasses = {
    sm: 'h-64 sm:h-72',
    md: 'h-72 sm:h-80 md:h-96',
    lg: 'h-80 sm:h-96 md:h-[28rem] lg:h-[32rem]',
    xl: 'h-96 sm:h-[28rem] md:h-[32rem] lg:h-[36rem]',
    full: 'h-screen',
  }

  // Go to next slide
  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => {
      const newIndex = (prev + 1) % displayImages.length
      // Preload next image
      setLoadedImages((loaded) => new Set([...loaded, newIndex, (newIndex + 1) % displayImages.length]))
      return newIndex
    })
    setTimeout(() => setIsTransitioning(false), 500)
  }, [displayImages.length, isTransitioning])

  // Go to previous slide
  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => {
      const newIndex = prev === 0 ? displayImages.length - 1 : prev - 1
      setLoadedImages((loaded) => new Set([...loaded, newIndex]))
      return newIndex
    })
    setTimeout(() => setIsTransitioning(false), 500)
  }, [displayImages.length, isTransitioning])

  // Go to specific slide
  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setLoadedImages((loaded) => new Set([...loaded, index]))
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [currentIndex, isTransitioning])

  // Auto-slide effect
  useEffect(() => {
    if (autoSlideInterval > 0 && displayImages.length > 1 && !(pauseOnHover && isHovered)) {
      intervalRef.current = setInterval(nextSlide, autoSlideInterval)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoSlideInterval, displayImages.length, isHovered, pauseOnHover, nextSlide])

  // Callback when slide changes
  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentIndex, displayImages[currentIndex])
    }
  }, [currentIndex, displayImages, onSlideChange])

  // Preload adjacent images
  useEffect(() => {
    const prevIndex = currentIndex === 0 ? displayImages.length - 1 : currentIndex - 1
    const nextIndex = (currentIndex + 1) % displayImages.length
    setLoadedImages((loaded) => new Set([...loaded, prevIndex, nextIndex]))
  }, [currentIndex, displayImages.length])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  return (
    <div 
      className={`relative ${heightClasses[height]} w-full overflow-hidden bg-gray-900`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Hospital showcase carousel"
    >
      {/* Images Container */}
      <div className="relative h-full w-full">
        {displayImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex 
                ? 'opacity-100 scale-100 z-10' 
                : 'opacity-0 scale-105 z-0'
            }`}
            aria-hidden={index !== currentIndex}
          >
            {/* Lazy load: only render image if it should be loaded */}
            {(lazyLoad ? loadedImages.has(index) : true) && (
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                style={{ objectPosition: image.position || 'center center' }}
                loading={index === 0 ? 'eager' : 'lazy'}
                onError={(e) => {
                  // Fallback to placeholder on error
                  e.target.src = `https://via.placeholder.com/1920x600/1e40af/ffffff?text=${encodeURIComponent(hospitalName)}`
                }}
              />
            )}
            
            {/* Image Title Overlay */}
            {image.title && (
              <div className="absolute bottom-20 left-0 right-0 text-center">
                <span className="inline-block px-4 py-2 bg-black/40 backdrop-blur-sm text-white text-sm sm:text-base rounded-full">
                  {image.title}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gradient Overlays */}
      {overlay && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent z-20 pointer-events-none" />
        </>
      )}

      {/* Hospital Name & Info Overlay */}
      <div className="absolute inset-0 z-30 flex flex-col justify-center items-center text-center px-4 pointer-events-none">
        <div className="max-w-4xl">
          {/* Hospital Name */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg animate-fade-in">
            {hospitalName}
          </h1>
          
          {/* Tagline */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-2 drop-shadow-md">
            {hospitalTagline}
          </p>
          
          {/* Subtitle */}
          {hospitalSubtitle && (
            <p className="text-sm sm:text-base md:text-lg text-white/80 drop-shadow-md">
              {hospitalSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && displayImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && displayImages.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-3">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 sm:w-10 h-2 sm:h-2.5 bg-white'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 z-40 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white text-sm">
        {currentIndex + 1} / {displayImages.length}
      </div>

      {/* Progress Bar */}
      {autoSlideInterval > 0 && displayImages.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-40">
          <div 
            className="h-full bg-white/80 transition-all ease-linear"
            style={{
              width: `${((currentIndex + 1) / displayImages.length) * 100}%`,
              transition: `width ${autoSlideInterval}ms linear`,
            }}
          />
        </div>
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

// PropTypes for documentation and validation
HospitalShowcase.propTypes = {
  hospitalName: PropTypes.string,
  hospitalTagline: PropTypes.string,
  hospitalSubtitle: PropTypes.string,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      title: PropTypes.string,
      type: PropTypes.oneOf(['exterior', 'interior', 'banner', 'pharmacy']),
      position: PropTypes.string, // CSS object-position value, e.g., 'center 20%', 'top', 'center center'
    })
  ),
  autoSlideInterval: PropTypes.number,
  showDots: PropTypes.bool,
  showArrows: PropTypes.bool,
  pauseOnHover: PropTypes.bool,
  lazyLoad: PropTypes.bool,
  height: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  overlay: PropTypes.bool,
  onSlideChange: PropTypes.func,
}

export default HospitalShowcase
