<#
.SYNOPSIS
  Le site de secours sur Vercel (Elias, 18/10 : « un deploy Vercel de secours, pour quand Coolify affiche bad
  gateway ») : la même page que www.3geeks.fr (le build Vite, statique), sur https://3geeks-secours.vercel.app, avec
  un bandeau « site de secours » et sans être indexé (X-Robots-Tag: noindex). Ce qui dépend du Mac Mini (le
  téléchargement du jeu, le classement, l'assistant) revient avec lui.

  La bascule : infra/cloudflare/secours-worker.js (un Worker Cloudflare sur 3geeks.fr et www.3geeks.fr) renvoie vers
  ce secours quand l'origine répond 502/503/504/52x/530.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts/secours.ps1
#>
$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$Deploy = Join-Path (Split-Path $Root -Parent) "3geeks-secours"   # (hors du dépôt : le dossier envoyé à Vercel)
Push-Location $Root
try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Le build a échoué." }
    if (Test-Path $Deploy) { Get-ChildItem $Deploy -Force | Where-Object { $_.Name -ne ".vercel" } | Remove-Item -Recurse -Force }
    New-Item -ItemType Directory -Force $Deploy | Out-Null
    Copy-Item (Join-Path $Root "dist\*") $Deploy -Recurse -Force

    # le bandeau du secours, en haut de chaque page (juste après <body>)
    $bandeau = '<div id="secours-3geeks" style="position:fixed;z-index:2147483647;left:0;right:0;bottom:0;padding:10px 16px;' +
        'background:#fcc200;color:#120d00;font:600 14px/1.35 Inter,system-ui,sans-serif;text-align:center;' +
        'box-shadow:0 -6px 24px rgba(0,0,0,.35)">Site de secours : le serveur principal redémarre. Le téléchargement du jeu ' +
        'et les classements reviennent dans quelques minutes. <a href="https://www.3geeks.fr" style="color:#120d00;' +
        'text-decoration:underline">Réessayer 3geeks.fr</a></div>'
    Get-ChildItem $Deploy -Recurse -Filter index.html | ForEach-Object {
        $html = [IO.File]::ReadAllText($_.FullName)
        $html = [regex]::Replace($html, '(<body[^>]*>)', ('$1' + $bandeau), 1)
        [IO.File]::WriteAllText($_.FullName, $html, (New-Object Text.UTF8Encoding $false))
    }

    # les pages (comme nginx.conf : /page et /page/ servent dist/<page>/index.html), pas d'indexation
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
    { "source": "/assets/(.*)", "headers": [ { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ] }
  ]
}
'@
    [IO.File]::WriteAllText((Join-Path $Deploy "vercel.json"), $config, (New-Object Text.UTF8Encoding $false))

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
