import { Factory, Award, Users, TrendingUp } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Factory,
      title: '15+ Yıllık Tecrübe',
      description: 'Plastik ambalaj sektöründe deneyim'
    },
    {
      icon: Award,
      title: 'Kalite Güvencesi',
      description: 'ISO standartlarında üretim ve kalite kontrol'
    },
    {
      icon: Users,
      title: 'Uzman Kadro',
      description: 'Alanında uzman ve deneyimli çalışma ekibi'
    },
    {
      icon: TrendingUp,
      title: 'Yüksek Kapasite',
      description: 'Modern makine parkuru ile büyük ölçekli üretim'
    }
  ];

  return (
    <section id="hakkimizda" className="py-20 bg-gradient-to-b from-white to-[#F4F4F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0D47A1] mb-4">
            Hakkımızda
          </h2>
          <div className="w-24 h-1 bg-[#D32F2F] mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            SER ÜRETİM PLASTİK SANAYİ LİMİTED ŞİRKETİ
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6 text-center">
            <h3 className="text-3xl font-bold text-gray-900">Firma Tarihçemiz</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Ser Plastik, 15 yılı aşkın süredir plastik ambalaj sektöründe öncü bir konumda faaliyet göstermektedir.
              Denizli merkezli tesisimizde, modern teknoloji ve uzman kadromuzla müşterilerimize en kaliteli hizmeti sunmaktayız.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Naylon torba, jelatin ambalaj, kargo poşeti ve endüstriyel ambalaj çözümlerinde uzmanlaşmış firmamız,
              yerli ve uluslararası pazarda güvenilir bir iş ortağı olarak tanınmaktadır.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Sürekli gelişim ve müşteri memnuniyeti odaklı çalışma prensibimizle, sektörde fark yaratan ürünler üretiyoruz.
            </p>
          </div>

          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/images/Hakkımızda.png"
              alt="Üretim Tesisi"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center"
            >
              <div className="bg-gradient-to-br from-[#0D47A1] to-[#2E75D4] w-16 h-16 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <feature.icon className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
