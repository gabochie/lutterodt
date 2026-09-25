const LETTER_ALLOWED_TAGS = new Set([
  "html", "head", "meta", "title", "style", "body", "div", "p", "span", "strong",
  "em", "b", "i", "u", "br", "hr", "h1", "h2", "h3", "h4", "small",
  "blockquote", "ul", "ol", "li", "a", "img", "table", "thead", "tbody",
  "tr", "td", "th", "svg", "path", "circle", "rect", "line", "polyline",
  "polygon", "g",
]);

const LETTER_ALLOWED_ATTRS = new Set([
  "class", "style", "alt", "title", "width", "height", "href", "target",
  "rel", "viewbox", "fill", "stroke", "stroke-width", "d", "cx", "cy", "r",
  "x", "y", "x1", "y1", "x2", "y2", "rx", "ry", "points", "text-anchor",
  "font-size", "font-family", "colspan", "rowspan", "charset", "lang", "dir",
  "opacity", "stroke-linecap", "name", "content",
]);

const DANGEROUS_BLOCKS =
  /<\s*(script|iframe|object|embed|form|noscript|template|applet)\b[\s\S]*?(?:<\s*\/\s*\1\s*>|$)/gi;

const SAFE_URL = /^(?:https?:|mailto:|#|\/|\.\/|\.\.\/)/i;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function sanitizeLetterHtml(input: string): string {
  return input
    .replace(DANGEROUS_BLOCKS, "")
    .replace(
      /<\s*(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g,
      (_match, slash: string, rawName: string, rawAttrs: string) => {
        const name = rawName.toLowerCase();
        if (!LETTER_ALLOWED_TAGS.has(name)) return "";

        const kept: string[] = [];
        const attrPattern =
          /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
        let attr: RegExpExecArray | null;
        while ((attr = attrPattern.exec(rawAttrs)) !== null) {
          const attrName = attr[1].toLowerCase();
          if (!LETTER_ALLOWED_ATTRS.has(attrName)) continue;
          const value = attr[2] ?? attr[3] ?? attr[4] ?? "";
          if (attrName === "href" && !SAFE_URL.test(value.trim())) continue;
          if (attr[2] !== undefined) kept.push(`${attrName}="${attr[2]}"`);
          else if (attr[3] !== undefined) kept.push(`${attrName}='${attr[3]}'`);
          else if (value) kept.push(`${attrName}="${value}"`);
          else kept.push(attrName);
        }

        return `<${slash}${name}${kept.length ? " " + kept.join(" ") : ""}>`;
      }
    );
}
