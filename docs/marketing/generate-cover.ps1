param(
  [string]$AssetDir = (Join-Path $PSScriptRoot "zhihu-assets")
)

Add-Type -AssemblyName System.Drawing

Set-StrictMode -Version Latest

function Utf8([string]$base64) {
  return [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($base64))
}

$width = 1600
$height = 900
$outPath = Join-Path $AssetDir "00-cover.png"
$mainShotPath = Join-Path $AssetDir "02-3d-knowledge-universe.png"
$brainShotPath = Join-Path $AssetDir "01-agent-external-brain.png"

function New-Color([int]$a, [string]$hex) {
  $clean = $hex.TrimStart("#")
  $r = [Convert]::ToInt32($clean.Substring(0, 2), 16)
  $g = [Convert]::ToInt32($clean.Substring(2, 2), 16)
  $b = [Convert]::ToInt32($clean.Substring(4, 2), 16)
  return [System.Drawing.Color]::FromArgb($a, $r, $g, $b)
}

function New-RoundRectPath([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function Fill-RoundRect($g, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r, $brush) {
  $path = New-RoundRectPath $x $y $w $h $r
  $g.FillPath($brush, $path)
  $path.Dispose()
}

function Stroke-RoundRect($g, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r, $pen) {
  $path = New-RoundRectPath $x $y $w $h $r
  $g.DrawPath($pen, $path)
  $path.Dispose()
}

function Draw-ImageCover($g, $image, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $scale = [Math]::Max($w / $image.Width, $h / $image.Height)
  $srcW = $w / $scale
  $srcH = $h / $scale
  $srcX = ($image.Width - $srcW) / 2
  $srcY = ($image.Height - $srcH) / 2

  $shadowBrush = [System.Drawing.SolidBrush]::new((New-Color 34 "#12302F"))
  Fill-RoundRect $g ($x + 14) ($y + 18) $w $h $r $shadowBrush
  $shadowBrush.Dispose()

  $path = New-RoundRectPath $x $y $w $h $r
  $oldClip = $g.Clip
  $g.SetClip($path)
  $destRect = [System.Drawing.RectangleF]::new($x, $y, $w, $h)
  $srcRect = [System.Drawing.RectangleF]::new($srcX, $srcY, $srcW, $srcH)
  $g.DrawImage($image, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Clip = $oldClip
  $oldClip.Dispose()
  $path.Dispose()

  $borderPen = [System.Drawing.Pen]::new((New-Color 48 "#163433"), 2)
  Stroke-RoundRect $g $x $y $w $h $r $borderPen
  $borderPen.Dispose()
}

function Draw-Wrapped($g, [string]$text, $font, $brush, [float]$x, [float]$y, [float]$w, [float]$h, [float]$lineSpacing = 1.0) {
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = [System.Drawing.StringAlignment]::Near
  $format.LineAlignment = [System.Drawing.StringAlignment]::Near
  $format.Trimming = [System.Drawing.StringTrimming]::Word
  $rect = [System.Drawing.RectangleF]::new($x, $y, $w, $h)
  $g.DrawString($text, $font, $brush, $rect, $format)
  $format.Dispose()
}

if (-not (Test-Path -LiteralPath $AssetDir)) {
  New-Item -ItemType Directory -Path $AssetDir | Out-Null
}

$bitmap = [System.Drawing.Bitmap]::new($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$bgRect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
$bgBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($bgRect, (New-Color 255 "#F7FBFA"), (New-Color 255 "#EEF6F2"), 135)
$g.FillRectangle($bgBrush, $bgRect)
$bgBrush.Dispose()

$orb1 = [System.Drawing.SolidBrush]::new((New-Color 28 "#218682"))
$g.FillEllipse($orb1, 1070, -80, 580, 420)
$orb1.Dispose()
$orb2 = [System.Drawing.SolidBrush]::new((New-Color 20 "#C54E60"))
$g.FillEllipse($orb2, 1340, 608, 360, 260)
$orb2.Dispose()

$gridPen = [System.Drawing.Pen]::new((New-Color 18 "#102626"), 1)
for ($x = 0; $x -lt $width; $x += 46) {
  $g.DrawLine($gridPen, $x, 0, $x, $height)
}
for ($y = 0; $y -lt $height; $y += 46) {
  $g.DrawLine($gridPen, 0, $y, $width, $y)
}
$gridPen.Dispose()

$fontFamily = "Microsoft YaHei UI"
$fontEyebrow = [System.Drawing.Font]::new($fontFamily, 24, [System.Drawing.FontStyle]::Bold)
$fontTitle = [System.Drawing.Font]::new($fontFamily, 78, [System.Drawing.FontStyle]::Bold)
$fontSubtitle = [System.Drawing.Font]::new($fontFamily, 34, [System.Drawing.FontStyle]::Bold)
$fontMetric = [System.Drawing.Font]::new($fontFamily, 30, [System.Drawing.FontStyle]::Bold)
$fontSmall = [System.Drawing.Font]::new($fontFamily, 18, [System.Drawing.FontStyle]::Bold)
$fontRibbonTitle = [System.Drawing.Font]::new($fontFamily, 30, [System.Drawing.FontStyle]::Bold)
$fontRibbon = [System.Drawing.Font]::new($fontFamily, 20, [System.Drawing.FontStyle]::Bold)
$fontFooter = [System.Drawing.Font]::new($fontFamily, 20, [System.Drawing.FontStyle]::Bold)

$teal = [System.Drawing.SolidBrush]::new((New-Color 255 "#197A74"))
$dark = [System.Drawing.SolidBrush]::new((New-Color 255 "#142828"))
$body = [System.Drawing.SolidBrush]::new((New-Color 255 "#2C4A4A"))
$muted = [System.Drawing.SolidBrush]::new((New-Color 255 "#5C7170"))
$white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
$cardBrush = [System.Drawing.SolidBrush]::new((New-Color 192 "#FFFFFF"))
$cardBorder = [System.Drawing.Pen]::new((New-Color 42 "#197A74"), 1.6)

Fill-RoundRect $g 84 76 520 58 29 $cardBrush
$textEyebrow = Utf8 "RkFNRSBLbm93bGVkZ2UgQWdlbnQgR2F0ZXdheQ=="
$textTitle = Utf8 "57uZIEFnZW50IOeUqOeahArmnKzlnLDlpJbohJE="
$textSubtitle = Utf8 "6K6p5bel5YW36LCD55So5pu056iz77yM6K6p5bel56iL6K6w5b+G5Y+v5aSN55So77yM6K6p55+l6K+G572R5Y+C5LiO6Lev57q/5Yik5pat44CC"
$textMetric1 = Utf8 "5Lit5paH5LiO6Iux5paH5a6e5py66K+E5rWL6YCa6L+H"
$textMetric2 = Utf8 "cm91dGUgcmVjb3JkcyDlj6/mjInojIPlm7TosIPnlKg="
$textMetric3 = Utf8 "TUNQIHRvb2xzIOaOpeWFpei/kOihjOaXtue9keWFsw=="
$textMetric4 = Utf8 "55+l6K+G572R5qOA5p+lIGVycm9ycyAvIHdhcm5pbmdz"
$textRibbonTitle = Utf8 "6Lev57q/44CB6K6w5b+G44CB5a6h5om544CB5aSx6LSl5pWZ6K6d"
$textRibbonBody = Utf8 "5oqK546w5pyJIENvZGluZyBBZ2VudCDmjqXliLDkuIDkuKrlj6/op4bljJbjgIHlj6/mianlsZXjgIHlj6/lrqHorqHnmoTlt6XnqIvnn6Xor4blsYLjgII="

$g.DrawString($textEyebrow, $fontEyebrow, $teal, 132, 88)
$markPen = [System.Drawing.Pen]::new((New-Color 255 "#197A74"), 5)
$g.DrawRectangle($markPen, 102, 94, 24, 24)
$markPen.Dispose()
Stroke-RoundRect $g 84 76 520 58 29 $cardBorder

$g.DrawString($textTitle, $fontTitle, $dark, 84, 164)
Draw-Wrapped $g $textSubtitle $fontSubtitle $body 84 350 650 115

$metrics = @(
  @("8/8", $textMetric1),
  @("2714", $textMetric2),
  @("15", $textMetric3),
  @("0", $textMetric4)
)

for ($i = 0; $i -lt $metrics.Count; $i++) {
  $col = $i % 2
  $row = [Math]::Floor($i / 2)
  $cx = 84 + ($col * 334)
  $cy = 500 + ($row * 108)
  Fill-RoundRect $g $cx $cy 310 86 14 $cardBrush
  Stroke-RoundRect $g $cx $cy 310 86 14 $cardBorder
  $g.DrawString($metrics[$i][0], $fontMetric, $teal, ($cx + 18), ($cy + 14))
  $g.DrawString($metrics[$i][1], $fontSmall, $muted, ($cx + 18), ($cy + 52))
}

$mainShot = [System.Drawing.Image]::FromFile($mainShotPath)
$brainShot = [System.Drawing.Image]::FromFile($brainShotPath)
Draw-ImageCover $g $mainShot 748 108 764 480 18
Draw-ImageCover $g $brainShot 662 522 548 308 18

$ribbonBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new([System.Drawing.Rectangle]::new(1128, 620, 390, 160), (New-Color 255 "#167C78"), (New-Color 255 "#114A4A"), 35)
Fill-RoundRect $g 1128 620 390 160 18 $ribbonBrush
$ribbonBrush.Dispose()
$g.DrawString($textRibbonTitle, $fontRibbonTitle, $white, 1154, 644)
$ribbonTextBrush = [System.Drawing.SolidBrush]::new((New-Color 220 "#FFFFFF"))
Draw-Wrapped $g $textRibbonBody $fontRibbon $ribbonTextBrush 1154 694 338 62
$ribbonTextBrush.Dispose()

Fill-RoundRect $g 1246 42 130 42 21 $cardBrush
$g.DrawString("Apache-2.0", $fontSmall, $teal, 1260, 52)
Fill-RoundRect $g 1388 42 92 42 21 $cardBrush
$g.DrawString("v0.1.0", $fontSmall, $teal, 1404, 52)

$g.DrawString("github.com/superalp1985/fame-knowledge-agent-gateway", $fontFooter, $muted, 84, 836)

$mainShot.Dispose()
$brainShot.Dispose()
$teal.Dispose()
$dark.Dispose()
$body.Dispose()
$muted.Dispose()
$white.Dispose()
$cardBrush.Dispose()
$cardBorder.Dispose()
$fontEyebrow.Dispose()
$fontTitle.Dispose()
$fontSubtitle.Dispose()
$fontMetric.Dispose()
$fontSmall.Dispose()
$fontRibbonTitle.Dispose()
$fontRibbon.Dispose()
$fontFooter.Dispose()

$bitmap.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bitmap.Dispose()

Write-Output $outPath
