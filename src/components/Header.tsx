import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <img src="/logo.png" alt="Ser Plastik Logo" className="h-14 w-auto" />
          </div>

          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('anasayfa')} className="text-gray-700 hover:text-[#0D47A1] transition-colors font-medium">
              Ana Sayfa
            </button>
            <button onClick={() => scrollToSection('hakkimizda')} className="text-gray-700 hover:text-[#0D47A1] transition-colors font-medium">
              Hakkımızda
            </button>
            <button onClick={() => scrollToSection('urunler')} className="text-gray-700 hover:text-[#0D47A1] transition-colors font-medium">
              Ürünler
            </button>
            <button onClick={() => scrollToSection('uretim')} className="text-gray-700 hover:text-[#0D47A1] transition-colors font-medium">
              Üretim
            </button>
            <button onClick={() => scrollToSection('teklif')} className="text-gray-700 hover:text-[#0D47A1] transition-colors font-medium">
              Teklif Al
            </button>
            <button onClick={() => scrollToSection('iletisim')} className="text-gray-700 hover:text-[#0D47A1] transition-colors font-medium">
              İletişim
            </button>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-3">
            <button onClick={() => scrollToSection('anasayfa')} className="block w-full text-left py-2 text-gray-700 hover:text-[#0D47A1] transition-colors font-medium">
              Ana Sayfa
            </button>
            <button onClick={() => scrollToSection('hakkimizda')} className="block w-full text-left py-2 text-gray-700 hover:text-[#0D47A1] transition-colors font-medium">
              Hakkımızda
            </button>
            <button onClick={() => scrollToSection('urunler')} className="block w-full text-left py-2 text-gray-700 hover:text-[#0D47A1] transition-colors font-medium">
              Ürünler
            </button>
            <button onClick={() => scrollToSection('uretim')} className="block w-full text-left py-2 text-gray-700 hover:text-[#0D47A1] transition-colors font-medium">
              Üretim
            </button>
            <button onClick={() => scrollToSection('teklif')} className="block w-full text-left py-2 text-gray-700 hover:text-[#0D47A1] transition-colors font-medium">
              Teklif Al
            </button>
            <button onClick={() => scrollToSection('iletisim')} className="block w-full text-left py-2 text-gray-700 hover:text-[#0D47A1] transition-colors font-medium">
              İletişim
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
