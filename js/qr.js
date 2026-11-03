// js/qr.js
// Helpers for the per-major QR code. Uses the bundled js/vendor/qrcode.js
// (MIT licence), so nothing is loaded from the internet and it works offline.

/**
 * Clean up a link typed by an admin.
 *  - ''     → no link
 *  - string → normalised http(s) address ("www.example.com" becomes "https://www.example.com/")
 *  - null   → not a valid web address
 */
function normaliseQrLink(value) {
  const text = String(value || '').trim();
  if (text === '') return '';
  if (text.length > 500) return null;

  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!url.hostname.includes('.') && url.hostname !== 'localhost') return null;
    return url.href;
  } catch (e) {
    return null;
  }
}

/** SVG markup for a QR code of `url`, or '' if it cannot be made. */
function buildQrSvg(url) {
  try {
    const qr = qrcode(0, 'M');          // auto size, medium error correction
    qr.addData(url);
    qr.make();
    return qr.createSvgTag({ scalable: true, cellSize: 4 });   // default margin = 4 modules (quiet zone)
  } catch (e) {
    return '';
  }
}

/** Draw the QR code for `url` into `container` (empty if there is no usable link). Returns true if drawn. */
function renderQr(container, url) {
  const clean = normaliseQrLink(url);
  const svg = clean ? buildQrSvg(clean) : '';
  container.innerHTML = svg;
  return svg !== '';
}
