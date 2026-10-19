# 3geeks.fr — vitrine studio

Site du studio **3geeks** : sites et produits digitaux, faits en France.

- Prod : [https://www.3geeks.fr](https://www.3geeks.fr) (Coolify + Traefik, pas Vercel)
- Repo : [Elias91120/WebGen](https://github.com/Elias91120/WebGen)
- Ancien domaine Vercel (`web-gen-lyart.vercel.app`) : redirect permanent vers `www.3geeks.fr` (`vercel.json`)

## Pages

Site multi-pages (une entrée HTML par page, servie par `nginx.conf` sur `/page` et `/page/`) :

| Page | HTML | Contenu |
| --- | --- | --- |
| Accueil `/` | `index.html` | Court, pour donner envie d’appeler en 30 s : hero, logos clients, « ce qu’on fait » (3 cartes), « comment ça marche » (3 étapes), 3 réalisations, contact |
| Offres `/offres` | `offres/index.html` | Offres et Option Sérénité, engagements, méthode animée (`#methode`), passerelle IA |
| Réalisations `/realisations` | `realisations/index.html` | Avant/après (`#avant-apres`), tous les projets (ancre = id du projet), lab, avis clients |
| Équipe `/equipe` | `equipe/index.html` | Fondateurs, apporteurs d’affaires, pourquoi nous, expertises |
| IA `/ia` | `ia/index.html` | Page autonome pour les entreprises (voir plus bas) |
| 17 OCTOBRE `/17-octobre` | `17-octobre/index.html` | Notre jeu vidéo : bande-annonce, captures, fabrication, bêta privée à télécharger (voir plus bas) |

- Cadre commun (header, footer, assistant, réservation, mentions légales) : `src/site/SiteLayout.tsx`. Sections : `src/site/sections.tsx`. Pages : `src/pages/pages.tsx`, une entrée par page dans `src/pages/entries/`.
- Nouvelle page : créer `<page>/index.html` (copie d’une page existante : titre, description, canonical, og), l’entrée dans `src/pages/entries/`, l’ajouter à `vite.config.ts` (`input`), à la regex de `nginx.conf`, au menu de `SiteLayout.tsx` et aux textes `site` de `src/i18n.ts`.
- Garder l’accueil court : le détail va sur les pages dédiées.

## Page IA pour entreprises (`/ia`)

Page à envoyer aux entreprises qui ont déjà un site : [www.3geeks.fr/ia](https://www.3geeks.fr/ia). Elle ne parle que des services IA et automatisation (intégration dans les logiciels existants, logistique, agents IA, documents et données, applications associées, cadrage et formation), sans la création de sites.

- Entrée Vite séparée (`ia/index.html` → `src/ia/main.tsx` → `src/ia/AiPage.tsx`), avec ses propres balises title/OG pour l’aperçu du lien partagé. Textes FR/EN dans `src/ia/copy.ts`.
- Servie par nginx sur `/ia` et `/ia/` depuis `dist/ia/index.html` (location dédiée dans `nginx.conf`).
- Réutilise le design, la réservation Calendly (sources `ia-*`), l’assistant (accueil et suggestions IA) et les mentions légales du site principal. Les deux en-têtes portent le même sélecteur à deux segments « Sites & applications | IA pour entreprises » à côté du logo (`src/components/SpaceSwitch.tsx`) : on voit de quel côté on est et on rebascule en un clic ; sur mobile, il est aussi en tête du menu, en deux grandes cartes.
- Pas de prix affiché : services sur devis après l’audit gratuit de 30 min.
- Le site principal y mène depuis la section « IA & automatisation » (`src/components/AiTeaser.tsx`, même convoyeur animé). Chaque domaine ouvre `/ia?service=<n>#vos-process` sur le bon service (ordre des `departments` dans `src/ia/copy.ts`).

## Le jeu vidéo : 17 OCTOBRE (`/17-octobre`)

Page du jeu du lab (code du jeu : dépôt séparé, `Desktop/Manif`). Elle est aussi en vedette dans « Le lab 3geeks » des Réalisations.

- Page : `src/game/GameSections.tsx`, textes FR/EN `src/game/copy.ts`, dans le cadre commun (`SiteLayout`, page `game`).
- Médias : bande-annonce `public/videos/17-octobre-trailer.mp4` (31 s, 1080p, ~10 Mo), captures et affiche dans
  `public/images/17-octobre/` (WebP 1600 et 640 px), image de partage `og.jpg` (1200 × 630).
- **Téléchargement** : libre depuis le 14/10 (un code d'accès ne revient que si `DOWNLOAD_CODE` est rempli). Le .zip
  n'est PAS dans ce dépôt : il est servi par l'app Coolify `17-octobre-fichiers` (`services/17-octobre/`, Node sans
  dépendance, volume persistant `/data`), routée par Traefik sur `https://www.3geeks.fr/17-octobre/fichiers` (la
  requête n'atteint jamais le nginx du site). Elle sert `version.json` (public : version, date, taille, notes, lu par
  la page et par le jeu) et le .zip (`/telecharger`, compté dans `stats.json`).
- **Compteur de téléchargements en direct** à côté des boutons de téléchargement : le total (toutes versions) est
  public sur `/telechargements` (`{"total": N}`) et poussé en direct sur `/telechargements/direct` (Server-Sent
  Events : le total à la connexion puis à chaque téléchargement, un ping toutes les 25 s pour Cloudflare). La page
  (`useDownloadCount` dans `GameSections.tsx`) ferme le flux quand l'onglet est caché et le rouvre au retour.
- Variables Coolify de cette app : `DOWNLOAD_CODE` (vide : téléchargement libre ; sinon le code, plusieurs séparés par des virgules),
  `UPLOAD_TOKEN` (envoi des versions). Une nouvelle version s'envoie depuis le dépôt du jeu : `tools/publish.ps1`.
- Elle héberge aussi le **relais du duel en ligne** (`relay.mjs`, WebSocket sans dépendance) sur
  `wss://www.3geeks.fr/17-octobre/fichiers/relais` : un code de 4 lettres réunit deux joueurs de la même version, le
  relais leur donne la même graine puis transmet leurs ordres sans les lire. Tester : `node services/17-octobre/test-relay.mjs`
  (local) ou `node services/17-octobre/test-relay.mjs wss://www.3geeks.fr/17-octobre/fichiers/relais` (production).
- Pas de webhook pour cette app : après un changement dans `services/17-octobre`, redéployer à la main dans Coolify.

## Motion design

Animations CSS ou `motion/react`, en pause hors écran et figées avec « réduire les animations ». À garder sobre : une pièce animée par section au plus.

- Convoyeur IA (`src/ia/AiConveyor.tsx`) : hero de `/ia` et section IA du site principal.
- Méthode du site principal (`src/components/BuildTimeline.tsx`) : un navigateur construit le site au fil des 5 étapes.
- Réalisations (`src/components/BeforeAfter/`) : curseur avant/après sur le site du Dr Jellouli. L’« avant » est une **reconstitution** codée en HTML (`OldJelloulSite.tsx`), pas l’ancien site réel : le libellé « reconstitution » doit rester visible. Le badge « Refait en 24 h » est dans `COPY` en haut de `BeforeAfter.tsx`.
- Démo de process et explorateur par service sur `/ia` (`src/ia/ProcessDemo.tsx`, `src/ia/AutomationExplorer.tsx`).

## Vitrine projets

Source unique : `src/components/ProjectsShowcase.tsx` (vignettes dans `src/assets/images/projects/`, logos du bandeau « Déjà en ligne » dans `src/assets/images/logos/`).

**Clients** — Cabinet Dr Amel Elloumi Jellouli, Express Divorce USA, Vipagence ([vipagence.net](https://www.vipagence.net/) : le site seulement), Two, Aurenza Capital, Green Jardin, CallKitchen, et deux plateformes privées (signature de contrats, mini-app Telegram) montrées en maquette, sans lien ni nom de client.

**Lab** — 3geeks Infra (volontairement floue), Prompt Hub, PromptOptim, EFREI Skill Hub.

## Prise de contact

Pas de formulaire : tous les boutons « parler de mon projet » ouvrent le calendrier Calendly de l’appel découverte dans notre propre fenêtre (`src/components/BookingModal.tsx`, état dans `src/lib/booking.ts`, sans le script Calendly). Le calendrier se précharge dès qu’on survole, touche ou sélectionne un bouton portant `data-booking="<source>"` (à mettre sur tout nouveau bouton de réservation), ou quand l’assistant propose un appel. Contact secondaire : contact@3geeks.fr et LinkedIn des cofondateurs.

## Assistant IA

Le widget (`src/components/AiAgentWidget.tsx`) appelle `/api/chat`, servi par un petit serveur Node (`server/`) qui garde la clé de l’API Hub 3geeks côté serveur : elle n’apparaît jamais dans le JavaScript public.

- **RAG** : `server/knowledge.mjs` = un bloc essentiel toujours envoyé + des fiches thématiques ; `server/chat.mjs` choisit les fiches utiles (BM25) pour chaque question. Le contexte du modèle étant limité, garder les fiches courtes. **Mettre à jour ces fiches quand le site change** (offres, projets, équipe, page IA : fiches `ai-services` et `ai-method`).
- **Modèles** : chaîne `ministral-14b-latest` → `ministral-8b-latest` (API Mistral, offre gratuite : seuls les « ministral » ont un quota, 30 et 188 req/min) → Hub (`qwen2.5:7b-instruct` via le passthrough Ollama). Un modèle qui refuse, plante ou ne répond pas en 8 s passe la main au suivant et est mis de côté 1 min. Le visiteur ne voit pas la bascule ; le journal indique `provider` et `failures`. `THREEGEEKS_MODEL=gateway` fait passer le Hub par `/v1`.
- **Garde-fous** : limites par IP (nginx + Node) et globale par jour, refus des détournements (prompt injection, code, maths), réponses fixes pour l’adresse et le téléphone, filtre de sortie (fuite des consignes, blocs de code). Le contenu des messages n’est ni journalisé ni stocké.
- **Prod** : nginx proxifie `/api/chat` vers `server/index.mjs` (lancé par `docker-start.sh`, port 127.0.0.1:8787).

## Local

```bash
npm install
npm run dev
```

Pour l’assistant en local, mettre les clés dans `.env` : `MISTRAL_API_KEY=` et `THREEGEEKS_API_KEY=` (`3gks_api=` est aussi accepté). Sans clé, le widget propose l’appel et l’e-mail.

Build : `npm run build` (Docker prod fait `npm ci` puis ce build).

| Variable (Coolify, runtime uniquement) | Rôle |
| --- | --- |
| `MISTRAL_API_KEY` | Fournisseur principal de l’assistant (API Mistral, réponse en ~1,5 s contre 10-25 s pour le Hub) |
| `MISTRAL_MODELS` | Optionnel : liste séparée par des virgules, défaut `ministral-14b-latest,ministral-8b-latest` |
| `THREEGEEKS_API_KEY` | Token de l’API Hub (api.3geeks.fr) : secours si Mistral échoue |
| `THREEGEEKS_MODEL` | Optionnel : autre modèle Ollama, ou `gateway` |
| `THREEGEEKS_API_BASE_URL` | Optionnel : défaut `https://api.3geeks.fr` |

## Deploy

Push sur `main` → webhook GitHub → Coolify app `3geeks-landing` (`hziiyov76znpv4lmokz16brb`) → health `https://www.3geeks.fr/health`.

- La compression gzip est faite par nginx (`nginx.conf`), pas par Traefik : la compression proxy cassait la lecture des vidéos sur iPhone.
- Après un changement de vidéo dans `public/videos/`, incrémenter `VIDEO_VERSION` dans `src/components/HeroVideo.tsx` (Cloudflare garde l’ancienne copie quelques heures).
