/**
 * SVG parsing and sanitisation utilities.
 *
 * These functions operate on raw SVG strings — no DOM required.
 * Safe for use in Node.js environments.
 */

/**
 * Strips XML/HTML comments from an SVG string.
 */
export function stripComments(svg: string): string {
  return svg.replace(/<!--[\s\S]*?-->/g, '');
}

/**
 * Collapses runs of whitespace-only text nodes (newlines, tabs) between tags.
 * Reduces file size without affecting rendering.
 */
export function trimWhitespace(svg: string): string {
  return svg.replace(/>\s+</g, '><').trim();
}

/**
 * Ensures the SVG has the required `xmlns` attribute for standalone embedding.
 */
export function ensureXmlns(svg: string): string {
  if (svg.includes('xmlns=')) return svg;
  return svg.replace(/<svg\b/, '<svg xmlns="http://www.w3.org/2000/svg"');
}

/**
 * Removes `<?xml ... ?>` processing instructions that are redundant for inline SVG.
 */
export function stripXmlDeclaration(svg: string): string {
  return svg.replace(/<\?xml[\s\S]*?\?>\s*/i, '');
}

/**
 * Removes `<!DOCTYPE ...>` declarations which are not needed for inline SVG.
 */
export function stripDoctype(svg: string): string {
  return svg.replace(/<!DOCTYPE[^>]*>/gi, '');
}

/**
 * Validates that the string appears to contain an SVG root element.
 * Throws if the content is clearly not an SVG.
 */
export function assertIsSvg(content: string, filePath: string): void {
  const hasRoot = /<svg[\s>]/i.test(content);
  if (!hasRoot) {
    throw new Error(
      `File does not appear to contain an SVG root element: ${filePath}`,
    );
  }
}

/**
 * Full SVG processing pipeline: strip declaration, doctype, comments,
 * normalise xmlns, and trim whitespace.
 */
export function processSvg(
  raw: string,
  filePath: string,
  options: { stripComments?: boolean; trimSvg?: boolean } = {},
): string {
  const { stripComments: doStripComments = true, trimSvg = true } = options;

  assertIsSvg(raw, filePath);

  let svg = raw;
  svg = stripXmlDeclaration(svg);
  svg = stripDoctype(svg);
  if (doStripComments) svg = stripComments(svg);
  svg = ensureXmlns(svg);
  if (trimSvg) svg = trimWhitespace(svg);
  return svg;
}
