import { clamp, easeInOutSine } from '../utils/math';

// Converts the page's scroll position into a continuous "station" value.
// Every DOM section marked data-station="k" becomes an anchor: when the
// section is centred in the viewport the camera sits exactly at station k.
// Sections with data-hold keep the camera parked while their sticky content
// is pinned, then the camera travels to the next station between sections.
export class Journey {
  constructor(root) {
    this.root = root;
    this.anchors = [];
    this.holds = new Map();
    this.covers = [];
    // Set by the scene to re-frame its worlds whenever the page is re-measured.
    this.onMeasure = null;
    this.measure();
    this.observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => this.measure()) : null;
    if (this.observer) this.observer.observe(root);
  }

  measure() {
    const viewport = window.innerHeight;
    const scrollY = window.scrollY;
    const anchors = [];
    this.holds.clear();

    this.root.querySelectorAll('[data-station]').forEach(element => {
      const station = parseFloat(element.getAttribute('data-station'));
      const rect = element.getBoundingClientRect();
      const top = rect.top + scrollY;
      const height = rect.height;
      const centre = top + height / 2 - viewport / 2;

      if (element.hasAttribute('data-hold')) {
        const share = parseFloat(element.getAttribute('data-hold')) || 0.7;
        const span = Math.max(0, height - viewport) * share;
        anchors.push({ scroll: centre - span / 2, station }, { scroll: centre + span / 2, station });
        this.holds.set(station, { start: top, end: top + Math.max(1, height - viewport) });
      } else {
        anchors.push({ scroll: centre, station });
      }
    });

    anchors.sort((a, b) => a.scroll - b.scroll);
    this.anchors = anchors;

    // Opaque blocks ([data-cover]) that sit in front of the canvas. Blocks
    // that touch are merged into one span.
    const covers = [];
    this.root.querySelectorAll('[data-cover]').forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.height > 0) covers.push({ top: rect.top + scrollY, bottom: rect.bottom + scrollY });
    });
    covers.sort((a, b) => a.top - b.top);
    this.covers = covers.reduce((spans, cover) => {
      const last = spans[spans.length - 1];
      if (last && cover.top <= last.bottom + 1) last.bottom = Math.max(last.bottom, cover.bottom);
      else spans.push({ ...cover });
      return spans;
    }, []);

    if (this.onMeasure) this.onMeasure();
  }

  // True while an opaque block fills a viewport of the given height, so
  // nothing drawn on the canvas could be seen.
  isCovered(scroll, viewport) {
    for (let i = 0; i < this.covers.length; i += 1) {
      const cover = this.covers[i];
      if (scroll >= cover.top && scroll + viewport <= cover.bottom) return true;
    }
    return false;
  }

  stationAt(scroll) {
    const anchors = this.anchors;
    if (!anchors.length) return 0;
    if (scroll <= anchors[0].scroll) return anchors[0].station;
    const last = anchors[anchors.length - 1];
    if (scroll >= last.scroll) return last.station;
    for (let i = 0; i < anchors.length - 1; i += 1) {
      const a = anchors[i];
      const b = anchors[i + 1];
      if (scroll >= a.scroll && scroll <= b.scroll) {
        if (a.station === b.station || b.scroll === a.scroll) return a.station;
        const t = (scroll - a.scroll) / (b.scroll - a.scroll);
        return a.station + (b.station - a.station) * easeInOutSine(t);
      }
    }
    return last.station;
  }

  // 0..1 while a held section's sticky content is pinned.
  holdProgress(station, scroll) {
    const hold = this.holds.get(station);
    if (!hold) return 0;
    return clamp((scroll - hold.start) / (hold.end - hold.start));
  }

  dispose() {
    if (this.observer) this.observer.disconnect();
  }
}
