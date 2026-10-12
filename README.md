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

Pas de formulaire : tous les boutons « parler de mon projet » ouvrent le calendrier Calendly de l’appel découverte dans notre propre fenêtre (`src/components/BookingModal.tsx`, état dans `src/lib/booking.ts`, sans le script Calendly). Le calendrier se précharge dès qu’on survole, touche ou sélectionne un bouton portant `data-booking="<source>"` (à mettre sur tout nouveau bouton de réservation), ou quand l’assistant propose un appel. Contact secondaire : contact@3geeks.fr et LinkedIn des cofondateurs.

## Assistant IA

Le widget (`src/components/AiAgentWidget.tsx`) appelle `/api/chat`, servi par un petit serveur Node (`server/`) qui garde la clé de l’API Hub 3geeks côté serveur : elle n’apparaît jamais dans le JavaScript public.

- **RAG** : `server/knowledge.mjs` = un bloc essentiel toujours envoyé + des fiches thématiques ; `server/chat.mjs` choisit les fiches utiles (BM25) pour chaque question. Le contexte du modèle étant limité, garder les fiches courtes. **Mettre à jour ces fiches quand le site change** (offres, projets, équipe).
- **Modèle** : `qwen2.5:7b-instruct` via le passthrough Ollama du Hub (bien meilleur en français que le modèle par défaut du Hub). `THREEGEEKS_MODEL=gateway` repasse par `/v1` avec le mode du token.
- **Garde-fous** : limites par IP (nginx + Node) et globale par jour, refus des détournements (prompt injection, code, maths), réponses fixes pour l’adresse et le téléphone, filtre de sortie (fuite des consignes, blocs de code). Le contenu des messages n’est ni journalisé ni stocké.
- **Prod** : nginx proxifie `/api/chat` vers `server/index.mjs` (lancé par `docker-start.sh`, port 127.0.0.1:8787).

## Local

```bash
npm install
npm run dev
```

Pour l’assistant en local, mettre la clé dans `.env` (`THREEGEEKS_API_KEY=` ; `3gks_api=` est aussi accepté). Sans clé, le widget propose l’appel et l’e-mail.

Build : `npm run build` (Docker prod fait `npm ci` puis ce build).

| Variable (Coolify, runtime uniquement) | Rôle |
| --- | --- |
| `THREEGEEKS_API_KEY` | Token de l’API Hub (api.3geeks.fr) utilisé par l’assistant |
| `THREEGEEKS_MODEL` | Optionnel : autre modèle Ollama, ou `gateway` |
| `THREEGEEKS_API_BASE_URL` | Optionnel : défaut `https://api.3geeks.fr` |

## Deploy

Push sur `main` → webhook GitHub → Coolify app `3geeks-landing` (`hziiyov76znpv4lmokz16brb`) → health `https://www.3geeks.fr/health`.

- La compression gzip est faite par nginx (`nginx.conf`), pas par Traefik : la compression proxy cassait la lecture des vidéos sur iPhone.
- Après un changement de vidéo dans `public/videos/`, incrémenter `VIDEO_VERSION` dans `src/components/HeroVideo.tsx` (Cloudflare garde l’ancienne copie quelques heures).
