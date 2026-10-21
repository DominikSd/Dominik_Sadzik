// Semantic targets plus an independent contract for future interactive maps.
export function getCursorZone(target) {
  if (!(target instanceof Element)) return { native: true };
  return {
    native: Boolean(
      target.closest(
        'input, textarea, select, option, [contenteditable]:not([contenteditable="false"]), iframe, dialog[open], [data-cursor="native"], :disabled, [aria-disabled="true"]',
      ),
    ),
    map: Boolean(target.closest('[data-cursor-zone="map"]')),
    dragging: Boolean(target.closest('[data-cursor-state="dragging"]')),
    hover: Boolean(
      target.closest(
        'a[href], button, summary, label[for], [role="button"], [role="link"], [data-cursor-target="node"]',
      ),
    ),
  };
}
