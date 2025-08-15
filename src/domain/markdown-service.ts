import MarkdownIt from "markdown-it";
import TurndownService from "turndown";

// Convert markdown to HTML
export const formatMarkdownHtml = (text: string): string => {
  const md = new MarkdownIt();
  return md.render(text);
};

// Convert HTML to markdown
export const formatHtmlMarkdown = (html: string): string => {
  const turndownService = new TurndownService({
    bulletListMarker: "-",
  });

  // Optional: custom escaping of markdown syntax
  const markdownReplacements: [RegExp, string][] = [
    [/\\/g, "\\\\"],
    [/\*/g, "\\*"],
    [/^-/g, "\\-"],
    [/^\+ /g, "\\+ "],
    [/^(=+)/g, "\\$1"],
    [/^(#{1,6}) /g, "\\$1 "],
    [/`/g, "\\`"],
    [/^~~~/g, "\\~~~"],
    [/^>/g, "\\>"],
    [/_/g, "\\_"],
    [/^(\d+)\. /g, "$1\\. "],
  ];

  turndownService.escape = (text: string): string =>
    markdownReplacements.reduce(
      (result, [regex, replacement]) => result.replace(regex, replacement),
      text
    );

  return turndownService.turndown(html);
};

type MarkdownChunk =
  | { type: "markdown"; content: string }
  | { type: "code"; language: string; content: string };

export function splitMarkdownIntoChunks(markdown: string): MarkdownChunk[] {
  const chunks: MarkdownChunk[] = [];
  const codeBlockRegex = /```([^\s]*)\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const [fullMatch, lang = "", code] = match;
    const index = match.index;

    // Push the plain markdown before the code block
    if (index > lastIndex) {
      chunks.push({
        type: "markdown",
        content: markdown.slice(lastIndex, index),
      });
    }

    // Push the code block
    chunks.push({
      type: "code",
      language: lang,
      content: code,
    });

    lastIndex = index + fullMatch.length;
  }

  // Any remaining markdown after the last code block
  if (lastIndex < markdown.length) {
    chunks.push({
      type: "markdown",
      content: markdown.slice(lastIndex),
    });
  }

  return chunks;
}
