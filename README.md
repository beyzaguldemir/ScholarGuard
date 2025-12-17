# ScholarGuard: Akademik İnceleme ve Editör Destek Sistemi

ScholarGuard, akademik makale yazım sürecinde araştırmacılara "Desk Rejection" risklerini azaltmak için profesyonel inceleme desteği sunan yapay zeka tabanlı bir asistandır.

## 🚀 Yerel Kurulum Talimatları

Projeyi kendi bilgisayarınızda çalıştırmak için:

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

2. **API Anahtarını Tanımlayın:**
   Projeyi çalıştırmadan önce Gemini API anahtarınızı ortam değişkeni olarak ekleyin:
   - **Windows (PowerShell):** `$env:API_KEY="ANAHTARINIZ"; npm run dev`
   - **Linux/Mac:** `export API_KEY="ANAHTARINIZ" && npm run dev`

3. **Tarayıcıda Açın:**
   Terminalde görünen yerel adresi (genellikle `http://localhost:5173`) tarayıcınızda açın.

## 🛡️ Temel Özellikler
- **Word (.docx) Desteği:** Dosyaları doğrudan yükleyin.
- **AI İnceleme Modu:** Metni değiştirmeden kenar notları ekler.
- **Veri Görselleştirme:** Metindeki verileri otomatik olarak grafiklere dönüştürür.
- **Risk Analizi:** Editör reddi ihtimallerini raporlar.

---
*Güvenlik Notu: API anahtarınızı asla herkese açık platformlarda (GitHub gibi) paylaşmayın.*