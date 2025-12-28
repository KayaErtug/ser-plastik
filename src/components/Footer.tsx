import { Facebook, Instagram, Linkedin, Twitter, Phone } from 'lucide-react';

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const productCategories = [
    'Naylon Torbalar',
    'Jelatin Ambalaj',
    'Endüstriyel Ambalaj',
    'Kargo Poşetleri',
    'Özel Üretim',
    'Geri Dönüşüm Ürünleri'
  ];

  return (
    <footer className="bg-gradient-to-b from-[#000000] to-[#0D47A1] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <img src="/logo.png" alt="Ser Plastik Logo" className="h-20 w-auto mb-6" />
            <p className="text-white/80 leading-relaxed mb-6">
              25+ yıllık tecrübesiyle plastik ambalaj sektöründe güvenilir çözüm ortağınız.
              Kaliteli üretim, hızlı teslimat ve müşteri memnuniyeti odaklı hizmet.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Ürün Kategorileri</h3>
            <ul className="space-y-3">
              {productCategories.map((category, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection('urunler')}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Hızlı Erişim</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => scrollToSection('anasayfa')} className="text-white/80 hover:text-white transition-colors">
                  Ana Sayfa
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('hakkimizda')} className="text-white/80 hover:text-white transition-colors">
                  Hakkımızda
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('urunler')} className="text-white/80 hover:text-white transition-colors">
                  Ürünler
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('uretim')} className="text-white/80 hover:text-white transition-colors">
                  Üretim Sürecimiz
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('teklif')} className="text-white/80 hover:text-white transition-colors">
                  Teklif Al
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('iletisim')} className="text-white/80 hover:text-white transition-colors">
                  İletişim
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-white">İletişim Bilgileri</h3>
            <ul className="space-y-4">
              <li className="text-white/80">
                <strong className="text-white">Adres:</strong><br />
                Hacıeyüplü Mah. 3101 sokak no: 27/1<br />
                Merkezefendi / DENİZLİ
              </li>
              <li>
                <a href="tel:02583713050" className="text-white/80 hover:text-white transition-colors flex items-center">
                  <Phone size={16} className="mr-2" />
                  0258 371 30 50
                </a>
              </li>
              <li>
                <a href="mailto:info@ser-plastik.com" className="text-white/80 hover:text-white transition-colors">
                  info@ser-plastik.com
                </a>
              </li>
            </ul>

            <a
              href="https://wa.me/905336667381"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#20BA5A] transition-colors"
            >
              WhatsApp ile İletişim
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/70 text-sm text-center md:text-left">
              © 2025 Ser Üretim Plastik Sanayi Limited Şirketi. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-white/70 hover:text-white transition-colors">Gizlilik Politikası</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Kullanım Koşulları</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">KVKK</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
