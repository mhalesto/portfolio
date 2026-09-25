# To do

## AI website builder (Lovable-style)

Someone signs up, describes their business and gets a one-page website they can keep editing by chat.

The "Your app" slot is a natural way in: next to "Email me about …", offer "Build a preview" that generates a
one-page site for the visitor's idea. It works as a demo and brings in leads.

### Stack

- **Model:** Claude through the Anthropic API. The Sonnet tier builds and edits pages, streamed so the user
  watches it build. The Haiku tier does small jobs such as site names, checking requests and alt text. Cache the
  long system prompt.
- **Accounts:** Firebase Auth (already in the stack).
- **Backend:** one Cloudflare Worker. It verifies the Firebase ID token, calls Claude, streams the page back and
  saves it. Workers bill CPU time, not time spent waiting on the model.
- **Storage:** R2 for the pages (no egress fees), D1 for users, projects and credits.
- **User sites:** the same Worker serves `*.<sites domain>` from R2. Later, Cloudflare for SaaS lets customers
  connect their own domains.

### Flow

1. Sign up and describe the business.
2. The Worker asks Claude for one self-contained HTML file: Tailwind, a fixed set of sections, placeholder
   images and no other scripts.
3. Save it to R2 and serve it at `name.<sites domain>`.
4. Edits: send the current page plus the request and get the updated page back. Keep versions for undo.

### Decide before launch

- User sites go on their own domain, never halalisani.com or currenttech.co.za, so a generated page can't
  phish or read cookies under our name.
- Abuse: check requests and output, rate-limit sign-ups, add a "report this site" link to every page.
- Costs: some free generations, then paid credits. Cap tokens per request.
- The Anthropic API key lives only as a Worker secret. Never put it in this repo or the React bundle, since the
  site is public on GitHub Pages.

### Needed to start

- Anthropic API key
- Cloudflare account and a domain for user sites
- Firebase project (the existing one is fine)

## Also

- Replace the PromoSecret preview (`public/experience/web-promosecret.webp`) with a real screenshot of
  promosecret.co.za. The current image is a card in its brand colours because the site couldn't be reached
  when it was added.
