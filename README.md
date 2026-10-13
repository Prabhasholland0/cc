# Clean Corners

## Local development

1. Install dependencies with `npm install`.
2. Set `ADMIN_SECRET` in your local environment or a local `.env` file to a private staff passcode. There is no built-in staff password. Do not commit your secret.
3. Run `npm run server` for the API (port 3001).
4. Run `npm run dev` for the website. Vite proxies `/api` to the API.

`npm run build` generates the production frontend. `npm run start` serves it with the API on loopback; configure a reverse proxy for deployment. The server binds to 127.0.0.1.

## Verification

`npm test` runs shared-price and API integration checks against an isolated temporary data directory and a random local port. No real enquiries or business rates are changed. A test-only staff secret is generated in memory. The test covers persisted submissions, duplicate retries, price mismatches, appointment confirmation, staff updates, and network failures.

`DATA_DIR` can override the JSON storage directory. Back up production data. This storage is intended for a single server process; use a database before running multiple replicas.

## Pricing and booking

Package prices, service minimums, global visit minimum, and the priority fee come from the same pricing configuration. `src/lib/pricing.ts` calculates both browser estimates and server records. Starting rates are derived from package rates. The server rejects stale estimates and never trusts a submitted service name or total alone.

A request progresses through Choose service, Home details, and Contact & preferred date. Only a successful API response creates the received state. Retries with the same request ID do not create duplicates. A request is not an appointment until staff confirms availability and saves the agreed date and time.

Staff can filter queues, assign a team, set follow-up dates, add notes, confirm appointments, and export CSV. Set the passcode using ADMIN_SECRET; it is sent in request headers, not URLs. Launch review is inside the authenticated portal.

## Genuine photos and reviews

The proof section intentionally stays hidden until real content is supplied. Add locally hosted before/after images, approved reviews, and team/equipment photos to `src/data/customerProof.ts`. Put assets under `public/`, use their `/...` URLs, include meaningful captions and service IDs, and set `consentConfirmed: true` only after permission is recorded. Never present stock images as customer work. Proof appears on the homepage and relevant service pages.

## Service pages

Shareable routes are `/services/full-home`, `/services/kitchen`, `/services/bathroom`, `/services/sofa-carpet`, `/services/painting`, `/services/water-tank`, and `/services/express-addons`. The included server and Vite both support direct navigation and refresh. Other static hosts need an SPA rewrite to `index.html` for these routes. Page titles and descriptions update in the browser; full server rendering for search and social previews is not included.

## Owner alerts

The owner hears about new activity in three ways:

1. **Email (instant).** Set `SMTP_USER`, `SMTP_PASS` and `ALERT_EMAIL_TO` in `.env` (see `.env.example`). The server then emails every new booking, callback request, online cancellation and reschedule request, with the customer's name, phone, service and dates. When the server starts it logs whether alerts are on. If an email fails, the customer's request is still saved.
2. **WhatsApp (customer-sent).** After booking, customers can tap "Send booking on WhatsApp" to send the full booking and its reference to 95154 47834. The booking form also offers "Book on WhatsApp instead". Fully automatic WhatsApp alerts need Meta's paid WhatsApp Business API and are not included.
3. **Staff portal.** While the portal is open it checks every minute, chimes, and can show a pop-up notification ("Turn on pop-up alerts").

## Customer tracking

Customers can open `/track` with their booking reference and mobile number to see the status, request a reschedule, or cancel up to the day before the visit. Staff see these requests flagged in the portal.
