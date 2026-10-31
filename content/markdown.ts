// Turns the Markdown body of a content file into HTML for the project pages.
// The files are ours (checked into the repo), but raw HTML in them is still
// shown as text instead of being passed through, so a stray "<" can't break the page.
import { Marked } from "marked";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const marked = new Marked({
  async: false,
  renderer: {
    html: ({ text }) => escape(text),
    // Tailwind classes live here (not in the Markdown) so the look matches the rest of the site.
    paragraph({ tokens }) {
      return `<p class="mt-4 text-foreground/80">${this.parser.parseInline(tokens)}</p>\n`;
    },
    list(token) {
      const tag = token.ordered ? "ol" : "ul";
      const items = token.items.map((i) => this.listitem(i)).join("");
      return `<${tag} class="mt-4 space-y-1 pl-6 text-foreground/80 ${token.ordered ? "list-decimal" : "list-disc"}">${items}</${tag}>\n`;
    },
    link({ href, tokens }) {
      return `<a class="text-cyan underline" href="${escape(href)}" target="_blank" rel="noopener noreferrer">${this.parser.parseInline(tokens)}</a>`;
    },
  },
});

export function renderMarkdown(md: string): string {
  return marked.parse(md) as string;
}
