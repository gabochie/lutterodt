import { describe, expect, it } from "vitest";
import { escapeHtml, sanitizeLetterHtml } from "@/lib/outreach/sanitize";

describe("escapeHtml", () => {
  it("escapes markup metacharacters", () => {
    expect(escapeHtml('<a href="x">\'&\'</a>')).toBe(
      "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;"
    );
  });
});

describe("sanitizeLetterHtml", () => {
  it("strips script blocks entirely", () => {
    const out = sanitizeLetterHtml('<p>hi</p><script>alert(1)</script>');
    expect(out).not.toContain("script");
    expect(out).toContain("<p>hi</p>");
  });

  it("strips iframe/object/embed/form blocks", () => {
    const out = sanitizeLetterHtml(
      '<p>ok</p><iframe src="https://evil.example"></iframe><form action="/x"></form>'
    );
    expect(out).not.toContain("iframe");
    expect(out).not.toContain("<form");
    expect(out).toContain("<p>ok</p>");
  });

  it("drops javascript: hrefs but keeps https links", () => {
    const out = sanitizeLetterHtml(
      '<a href="javascript:alert(1)">x</a><a href="https://lutterodt.org">y</a>'
    );
    expect(out).not.toContain("javascript:");
    expect(out).toContain('href="https://lutterodt.org"');
  });

  it("drops non-allowlisted attributes like onerror", () => {
    const out = sanitizeLetterHtml('<p style="color:red" onerror="alert(1)">x</p>');
    expect(out).not.toContain("onerror");
    expect(out).toContain("style");
  });

  it("drops non-allowlisted tags but keeps their text", () => {
    const out = sanitizeLetterHtml("<section><p>text</p></section>");
    expect(out).not.toContain("section");
    expect(out).toContain("<p>text</p>");
  });
});
