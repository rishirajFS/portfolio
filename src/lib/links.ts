/**
 * Does this href leave the Next.js app?
 *
 * Three cases count as leaving: an absolute URL, a `mailto:` (or `tel:`), and a
 * path that ends in a file extension.
 *
 * That last one is the subtle one and it caused a real bug. `next/link`
 * prefetches its target as an RSC payload, so pointing one at a static file in
 * `public/` fires a request for `/Rishiraj_Nagarajan_Resume.pdf?_rsc=...`, which
 * 404s because the PDF is a file, not a route. The link still works when
 * clicked, so it fails quietly: a 404 in the console and a wasted edge request
 * on every page carrying a résumé button.
 *
 * Anything this returns true for must render as a plain `<a>`.
 */
export function leavesApp(href: string): boolean {
  if (/^(https?:|mailto:|tel:)/.test(href)) return true;
  // Strip hash and query before testing, so "/file.pdf#page=2" still matches.
  const path = href.split(/[#?]/)[0];
  return /\.[a-z0-9]{2,4}$/i.test(path);
}

/** Should this open in a new tab? Only true off-origin links, not local files. */
export function opensNewTab(href: string): boolean {
  return /^https?:/.test(href);
}
