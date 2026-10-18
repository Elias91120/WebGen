@echo off
rem La bascule de secours de 3geeks.fr : quand le Mac Mini ne repond plus (502), les visiteurs partent tout seuls
rem sur https://3geeks-secours.vercel.app. Double-clic : Cloudflare s'ouvre dans le navigateur (clique sur
rem « Allow »), puis le Worker est installe sur 3geeks.fr et www.3geeks.fr. A ne faire qu'une fois.
cd /d "%~dp0..\infra\cloudflare"
call npx --yes wrangler login
if errorlevel 1 goto erreur
call npx --yes wrangler deploy
if errorlevel 1 goto erreur
echo.
echo La bascule de secours est installee.
pause
exit /b 0
:erreur
echo.
echo Ca n'a pas marche : envoie une capture de cette fenetre a Claude.
pause
exit /b 1
