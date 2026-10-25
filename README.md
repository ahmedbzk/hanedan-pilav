# Hanedan Pilav

[hanedanpilav.com](https://www.hanedanpilav.com) kurumsal sitesi. Türkçe ve İngilizce, tamamen statik çıktı. Formlar PHP ile e-postaya iletilir.

## Teknolojiler

- React Router v7 (tüm sayfalar build sırasında HTML'e çevrilir), Vite, TypeScript
- CSS Modules, kendi sunucusundan yüklenen fontlar
- Playwright (uçtan uca testler), PHP 8.2 (form betiği)

## Kurulum

Node 22.18 veya üstü gerekir.

```bash
npm ci
npm run dev        # http://localhost:8780
```

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Statik çıktıyı `build/client` altına üretir |
| `npm run verify` | Tip kontrolü, testler ve build; CI aynısını çalıştırır |
| `npm run check:yayin` | Canlıya çıkmadan önceki son kontrol |

## İçerik güncelleme

| Ne | Nerede |
| --- | --- |
| Telefon, e-posta, adres, saatler, sosyal medya | `app/content/site.ts` |
| Şubeler | `app/content/bayiler.ts` |
| Galeri fotoğrafları | `app/content/galeri.ts` + `public/img/galeri/` |
| Sayfa metinleri (TR/EN) | `app/i18n/` |

Türkçe metinde "bayi" yerine "şube" kullanılır.

## Yayın

Barındırma isimtescil.net (Plesk). `npm run yayin` siteyi production için derler, `check:yayin` kapısından geçirir ve `build/client` içeriğini FTP ile web köküne (`httpdocs`) yükler. FTP bilgileri `.env.yayin` dosyasında durur ve repoya girmez (`FTP_SUNUCU`, `FTP_KULLANICI`, `FTP_SIFRE`, `FTP_DIZIN`). Paket FTPS sunmadığı için `FTP_SIFRESIZ=evet` gerekir; şifre ağda düz metin gittiğinden yükleme yalnız güvenilen ağdan yapılır. Yükleme sonunda dizin izinleri 755, dosya izinleri 644 yapılır. GitHub Actions yalnız testleri çalıştırır, yükleme yapmaz.

Sunucudaki e-posta ayarları `hanedan-config.php` dosyasında tutulur ve repoya girmez. Bu dosya Plesk Dosya Yöneticisi ile `httpdocs`'un bir üst dizinine elle konur; FTP hesabı yalnız `httpdocs`'u gördüğü için `npm run yayin` onu yüklemez.

Canlıya çıkmadan önce bir kez yapılır: Plesk > Zamanlanmış Görevler'de 10 dakikada bir `curl -fsS -o /dev/null --max-time 20 https://www.hanedanpilav.com/api/form.php || true` çalıştırılır (form hız sınırı özetlerini siler), ardından `app/content/site.ts` içinde `ipTemizlikGorevi.kuruldu` `true` yapılır. Yayından sonra `scripts/yayin-kontrol.sh https://www.hanedanpilav.com production` ile duman testi yapılır.
