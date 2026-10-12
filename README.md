# 3geeks.fr — vitrine studio

Landing du studio **3geeks** : sites et produits digitaux, faits en France.

- Prod : [https://www.3geeks.fr](https://www.3geeks.fr) (Coolify + Traefik, pas Vercel)
- Repo : [Elias91120/WebGen](https://github.com/Elias91120/WebGen)
- Ancien domaine Vercel (`web-gen-lyart.vercel.app`) : redirect permanent vers `www.3geeks.fr` (`vercel.json`)

## Vitrine projets

Source unique : `src/components/ProjectsShowcase.tsx` (vignettes dans `src/assets/images/projects/`, logos du bandeau « Déjà en ligne » dans `src/assets/images/logos/`).

**Clients** — Cabinet Dr Amel Elloumi Jellouli, Express Divorce USA, Vipagence ([vipagence.net](https://www.vipagence.net/) : le site seulement), Two, Aurenza Capital, Green Jardin, CallKitchen, et deux plateformes privées (signature de contrats, mini-app Telegram) montrées en maquette, sans lien ni nom de client.

**Lab** — 3geeks Infra (volontairement floue), Prompt Hub, PromptOptim, EFREI Skill Hub.

## Prise de contact

Pas de formulaire ni de backend : tous les boutons « parler de mon projet » ouvrent l’appel découverte Calendly (`src/lib/booking.ts`). Contact secondaire : contact@3geeks.fr et LinkedIn des cofondateurs.

## Local

```bash
npm install
npm run dev
```

Build : `npm run build` (Docker prod fait `npm ci` puis ce build). Aucune variable d’environnement nécessaire.

## Deploy

Push sur `main` → webhook GitHub → Coolify app `3geeks-landing` (`hziiyov76znpv4lmokz16brb`) → health `https://www.3geeks.fr/health`.

- La compression gzip est faite par nginx (`nginx.conf`), pas par Traefik : la compression proxy cassait la lecture des vidéos sur iPhone.
- Après un changement de vidéo dans `public/videos/`, incrémenter `VIDEO_VERSION` dans `src/components/HeroVideo.tsx` (Cloudflare garde l’ancienne copie quelques heures).
