// Page changes go through the route curtain when one is mounted: it covers
// the page that is leaving, swaps the route underneath, then lifts away.
// Anything that changes page without a link (an icon in the 3D orbit, say)
// calls travel() so it gets the same exit as a click on a link.

let leave = null;

// The curtain registers how to leave a page. Returns its own undo.
export function setLeaveHandler(handler) {
  leave = handler;
  return () => {
    if (leave === handler) leave = null;
  };
}

// Goes to a path. `navigate` is used directly when no curtain can play
// (reduced motion, no Web Animations, a test without the app shell).
export function travel(to, navigate) {
  if (leave && leave(to)) return;
  navigate(to);
}

const trim = path => path.replace(/\/+$/, '') || '/';

export const samePage = (a, b) => trim(a) === trim(b);

// Decides whether a click on a link is an ordinary move to another page of
// this site: the only kind the curtain takes over. Everything else (new
// tabs, downloads, other sites, files, in-page anchors) is left alone.
export function internalDestination(event, here = window.location) {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
  if (!anchor || typeof anchor.href !== 'string') return null;
  if ((anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return null;
  let url;
  try {
    url = new URL(anchor.href, here.href);
  } catch (error) {
    return null;
  }
  if (url.origin !== here.origin) return null;
  // Routes never end in an extension; anything that does is a file in public/.
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return null;
  if (samePage(url.pathname, here.pathname)) return null;
  return `${url.pathname}${url.search}${url.hash}`;
}
