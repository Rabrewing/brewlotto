### Setup Steps

1. Clone repo: `git clone https://github.com/<org>/brewgold`
2. Install deps: `pnpm install`
3. Copy `.env.local.example` → `.env.local`
4. Fill Supabase + AI provider keys
5. Run local Supabase instance
6. Start dev: `pnpm dev`

### Environment Variables (no secrets)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE=
AI_PROVIDER=
OPENAI_API_KEY=
OPENAI_MODEL=
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=
NVIDIA_NIM_KEY=
GOOGLE_TTS_KEY=
```

`AI_PROVIDER` supports `auto`, `openai`, or `deepseek`. In `auto`, the app prefers DeepSeek when its key is present, otherwise it falls back to OpenAI.

### Commands

* `pnpm dev` — Run local dev
* `pnpm build` — Build for production
* `pnpm lint` — Format & validate

### PWA Setup Steps

1.  **Install `next-pwa`:**
    ```bash
    pnpm add next-pwa
    ```
2.  **Configure `next.config.js`:**
    ```javascript
    // next.config.js
    const withPWA = require('next-pwa')({
      dest: 'public',
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === 'development', // enable in prod
      fallbacks: {
        image: '/icons/icon-192.png',
        document: '/offline.html',
      },
    });

    module.exports = withPWA({
      reactStrictMode: true,
      experimental: {
        // keep as needed for your Next version
      },
    });
    ```
3.  **Create `public/manifest.webmanifest`:**
    ```json
    {
      "name": "BrewLotto",
      "short_name": "BrewLotto",
      "description": "AI-powered lottery insights, strategies, and smart picks.",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#181818",
      "theme_color": "#FFD700",
      "orientation": "portrait",
      "icons": [
        { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
        { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
        { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
      ]
    }
    ```
4.  **Update `app/layout.tsx` metadata:**
    ```javascript
    export const metadata = {
      title: "BrewLotto",
      description: "AI-powered lottery insights and smart picks.",
      manifest: "/manifest.webmanifest",
      themeColor: "#FFD700",
      icons: {
        icon: "/icons/icon-192.png",
        apple: "/icons/icon-192.png",
      },
    };
    ```
5.  **Add placeholder icons:** Create `public/icons/icon-192.png`, `public/icons/icon-512.png`, and `public/icons/maskable-512.png`.
6.  **Create `public/offline.html`:** A simple branded page for offline fallback.
