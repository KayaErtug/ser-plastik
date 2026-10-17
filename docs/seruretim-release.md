# Ser Üretim / Mia release

## Ready in source

- Turkish/English UI, existing product photography and approved company details.
- Scroll-driven perspective card tunnel; 3D infinite marquee; rotating text; scroll reveal; count up; animated gradient; shimmer; pulse; hover lift/zoom; backdrop blur; product lightbox; modal fade/scale; smooth scroll.
- Reduced-motion alternatives and animation pause control. Lightbox uses native dialog focus containment and Escape handling.
- Mia chat with optional browser speech synthesis, Turkish/English voice selection, per-reply replay, stop control and silent text fallback on unsupported devices. Speech quality depends on installed browser/device voices. Voice input is not part of this release.
- Claude Messages API on the server only; no client API key. Existing session/rate limits remain. No automatic paid-provider fallback.
- Frontend production routing stays environment-driven. New release configuration targets the new API hostname.

## Required before public cutover

1. Confirm the exact legal company name; the existing approved company name remains until confirmed.
2. Configure the new domain, www and API A records to the intended Ubuntu host. Do not change mail/MX/SPF/DKIM or nameservers as a side effect.
3. Add separate Ser Üretim frontend/API Nginx sites and TLS; run nginx -t before every reload. Do not edit unrelated sites or EPH services.
4. Copy chat-backend/.env.example to the server-only .env, preserve existing mail settings, and privately add ANTHROPIC_API_KEY and an enabled ANTHROPIC_MODEL ID. Never put these in VITE_ variables.
5. Keep info@ser-plastik.com until a new mailbox is provisioned and verified. Buying a domain does not create a mailbox.
6. Build with the configured API URL, then verify HTTPS, both frontend CORS origins, real Claude responses, voice playback on actual Turkish/English devices and quotation delivery using an explicitly approved test.
7. Redirect the old public site only after the new site is accepted and access to the actual old frontend hosting is available. The old frontend was served through Plesk/LiteSpeed, not this repository's Ubuntu API site.

The design can be previewed without DNS changes. Claude is intentionally unavailable until the owner supplies credentials. Deployment must not be reported complete from source/CI checks alone.
