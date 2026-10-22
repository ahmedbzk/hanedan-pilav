# Simge ve OG görsellerini üretir (Windows, PowerShell 5.1, System.Drawing): powershell -File scripts/gorsel-uret.ps1
# Kaynaklar: public/img/logo-saydam.png ve public/img/galeri/tavuklu-nohutlu-pilav.jpg. Çıktılar public/ altına yazılır.
# OG PNG’leri sonra palet sıkıştırmasıyla küçültülür (README, Görseller ve simgeler).
param([string]$Kok = (Join-Path $PSScriptRoot "..\public"))
Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = "Stop"

$KARA = [System.Drawing.Color]::FromArgb(255, 0x15, 0x15, 0x15)
$SARI = [System.Drawing.Color]::FromArgb(255, 0xF4, 0xC2, 0x0D)
$EMAYE = [System.Drawing.Color]::FromArgb(255, 0xFB, 0xF7, 0xEC)
$logo = [System.Drawing.Bitmap]::FromFile("$Kok\img\logo-saydam.png")

function Tuval([int]$g, [int]$y) {
  $b = New-Object System.Drawing.Bitmap($g, $y, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gr = [System.Drawing.Graphics]::FromImage($b)
  $gr.SmoothingMode = "AntiAlias"; $gr.InterpolationMode = "HighQualityBicubic"
  $gr.PixelOffsetMode = "HighQuality"; $gr.CompositingQuality = "HighQuality"; $gr.TextRenderingHint = "AntiAliasGridFit"
  return @($b, $gr)
}

function YuvarlakDortgen($gr, $firca, [float]$x, [float]$y, [float]$g, [float]$h, [float]$r) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = 2 * $r
  $p.AddArc($x, $y, $d, $d, 180, 90); $p.AddArc($x + $g - $d, $y, $d, $d, 270, 90)
  $p.AddArc($x + $g - $d, $y + $h - $d, $d, $d, 0, 90); $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $p.CloseFigure(); $gr.FillPath($firca, $p); $p.Dispose()
}

# Küçük boyutlar: siyah zeminde sarı "H" monogramı (logonun slab harfi), ince sarı çerçeve.
function Monogram([int]$n) {
  $b, $gr = Tuval $n $n
  $gr.Clear([System.Drawing.Color]::Transparent)
  YuvarlakDortgen $gr (New-Object System.Drawing.SolidBrush($SARI)) 0 0 $n $n ($n * 0.18)
  $k = [Math]::Max(1, [Math]::Round($n * 0.07))
  YuvarlakDortgen $gr (New-Object System.Drawing.SolidBrush($KARA)) $k $k ($n - 2 * $k) ($n - 2 * $k) ($n * 0.13)
  $font = New-Object System.Drawing.Font("Rockwell Extra Bold", [float]($n * 0.62), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $sf = New-Object System.Drawing.StringFormat; $sf.Alignment = "Center"; $sf.LineAlignment = "Center"
  $gr.DrawString("H", $font, (New-Object System.Drawing.SolidBrush($SARI)), (New-Object System.Drawing.RectangleF(0, [float]($n * 0.04), $n, $n)), $sf)
  $gr.Dispose(); return $b
}

# Büyük boyutlar: kare siyah zemin, ortada logo.
function LogoIkon([int]$n, [double]$oran) {
  $b, $gr = Tuval $n $n
  $gr.Clear($KARA)
  $g = [int]($n * $oran); $h = [int]($g * $logo.Height / $logo.Width)
  $gr.DrawImage($logo, [int](($n - $g) / 2), [int](($n - $h) / 2), $g, $h)
  $gr.Dispose(); return $b
}

function PngBayt($bmp) { $ms = New-Object System.IO.MemoryStream; $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png); return , $ms.ToArray() }

# favicon.ico: PNG gömülü 16/32/48.
$boyutlar = 16, 32, 48
$pngler = $boyutlar | ForEach-Object { , (PngBayt (Monogram $_)) }
$fs = [System.IO.File]::Create("$Kok\favicon.ico"); $w = New-Object System.IO.BinaryWriter($fs)
$w.Write([UInt16]0); $w.Write([UInt16]1); $w.Write([UInt16]$boyutlar.Count)
$ofset = 6 + 16 * $boyutlar.Count
for ($i = 0; $i -lt $boyutlar.Count; $i++) {
  $w.Write([byte]$boyutlar[$i]); $w.Write([byte]$boyutlar[$i]); $w.Write([byte]0); $w.Write([byte]0)
  $w.Write([UInt16]1); $w.Write([UInt16]32); $w.Write([UInt32]$pngler[$i].Length); $w.Write([UInt32]$ofset)
  $ofset += $pngler[$i].Length
}
foreach ($p in $pngler) { $w.Write($p) }
$w.Close()

(LogoIkon 180 0.88).Save("$Kok\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
(LogoIkon 192 0.88).Save("$Kok\img\ikon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
(LogoIkon 512 0.88).Save("$Kok\img\ikon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)
# maskable: güvenli bölge (çapın %80'i) içinde kalsın diye logo daha küçük.
(LogoIkon 512 0.70).Save("$Kok\img\ikon-maskable-512.png", [System.Drawing.Imaging.ImageFormat]::Png)

# OG görseli 1200x630: solda siyah pano (logo + slogan), sağda tabakta pilav fotoğrafı.
function OgGorsel([string]$hedef, [string]$satir1, [string]$satir2) {
  $b, $gr = Tuval 1200 630
  $gr.Clear($KARA)
  $foto = [System.Drawing.Image]::FromFile("$Kok\img\galeri\tavuklu-nohutlu-pilav.jpg")
  # Sağ alan 600x630; fotoğraf genişliğe göre ölçeklenip tabağı ortalayacak şekilde dikey kırpılır.
  $alanG = 600; $alanH = 630
  $olcek = $alanG / $foto.Width; $kaynakH = $alanH / $olcek
  $kaynakY = [Math]::Min($foto.Height - $kaynakH, $foto.Height * 0.70 - $kaynakH / 2)
  $gr.DrawImage($foto, (New-Object System.Drawing.RectangleF(600, 0, $alanG, $alanH)), (New-Object System.Drawing.RectangleF(0, [float]$kaynakY, $foto.Width, [float]$kaynakH)), [System.Drawing.GraphicsUnit]::Pixel)
  $foto.Dispose()
  # Fotoğraf kenarına yumuşak geçiş.
  $gecis = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle(590, 0, 150, 630)), $KARA, [System.Drawing.Color]::FromArgb(0, 0x15, 0x15, 0x15), 0.0)
  $gr.FillRectangle($gecis, 600, 0, 130, 630)
  # Üstte ve altta sarı şerit.
  $sari = New-Object System.Drawing.SolidBrush($SARI)
  $gr.FillRectangle($sari, 0, 0, 1200, 10); $gr.FillRectangle($sari, 0, 620, 1200, 10)
  $gr.DrawImage($logo, 40, 150, 520, 188)
  $sf = New-Object System.Drawing.StringFormat; $sf.Alignment = "Center"
  $f1 = New-Object System.Drawing.Font("Rockwell", 40, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $f2 = New-Object System.Drawing.Font("Segoe UI Semibold", 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $gr.DrawString($satir1, $f1, $sari, (New-Object System.Drawing.RectangleF(20, 372, 560, 60)), $sf)
  $gr.DrawString($satir2, $f2, (New-Object System.Drawing.SolidBrush($EMAYE)), (New-Object System.Drawing.RectangleF(20, 432, 560, 50)), $sf)
  $gr.Dispose()
  $b.Save($hedef, [System.Drawing.Imaging.ImageFormat]::Png); $b.Dispose()
}
OgGorsel "$Kok\img\og-hanedan-pilav.png" "Tavuklu nohutlu pilav" ("1998" + [char]0x2019 + "den beri " + [char]0x00B7 + " " + [char]0x0130 + "stanbul")
OgGorsel "$Kok\img\og-hanedan-pilav-en.png" "Chicken & chickpea pilaf" ("Since 1998 " + [char]0x00B7 + " Istanbul")
$logo.Dispose()
"tamam"


