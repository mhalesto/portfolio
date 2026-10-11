// Runs after `react-scripts build`.
//
// GitHub Pages only answers a URL with 200 when a file exists for it. Routes
// without one fall through to 404.html, which bounces the visitor to the home
// page and back with a client-side redirect, so they are served as 404s and
// never indexed. This writes a copy of the app shell for every route in
// src/App.js that has no static page of its own, with that route's title,
// description and canonical URL, then writes sitemap.xml for all routes.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const build = path.join(root, "build");
const origin = "https://www.halalisani.com";
const email = "currenttech.co.za@gmail.com";

const escape = value =>
  String(value).replace(/[&<>"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);

// Shown to visitors without JavaScript and to crawlers that do not run it.
const fallback = (heading, body) =>
  `<noscript><div style="font-family:system-ui,sans-serif;padding:48px 24px;max-width:640px;color:#eceae4">` +
  `<h1>${escape(heading)}</h1>${body}` +
  `<p><a style="color:#f4c15d" href="/">Home</a> · <a style="color:#f4c15d" href="/projects/">Projects</a> · ` +
  `<a style="color:#f4c15d" href="/contact/">Contact</a></p></div></noscript>`;

const mail = `<a style="color:#f4c15d" href="mailto:${email}">${email}</a>`;

const pages = {
  "/projects": {
    title: "Projects — Halalisani Mbanjwa",
    description:
      "Every iOS app, client website and earlier project by Halalisani Mbanjwa and CurrentTech, with links to each app's privacy, data and support pages.",
    noscript: fallback(
      "Projects",
      `<p>iOS apps, client websites and earlier projects by Halalisani Mbanjwa at CurrentTech. Contact: ${mail}.</p>`,
    ),
  },
  "/contact": {
    title: "Contact — CurrentTech",
    description:
      "Project enquiries, app support, privacy questions, subscriptions and feedback for CurrentTech apps. Email currenttech.co.za@gmail.com.",
    noscript: fallback(
      "Contact CurrentTech",
      `<p>For app support, privacy questions, subscription issues, project questions, or feedback, email ${mail}.</p>` +
        `<p>Include the app name, device model, iOS version, and a short description of the issue so support can respond with the right context.</p>`,
    ),
  },
  "/projects/soundframe-studio": {
    title: "Soundframe Studio — Halalisani Mbanjwa",
    description:
      "Soundframe Studio turns any video into a clean audio track, then pairs it with a still image or slideshow. iOS first, Android in progress.",
  },
  "/projects/soundframe-studio/privacy": {
    title: "Soundframe Studio Privacy Policy",
    description:
      "Soundframe Studio processes your media on your device. It needs no sign-in, collects no personal information and has no ads or tracking.",
  },
  "/projects/soundframe-studio/data-collection": {
    title: "Soundframe Studio Data Collection",
    description:
      "Soundframe Studio does not collect, store or sell personal data. Audio extraction, editing and image processing happen on your device.",
  },
};

// Routes declared in App.js, without trailing slashes and without duplicates.
const appSource = fs.readFileSync(path.join(root, "src/App.js"), "utf8");
const routes = [
  ...new Set([...appSource.matchAll(/path=['"]([^'"]+)['"]/g)].map(match => match[1].replace(/(.)\/+$/, "$1"))),
];

const canonicalFor = route => `${origin}${route === "/" ? "/" : `${route}/`}`;
const fileFor = route => path.join(build, route, "index.html");

const shell = fs.readFileSync(fileFor("/"), "utf8");

const setMeta = (html, attribute, name, value) => {
  const pattern = new RegExp(`(<meta ${attribute}="${name}" content=")[^"]*(")`);
  if (!pattern.test(html)) throw new Error(`index.html has no <meta ${attribute}="${name}">`);
  return html.replace(pattern, `$1${escape(value)}$2`);
};

const shellFor = (route, page) => {
  const canonical = canonicalFor(route);
  let html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`);
  html = setMeta(html, "name", "description", page.description);
  html = setMeta(html, "property", "og:url", canonical);
  html = setMeta(html, "property", "og:title", page.title);
  html = setMeta(html, "property", "og:description", page.description);
  html = setMeta(html, "name", "twitter:title", page.title);
  html = setMeta(html, "name", "twitter:description", page.description);
  if (page.noscript) html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, page.noscript);
  return html;
};

const written = [];
routes.forEach(route => {
  if (route === "/" || fs.existsSync(fileFor(route))) return;
  const page = pages[route];
  if (!page) throw new Error(`No title or description for ${route}. Add it to scripts/postbuild.cjs.`);
  fs.mkdirSync(path.dirname(fileFor(route)), { recursive: true });
  fs.writeFileSync(fileFor(route), shellFor(route, page));
  written.push(route);
});

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map(route => `  <url><loc>${canonicalFor(route)}</loc></url>\n`).join("") +
  `</urlset>\n`;
fs.writeFileSync(path.join(build, "sitemap.xml"), sitemap);

console.log(`App shell written for ${written.join(", ") || "no routes"}; sitemap.xml lists ${routes.length} URLs.`);
