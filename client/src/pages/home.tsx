import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturedWork from "@/components/featured-work";
import AboutSection from "@/components/aboutsection";
import BlogSection from "@/components/blog-section";
import ContactSection from "@/components/contact-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-dark text-white">
      <Navigation />
      <HeroSection />
      <FeaturedWork />
  
      <AboutSection />
      <BlogSection />
      <ContactSection />
    </div>
  );
}
