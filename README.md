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

`build/client` klasörü Plesk barındırmaya FTP ile yüklenir. `main` dalına yapılan her push test ortamına otomatik yüklenir; canlı ortama yükleme GitHub Actions'tan elle başlatılır ve onay gerektirir. Gerekli FTP bilgileri GitHub'da ortam sırları olarak tanımlanır.

Sunucudaki e-posta ayarları `hanedan-config.php` dosyasında tutulur (örnek: `deploy/hanedan-config.example.php`) ve repoya girmez.
