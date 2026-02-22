import LandingNavbar from './LandingNavbar'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import HowItWorksSection from './HowItWorksSection'
import TestimonialsSection from './TestimonialsSection'
import PricingSection from './PricingSection'
import CTASection from './CTASection'
import Footer from './Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}
