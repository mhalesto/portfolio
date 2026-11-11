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

// The URL an ordinary click on a link would open, when it is a page of this
// site. Anything that is not a plain click on a plain link (new tabs,
// modifier keys, downloads, other sites, files in public/) gives null.
function ownPage(event, here) {
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
  return url;
}

// Decides whether a click on a link is an ordinary move to another page of
// this site: the only kind the curtain takes over. Everything else (new
// tabs, downloads, other sites, files, in-page anchors) is left alone.
export function internalDestination(event, here = window.location) {
  const url = ownPage(event, here);
  if (!url || samePage(url.pathname, here.pathname)) return null;
  return `${url.pathname}${url.search}${url.hash}`;
}

// A plain link to the page the visitor is already on (the logo on Home, the
// current item in the nav). The router would add a second history entry for
// the same page and change nothing on screen; the useful meaning is "take me
// back to the top". A link with a #target is an in-page jump and is not this.
export function isLinkToThisPage(event, here = window.location) {
  const url = ownPage(event, here);
  return Boolean(url) && samePage(url.pathname, here.pathname) && !url.hash && url.search === here.search;
}
