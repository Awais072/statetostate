import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split lines and parse basic markdown structure
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];
  let listType: "ul" | "ol" = "ul";
  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = (key: string) => {
    if (inList && listItems.length > 0) {
      if (listType === "ul") {
        elements.push(
          <ul key={key} className="my-4 ml-6 list-disc space-y-2 text-zinc-700 dark:text-zinc-300">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={key} className="my-4 ml-6 list-decimal space-y-2 text-zinc-700 dark:text-zinc-300">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            ))}
          </ol>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  const flushTable = (key: string) => {
    if (inTable && tableRows.length > 0) {
      const headerRow = tableRows[0];
      const bodyRows = tableRows.slice(1).filter((row) => !row.every((cell) => cell.match(/^:?-+:?$/)));
      elements.push(
        <div key={key} className="my-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm text-zinc-700 dark:text-zinc-300">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                {headerRow.map((cell, idx) => (
                  <th key={idx} className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    {cell.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell.trim()) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check Table
    if (line.startsWith("|") && line.endsWith("|")) {
      flushList(`list-before-table-${i}`);
      inTable = true;
      const cells = line.slice(1, -1).split("|");
      tableRows.push(cells);
      continue;
    } else {
      flushTable(`table-${i}`);
    }

    // Check Bullet list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList || listType !== "ul") {
        flushList(`list-switch-${i}`);
        inList = true;
        listType = "ul";
      }
      listItems.push(line.slice(2));
      continue;
    }

    // Check Numbered list
    const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      if (!inList || listType !== "ol") {
        flushList(`list-switch-${i}`);
        inList = true;
        listType = "ol";
      }
      listItems.push(numMatch[2]);
      continue;
    }

    // Otherwise, flush existing list
    flushList(`list-${i}`);

    if (!line) {
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="mt-10 mb-4 font-serif text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-4xl">
          {line.replace("# ", "")}
        </h1>
      );
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="mt-8 mb-3 font-serif text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-3xl">
          {line.replace("## ", "")}
        </h2>
      );
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="mt-6 mb-2 font-serif text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
          {line.replace("### ", "")}
        </h3>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteText = line.replace(/^>\s*/, "");
      elements.push(
        <blockquote
          key={i}
          className="my-6 border-l-4 border-zinc-900 pl-4 py-1 italic text-zinc-900 dark:border-zinc-200 dark:text-zinc-200 text-lg sm:text-xl font-serif"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(quoteText) }}
        />
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p
        key={i}
        className="my-4 text-base sm:text-lg leading-relaxed text-zinc-800 dark:text-zinc-200 font-sans"
        dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
      />
    );
  }

  // Flush remaining
  flushList("list-final");
  flushTable("table-final");

  return <div className="prose prose-zinc max-w-none dark:prose-invert leading-relaxed">{elements}</div>;
}

function formatInlineMarkdown(text: string): string {
  return text
    // Bold & italic
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono text-pink-600 dark:text-pink-400">$1</code>')
    // Markdown link [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline underline-offset-4 font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>');
}
