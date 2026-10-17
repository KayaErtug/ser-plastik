import Experience from "./components/Experience";
import { useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Products from "./components/Products";
import Production from "./components/Production";
import QuoteForm from "./components/QuoteForm";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import MobileActionBar from "./components/MobileActionBar";
import FAQ from "./components/FAQ";
import PrivacyNotice from "./components/PrivacyNotice";
import { LanguageProvider } from "./LanguageContext";

function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
    document.querySelectorAll("main > section:not(:first-child):not(.material-journey)").forEach(section => { section.classList.add("scroll-reveal"); observer.observe(section); });
    return () => observer.disconnect();
  }, []);
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#F4F7FB] text-slate-950">
        <Header />
        <main>
          <Hero />
          <Experience />
          <About />
          <Products />
          <Production />
          <QuoteForm />
          <FAQ />
          <Contact />
          <PrivacyNotice />
        </main>
        <Footer />
        <MobileActionBar />
        <Chatbot />
      </div>
    </LanguageProvider>
  );
}

export default App;
