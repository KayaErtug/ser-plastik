# PROJE: ser-plastik.com

## Amaç
Ser Plastik kurumsal web sitesi.
Ziyaretçileri bilgilendirmek, satışa ve iletişime yönlendirmek.

## Hedef Chatbot Rolü
- Genel sohbet (karşılama, yönlendirme)
- Ürünler hakkında bilgi verme
- Üretim ve kapasite bilgisi
- Satış ve teklif almaya yönlendirme
- WhatsApp iletişimine yönlendirme

## Teknik Yapı
- Frontend: React + Vite + TypeScript
- Stil: Tailwind CSS
- Chatbot: Frontend-only, intent-based (ücretsiz)

## Kritik Dosyalar
- src/components/Chatbot.tsx
- src/App.tsx
- index.html

## Kodlama Kuralları
- Mevcut component yapısı bozulmayacak
- UI / UX değiştirilmeyecek
- Sadece `getBotResponse` mantığı geliştirilecek
- Backend eklenmeyecek
- Ücretli API kullanılmayacak

## Chatbot Davranış İlkeleri
- Kısa, net, kurumsal cevaplar
- Satış ve iletişime yönlendirme öncelikli
- Gereksiz sohbetten kaçınma

## Son Yapılan Değişiklikler
- AI_CONTEXT.md oluşturuldu
- Chatbot intent-based yapıya geçirilecek
