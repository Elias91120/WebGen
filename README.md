# 3geeks.fr — vitrine studio

Landing du studio **3geeks** : sites et produits digitaux, faits en France.

- Prod : [https://www.3geeks.fr](https://www.3geeks.fr) (Coolify + Traefik, pas Vercel)
- Repo : [Elias91120/WebGen](https://github.com/Elias91120/WebGen)
- Ancien domaine Vercel (`web-gen-lyart.vercel.app`) : redirect permanent vers `www.3geeks.fr` (`vercel.json`)

## Vitrine projets

Source unique : `src/components/ProjectsShowcase.tsx`.

**Clients** — Express Divorce USA, Vipagence ([vipagence.net](https://www.vipagence.net/) : le site seulement), CallKitchen, Two, Green Jardin.

**Studio public** — Prompt Hub, PromptOptim, une carte Infra volontairement floue (pas de lien, pas de stack, pas d’outils internes).

Hors vitrine : Workspace, API Hub, trading, Filament, Harmony, VIPA / api-vipa, chat.

## Local

```bash
npm install
npm run dev
```

Build : `npm run build` (Docker prod fait `npm ci` puis ce build).

Variables optionnelles : voir `.env.example` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, clé Gemini pour le widget).

## Deploy

Push `main` → Coolify app `3geeks-landing` (`hziiyov76znpv4lmokz16brb`) → health `https://www.3geeks.fr/health`.
