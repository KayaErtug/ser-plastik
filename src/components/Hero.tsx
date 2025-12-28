export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="anasayfa" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D47A1] to-[#2E75D4] opacity-90 z-10"></div>

      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/images/background videosu.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <img src="/logo.png" alt="Ser Plastik Logo" className="h-28 sm:h-36 w-auto mx-auto mb-8 drop-shadow-2xl" />

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Endüstriyel Plastik Ambalaj Üretiminde Güvenilir Çözüm Ortağınız
        </h1>

        <p className="text-xl sm:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed">
          Ser Plastik; naylon torba, jelatin, kargo poşeti ve endüstriyel ambalaj çözümlerinde 15+ yıllık tecrübesiyle hizmet vermektedir.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => scrollToSection('urunler')}
            className="bg-white text-[#0D47A1] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl w-full sm:w-auto"
          >
            Ürünlerimizi İncele
          </button>
          <button
            onClick={() => scrollToSection('teklif')}
            className="bg-[#D32F2F] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#b71c1c] transition-all transform hover:scale-105 shadow-xl w-full sm:w-auto"
          >
            Teklif Al
          </button>
        </div>
      </div>
    </section>
  );
}
