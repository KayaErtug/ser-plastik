import { Zap, Printer, Scissors, PackageCheck, ShieldCheck, Settings } from 'lucide-react';

export default function Production() {
  const steps = [
    {
      icon: Settings,
      title: 'Hammadde Hazırlığı',
      description: 'Yüksek kaliteli plastik hammaddelerin seçimi ve hazırlanması'
    },
    {
      icon: Zap,
      title: 'Ekstrüzyon',
      description: 'Modern ekstrüzyon makinelerinde film üretimi'
    },
    {
      icon: Printer,
      title: 'Baskı',
      description: 'Flexo baskı teknolojisi ile renkli ve özel tasarım baskılar'
    },
    {
      icon: Scissors,
      title: 'Kesim & Dikiş',
      description: 'Otomatik kesim ve dikiş makineleri ile şekillendirme'
    },
    {
      icon: PackageCheck,
      title: 'Paketleme',
      description: 'Hijyenik ortamda paketleme ve etiketleme'
    },
    {
      icon: ShieldCheck,
      title: 'Kalite Kontrol',
      description: 'ISO standartlarında kalite kontrol ve onay süreci'
    }
  ];

  return (
    <section id="uretim" className="py-20 bg-gradient-to-b from-[#F4F4F6] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0D47A1] mb-4">
            Üretim Sürecimiz
          </h2>
          <div className="w-24 h-1 bg-[#D32F2F] mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Modern teknoloji ve kalite kontrol sistemleri ile üretim yapıyoruz
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
            >
              <div className="absolute -top-4 -left-4 bg-gradient-to-br from-[#0D47A1] to-[#2E75D4] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                {index + 1}
              </div>
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-[#0D47A1] to-[#2E75D4] p-4 rounded-lg">
                  <step.icon className="text-white" size={28} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/images/production-line.png"
              alt="Üretim Hattı"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white text-2xl font-bold">Modern Makine Parkuru</h3>
            </div>
          </div>

          <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/images/quality-control.png"
              alt="Kalite Kontrol"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white text-2xl font-bold">ISO Standartlarında Üretim</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
