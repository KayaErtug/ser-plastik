import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Products from "./components/Products";
import Production from "./components/Production";
import QuoteForm from "./components/QuoteForm";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import { LanguageProvider } from "./LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#F4F7FB] text-slate-950">
        <Header />
        <main>
          <Hero />
          <About />
          <Products />
          <Production />
          <QuoteForm />
          <Contact />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </LanguageProvider>
  );
}

export default App;
