# halalisani.com

Portfolio of Halalisani Mbanjwa, full-stack developer and founder of CurrentTech, South Africa.

The home page is a scroll-driven 3D journey built with three.js. The seven iOS app icons lift off a
phone's home screen and fly down "the current" to their own interactive worlds. Client websites,
an about section and a finale where every app orbits a core follow them.

The phone's eighth slot is for visitors: they can name their own app idea, get a generated icon for
it on the phone and in the finale orbit, and email it from there. It is stored only in their browser
(`localStorage`); see `src/site/yourApp.js` and `src/site/components/YourAppDialog.js`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Development server on http://localhost:3000 |
| `npm test` | Jest tests, including a check that every product, privacy, data-collection, support and terms route still renders |
| `npm run build` | Regenerates the static ClipAura, ResumeStudio and Smart Cleaner pages, then builds to `build/` |
| `npm run deploy` | Builds and publishes `build/` to the `gh-pages` branch (served at www.halalisani.com) |

## Where things live

```
src/
  site/                 Design system: tokens (site.css), header, footer, cursor, preloader,
                        smooth scroll (Lenis), shared ticker, and data.js with all portfolio content
  experience/           three.js, loaded on demand only by Home and Projects
    core/               Engine (renderer, bloom, adaptive quality), Journey (scroll → camera
                        station), Interaction (raycast hover, drag and click)
    objects/            Phone + home screen, icon slabs, the particle "current", dust, backdrop
    worlds/             One interactive world per app, plus the web-work panes and the finale
    home.js / orbit.js  Scene assembly for the home journey and the Projects header
  pages/home|projects|contact   The immersive pages
  pages/*-ios, pages/soundframe Product, privacy, data-collection, support and terms pages (unchanged)
public/
  projects/**           Static copies of the product and policy pages served on direct visits
  experience/           Optimised WebP icons, the ClipAura reel and web-project previews
```

To add an app, add it to `apps` in `src/site/data.js`, drop a 512px WebP icon in
`public/experience/`, and register a world class for its slug in `src/experience/home.js`.

The 3D layer is progressive enhancement. Without WebGL, or with reduced motion, every page still
renders its full content, and the canvas is hidden from assistive technology.
