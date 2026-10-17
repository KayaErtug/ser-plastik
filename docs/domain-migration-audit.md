# Domain migration audit

Scope: tracked repository references to `ser-plastik.com` and `api.ser-plastik.com`. Public domains are unchanged by this PR.

| Location | Class | Required action |
| --- | --- | --- |
| `src/api.ts` production routing | A | Address now comes exclusively from `VITE_API_BASE_URL`; no domain literal remains. Missing/blank production configuration throws before requests can be silently discarded by callers. |
| `.env.production` API URL | A | Current public configuration remains `https://api.ser-plastik.com`. Set `VITE_API_BASE_URL=https://api.seruretim.com` and rebuild/redeploy for migration. Vite embeds this value at build time. |
| `chat-backend/server.js` default CORS origins | A | Already overridden by `CORS_ORIGINS`. During migration configure both new frontend origins; keep old origins only for the agreed overlap period. Current defaults remain unchanged. |
| `chat-backend/intents/intentDetector.js` website intent term | B | Existing domain is an intentional recognition alias. Retain it and add the new domain during migration. |
| `.github/workflows/ci.yml` website-intent test message | B | Keep coverage for the old-domain alias; add coverage for the new alias when introduced. |
| `index.html` Open Graph URL/image, Twitter image, canonical URL, JSON-LD URL/logo | C | Update all absolute URLs together with the public domain launch. |
| `index.html` JSON-LD email | B | Current public email can remain. Change only if the mailbox is actually migrated. |
| `public/sitemap.xml` URL | C | Update to the new public domain and verify indexing/redirects. |
| `public/robots.txt` sitemap URL | C | Update with sitemap migration. |
| `public/llms.txt` official website | C | Update with the public domain launch. |
| `public/llms.txt` contact email | B | Retain until a new mailbox is provisioned and verified. |
| `chat-backend/ai/company_context.md` official website | C | Update with the public domain launch. |
| `chat-backend/ai/company_context.md` email | B | Retain until the mailbox migration is authorized. |
| `chat-backend/ai/ai_context.md` assistant website identity and scope | C | Update both domain references at launch. |
| `chat-backend/server.js` English/Turkish website replies | C | Update both public-facing domain references at launch. |
| `src/components/Contact.tsx` mailto and visible email | B | Intentional current contact content; update together only when the email address changes. |
| `src/components/Footer.tsx` mailto and visible email | B | Same mailbox migration condition. |
| This audit document | B | Historical inventory and migration instructions, not executable routing. |

A = environment/config driven. B = intentional public content/reference that can remain now. C = update at future domain migration.

## API migration verification

- Production ignores `VITE_API_URL`, including any obsolete Render value.
- Configure the new API hostname, TLS and backend `CORS_ORIGINS` before rebuilding the frontend.
- Verify chat and quotation requests target the configured API; preserve session headers and quotation keepalive behavior.
- No frontend API key is required or added.
- This PR changes no DNS, public-site URLs, backend configuration, dependency manifests or lockfiles.
