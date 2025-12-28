import { useState } from 'react';
import { Send, Upload } from 'lucide-react';

export default function QuoteForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    product: '',
    size: '',
    printing: 'hayir',
    quantity: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const whatsappMessage = `
*Teklif Talebi*

*Ad Soyad:* ${formData.name}
*Firma:* ${formData.company}
*Telefon:* ${formData.phone}
*E-posta:* ${formData.email}

*Ürün:* ${formData.product}
*Ölçü/Mikron:* ${formData.size}
*Baskı:* ${formData.printing === 'evet' ? 'Evet' : 'Hayır'}
*Adet:* ${formData.quantity}

*Mesaj:* ${formData.message}
    `.trim();

    const whatsappUrl = `https://wa.me/902583713050?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="teklif" className="py-20 bg-gradient-to-b from-white to-[#F4F4F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0D47A1] mb-4">
            Teklif Al
          </h2>
          <div className="w-24 h-1 bg-[#D32F2F] mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Ürünlerimiz hakkında detaylı bilgi almak ve teklif talep etmek için formu doldurun
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Ad Soyad *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0D47A1] focus:outline-none transition-colors"
                placeholder="Adınız ve soyadınız"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Firma Adı</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0D47A1] focus:outline-none transition-colors"
                placeholder="Firma adınız"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Telefon *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0D47A1] focus:outline-none transition-colors"
                placeholder="0555 555 55 55"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">E-posta *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0D47A1] focus:outline-none transition-colors"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Talep Edilen Ürün *</label>
            <select
              required
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0D47A1] focus:outline-none transition-colors"
            >
              <option value="">Ürün seçiniz</option>
              <option value="Naylon Torba/Poşet">Naylon Torba/Poşet</option>
              <option value="Jelatin/Şeffaf Ambalaj">Jelatin/Şeffaf Ambalaj</option>
              <option value="Endüstriyel Ambalaj">Endüstriyel Ambalaj</option>
              <option value="Kargo/E-Ticaret Ambalajı">Kargo/E-Ticaret Ambalajı</option>
              <option value="Özel Üretim">Özel Üretim</option>
              <option value="Geri Dönüşüm Ürünleri">Geri Dönüşüm Ürünleri</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Ölçü / Mikron</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0D47A1] focus:outline-none transition-colors"
                placeholder="Örn: 30x40 cm, 50 mikron"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Baskı İsteniyor mu?</label>
              <select
                value={formData.printing}
                onChange={(e) => setFormData({ ...formData, printing: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0D47A1] focus:outline-none transition-colors"
              >
                <option value="hayir">Hayır</option>
                <option value="evet">Evet</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Adet *</label>
            <input
              type="text"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0D47A1] focus:outline-none transition-colors"
              placeholder="Örn: 10.000 adet"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Mesajınız</label>
            <textarea
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0D47A1] focus:outline-none transition-colors resize-none"
              placeholder="Ek bilgiler veya sorularınız..."
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              <Upload className="inline mr-2" size={20} />
              Dosya Yükleme (İsteğe bağlı)
            </label>
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.ai,.eps"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0D47A1] focus:outline-none transition-colors"
            />
            <p className="text-sm text-gray-500 mt-2">Tasarım dosyalarınızı yükleyebilirsiniz (AI, EPS, PDF, JPG, PNG)</p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0D47A1] to-[#2E75D4] text-white py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center"
          >
            <Send className="mr-2" size={20} />
            WhatsApp ile Teklif Talep Et
          </button>
        </form>
      </div>
    </section>
  );
}
