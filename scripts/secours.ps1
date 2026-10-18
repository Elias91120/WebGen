<#
.SYNOPSIS
  Le site de secours sur Vercel (Elias, 18/10 : « un deploy Vercel de secours, pour quand Coolify affiche bad
  gateway ») : la même page que www.3geeks.fr (le build Vite, statique), sur https://3geeks-secours.vercel.app, avec
  un bandeau « site de secours » et sans être indexé (X-Robots-Tag: noindex).

  Le jeu y reste téléchargeable (Elias : « on bloque les utilisateurs, ils peuvent même pas télécharger ») : le zip
  de la dernière version a son miroir, une release publique de ce dépôt (17-octobre-<version>, créée ici une fois par
  version), et le secours porte un relevé (secours/17-octobre.json : la version, ses notes, le miroir, le nombre de
  téléchargements) que la page lit quand le serveur de fichiers du Mac Mini ne répond pas. Le relevé vient du serveur
  s'il répond, sinon du zip et des notes de la version sur ce PC (le dernier nombre de téléchargements connu est gardé
  d'un déploiement à l'autre, ou passé par -Telechargements). Les classements et le compteur en direct reviennent avec
  le Mac Mini ; les téléchargements du miroir s'ajoutent au compteur du site.

  La bascule : infra/cloudflare/secours-worker.js (un Worker Cloudflare sur 3geeks.fr et www.3geeks.fr) renvoie vers
  ce secours quand l'origine répond 502/503/504/52x/530 ; scripts/bascule-secours.bat l'installe.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts/secours.ps1
  powershell -ExecutionPolicy Bypass -File scripts/secours.ps1 -Telechargements 142
#>
param(
    [int]$Telechargements = 0
)
$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$Deploy = Join-Path (Split-Path $Root -Parent) "3geeks-secours"   # (hors du dépôt : le dossier envoyé à Vercel)
$Bureau = Split-Path (Split-Path $Root -Parent) -Parent
$Manif = Join-Path $Bureau "Manif"       # (le dépôt des Actes : le zip publié, les notes de version)
$Hub = Join-Path $Bureau "Manif 2"       # (la fiche « Quoi de neuf » : le titre de la version)
$Fichiers = "https://www.3geeks.fr/17-octobre/fichiers"
$Depot = "Elias91120/WebGen"
$Utf8 = New-Object Text.UTF8Encoding $false

function Lire-Json([string]$url) {
    # (en octets puis UTF-8 : Windows PowerShell décode sinon les accents de travers)
    try {
        $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 8
        return ([Text.Encoding]::UTF8.GetString($r.RawContentStream.ToArray()) | ConvertFrom-Json)
    } catch {
        return $null
    }
}

Push-Location $Root
try {
    # 1. le relevé : la version et le nombre de téléchargements, du serveur s'il répond, sinon du zip et des notes d'ici
    $fichierReleve = Join-Path $Deploy "secours\17-octobre.json"
    $avant = if (Test-Path $fichierReleve) { Get-Content $fichierReleve -Raw -Encoding UTF8 | ConvertFrom-Json } else { $null }
    $info = Lire-Json "$Fichiers/version.json"
    $compte = Lire-Json "$Fichiers/telechargements"
    if (-not $info) {
        $proj = Get-Content (Join-Path $Manif "project.godot") -Raw -Encoding UTF8
        if ($proj -notmatch 'config/version="([^"]+)"') { throw "Version introuvable dans Manif/project.godot" }
        $v = $Matches[1]
        $nom = "17_OCTOBRE_v${v}_windows.zip"
        $zipLocal = Join-Path $Manif "build\$nom"
        if (-not (Test-Path $zipLocal)) { throw "$nom introuvable dans Manif/build" }
        $notes = @()
        $toutes = Get-Content (Join-Path $Manif "tools\release\notes.json") -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($toutes.PSObject.Properties.Name -contains $v) { $notes = @($toutes.$v) }
        $info = [pscustomobject]@{
            version = $v
            date = (Get-Item $zipLocal).LastWriteTime.ToString("yyyy-MM-dd")
            file = $nom
            size = (Get-Item $zipLocal).Length
            notes = $notes
        }
        $fiche = Join-Path $Hub "assets\actus\actus.json"
        if (Test-Path $fiche) {
            $entree = (Get-Content $fiche -Raw -Encoding UTF8 | ConvertFrom-Json) | Where-Object { $_.version -eq $v } | Select-Object -First 1
            if ($entree) { $info | Add-Member -NotePropertyName titre -NotePropertyValue ([string]$entree.titre) }
        }
        Write-Host "Le serveur de fichiers ne répond pas : la version $v vient du zip de ce PC." -ForegroundColor Yellow
    }
    $total = $null
    if ($compte -and $null -ne $compte.total) { $total = [int]$compte.total }
    elseif ($Telechargements -gt 0) { $total = $Telechargements }
    elseif ($avant -and $avant.telechargements) { $total = [int]$avant.telechargements }

    # 2. le miroir du zip : une release publique de ce dépôt, une fois par version
    $tag = "17-octobre-$($info.version)"
    & gh release view $tag -R $Depot --json tagName *> $null
    if ($LASTEXITCODE -ne 0) {
        $zipLocal = Join-Path $Manif "build\$($info.file)"
        if (-not (Test-Path $zipLocal)) { throw "Le miroir $tag manque, et $($info.file) n'est pas dans Manif/build." }
        $notesMiroir = Join-Path $env:TEMP "17octobre_miroir.md"
        $texte = "Le miroir de secours du t&eacute;l&eacute;chargement de **17 OCTOBRE $($info.version)** : le m&ecirc;me zip " +
            "que sur https://www.3geeks.fr/17-octobre, propos&eacute; par le site de secours quand le serveur principal ne " +
            "r&eacute;pond pas.`n`nGratuit, pour Windows 10 ou 11 (64 bits). Fiction satirique, d&eacute;conseill&eacute;e " +
            "aux moins de 12 ans.`n`nSHA-256 : ``$((Get-FileHash $zipLocal -Algorithm SHA256).Hash)``"
        [IO.File]::WriteAllText($notesMiroir, $texte, $Utf8)
        Write-Host "Le miroir $tag : envoi du zip ($([math]::Round((Get-Item $zipLocal).Length / 1MB, 1)) Mo)..."
        & gh release create $tag $zipLocal -R $Depot --title "17 OCTOBRE $($info.version) (miroir de secours)" `
            --notes-file $notesMiroir --latest=false
        if ($LASTEXITCODE -ne 0) { throw "La release $tag n'a pas été créée." }
    }
    $miroir = "https://github.com/$Depot/releases/download/$tag/$($info.file)"

    # 3. le build, copié hors du dépôt
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Le build a échoué." }
    if (Test-Path $Deploy) { Get-ChildItem $Deploy -Force | Where-Object { $_.Name -ne ".vercel" } | Remove-Item -Recurse -Force }
    New-Item -ItemType Directory -Force $Deploy | Out-Null
    Copy-Item (Join-Path $Root "dist\*") $Deploy -Recurse -Force

    $releve = [ordered]@{}
    foreach ($p in $info.PSObject.Properties) { $releve[$p.Name] = $p.Value }
    $releve["miroir"] = $miroir
    if ($null -ne $total) { $releve["telechargements"] = $total }
    $releve["releve"] = (Get-Date).ToString("s")
    New-Item -ItemType Directory -Force (Split-Path $fichierReleve -Parent) | Out-Null
    [IO.File]::WriteAllText($fichierReleve, ($releve | ConvertTo-Json -Depth 4), $Utf8)
    Write-Host ("Le relevé : version {0}, {1} téléchargements, miroir {2}" -f $info.version, $total, $miroir) -ForegroundColor Cyan

    # le bandeau du secours, en bas de chaque page (juste après <body>) ; les accents en entités HTML : ce script est lu
    # par Windows PowerShell, qui décode ses chaînes en ANSI (le 18/10 : « redÃ©marre » sur le bandeau)
    $bandeau = '<div id="secours-3geeks" style="position:fixed;z-index:2147483647;left:0;right:0;bottom:0;padding:10px 16px;' +
        'background:#fcc200;color:#120d00;font:600 14px/1.35 Inter,system-ui,sans-serif;text-align:center;' +
        'box-shadow:0 -6px 24px rgba(0,0,0,.35)">Site de secours : le serveur principal red&eacute;marre. Le jeu reste ' +
        't&eacute;l&eacute;chargeable ici ; les classements et le compteur en direct reviennent avec lui. ' +
        '<a href="https://www.3geeks.fr" style="color:#120d00;text-decoration:underline">R&eacute;essayer 3geeks.fr</a></div>'
    Get-ChildItem $Deploy -Recurse -Filter index.html | ForEach-Object {
        $html = [IO.File]::ReadAllText($_.FullName)
        $html = [regex]::Replace($html, '(<body[^>]*>)', ('$1' + $bandeau), 1)
        [IO.File]::WriteAllText($_.FullName, $html, $Utf8)
    }

    # les pages (comme nginx.conf : /page et /page/ servent dist/<page>/index.html), pas d'indexation, le relevé jamais
    # gardé en cache
    $config = @'
{
  "cleanUrls": false,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/(ia|offres|realisations|equipe|17-octobre)", "destination": "/$1/index.html" },
    { "source": "/(ia|offres|realisations|equipe|17-octobre)/", "destination": "/$1/index.html" }
  ],
  "headers": [
    { "source": "/(.*)", "headers": [ { "key": "X-Robots-Tag", "value": "noindex" } ] },
    { "source": "/assets/(.*)", "headers": [ { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ] },
    { "source": "/secours/(.*)", "headers": [ { "key": "Cache-Control", "value": "no-store" } ] }
  ]
}
'@
    [IO.File]::WriteAllText((Join-Path $Deploy "vercel.json"), $config, $Utf8)

    Push-Location $Deploy
    try {
        # (l'équipe Vercel d'Elias, celle du projet web-gen ; le projet s'appelle comme le dossier : 3geeks-secours)
        & vercel deploy --prod --yes --scope elias-projects-d6839b6f
        if ($LASTEXITCODE -ne 0) { throw "Le déploiement Vercel a échoué." }
    } finally {
        Pop-Location
    }
} finally {
    Pop-Location
}
