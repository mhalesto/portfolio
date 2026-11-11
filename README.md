# halalisani.com

Portfolio of Halalisani Mbanjwa, full-stack developer and founder of CurrentTech, South Africa.

The home page is a scroll-driven 3D journey built with three.js. The seven iOS app icons lift off a
phone's home screen and fly down "the current" to their own interactive worlds. Client websites,
an about section and a finale where every app orbits a core follow them.

The phone's eighth slot is for visitors: they can name their own app idea, get a generated icon for
it on the phone and in the finale orbit, and email it from there. It is stored only in their browser
(`localStorage`); see `src/site/yourApp.js` and `src/site/components/YourAppDialog.js`.

The journey can also play itself. "Watch the tour" in the hero, and the play button on the chapter rail
(or the chapter picker on phones), scroll the page for the visitor: slowly through each pinned chapter
and quickly between them. Anything the visitor does takes over. See [The tour](#the-tour).

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Development server on http://localhost:3000 |
| `npm test` | Jest tests, including a check that every product, privacy, data-collection, support and terms route still renders |
| `npm run build` | Regenerates the static ClipAura, ResumeStudio, Smart Cleaner and Skystride pages, builds to `build/`, then (`scripts/postbuild.cjs`) gives every route without a static page its own copy of the app shell, so direct visits return 200 with the right title and canonical URL, and writes `sitemap.xml` |
| `npm run deploy` | Builds and publishes `build/` to the `gh-pages` branch (served at www.halalisani.com) |

## Where things live

```
src/
  site/                 Design system: tokens (site.css), header, footer, cursor, preloader,
                        smooth scroll (Lenis), shared ticker, and data.js with all portfolio content.
                        Also the tour (tour.js), page transitions (transition.js, RouteCurtain),
                        scroll memory for Back (scrollMemory.js) and the two fitting hooks
  experience/           three.js, loaded on demand only by Home and Projects
    core/               Engine (renderer, bloom, adaptive quality), Journey (scroll → camera
                        station), Interaction (raycast hover, drag, click and taps on empty space)
    objects/            Phone + home screen, icon slabs, the particle "current" (which parts
                        round the pointer and ripples when clicked), dust, backdrop
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

## The tour

`src/site/tour.js` does not animate the scene. It moves the scroll position, so the camera, the
icon launch and every reveal follow exactly as they do for a visitor who scrolls. Its pacing is
`TOUR_PLAN` in `src/pages/home/index.js`, one entry per section in page order:

| Field | Meaning |
| --- | --- |
| `hold` | Seconds to spend while the section is pinned |
| `reading` | Speed, in viewport heights per second, where the section's copy scrolls instead (the phone layout, About) |
| `end` | The tour stops this far (0 to 1) into this section's pin |

A new section needs an entry here, or the tour crosses it at travel speed. The tour is only offered
with the 3D scene, never with reduced motion, and pauses on any wheel, touch, press or scrolling key.

## Moving between pages

`RouteCurtain` covers the page that is leaving, changes the route underneath, then lifts away. It
takes over ordinary clicks on links to other pages of the site and leaves everything else to the
browser. Code that changes page without a link calls `travel(path, navigate)` from
`src/site/transition.js` to get the same exit. Back and Forward return to where each page was
scrolled; a link, or a reload, opens at the top.

## Layout that is measured, not guessed

- **Pinned panels** (`useFitPanels`): a chapter panel taller than its screen is scaled down just
  enough to fit. Below 540px of height chapters stop pinning and scroll instead.
- **The 3D phone on phones** (`measureStacked` in `src/experience/home.js`): the scene measures the
  gap the hero copy leaves under the header and frames the phone to fit it.
- **Opaque sections**: mark a block that fully hides the canvas with `data-cover`. While it fills
  the viewport the scene keeps simulating but stops drawing.
- **Footer wordmark** (`useFitText`): sized so its ink runs from gutter to gutter at any width.

Skystride's product, privacy, data-collection and support pages share content in
`src/pages/skystride-ios/content.json`; `npm run generate:skystride` creates their static copies.
Its listing lives in `additionalApps` and `portfolioApps` for Projects and navigation, leaving the
existing seven-app 3D home journey and visitor-created eighth icon unchanged. Its public status is
coming soon; add an App Store download link only when the app is released.
