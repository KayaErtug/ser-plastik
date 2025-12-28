import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <section id="iletisim" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0D47A1] mb-4">
            İletişim
          </h2>
          <div className="w-24 h-1 bg-[#D32F2F] mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Sorularınız için bize ulaşın, en kısa sürede size dönüş yapalım
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#F4F4F6] to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-[#0D47A1] to-[#2E75D4] p-4 rounded-lg mr-6">
                  <MapPin className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Adres</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Hacıeyüplü Mah. 3101 sokak no: 27/1<br />
                    Merkezefendi / DENİZLİ
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#F4F4F6] to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-[#0D47A1] to-[#2E75D4] p-4 rounded-lg mr-6">
                  <Phone className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Telefon & Faks</h3>
                  <a href="tel:02583713050" className="text-gray-700 hover:text-[#0D47A1] transition-colors text-lg">
                    0258 371 30 50
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#F4F4F6] to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-[#0D47A1] to-[#2E75D4] p-4 rounded-lg mr-6">
                  <Mail className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">E-posta</h3>
                  <a href="mailto:info@ser-plastik.com" className="text-gray-700 hover:text-[#0D47A1] transition-colors text-lg">
                    info@ser-plastik.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#F4F4F6] to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-[#0D47A1] to-[#2E75D4] p-4 rounded-lg mr-6">
                  <Clock className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Çalışma Saatleri</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Pazartesi - Cuma: 08:00 - 18:00<br />
                    Cumartesi: 09:00 - 13:00
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0D47A1] to-[#2E75D4] p-8 rounded-2xl shadow-lg text-white">
              <h3 className="text-2xl font-bold mb-4">Kurumsal Bilgiler</h3>
              <div className="space-y-2 text-white/90">
                <p><strong>Vergi Dairesi:</strong> Gökpınar V.D.</p>
                <p><strong>Vergi No:</strong> 761 100 0051</p>
                <p><strong>Ticaret Sicil No:</strong> 44621</p>
                <p><strong>MERSİS No:</strong> 07611100005100001</p>
              </div>
            </div>
          </div>

          <div className="h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.345678901234!2d29.027979!3d37.824011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ5JzI2LjQiTiAyOcKwMDEnNDAuNyJF!5e0!3m2!1str!2str!4v1703780000000!5m2!1str!2str"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ser Plastik Konum"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
