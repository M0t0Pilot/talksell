import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const renderFormattedInline = (text: string) => {
    // Basic inline formatting: **bold**, *italic*, `code`, [link](url), ~~strike~~
    const parts = [];
    let remaining = text;
    let key = 0;

    // Pattern for inline elements
    const inlineRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\)|\~\~.*?\~\~)/g;
    const tokens = remaining.split(inlineRegex);

    for (let token of tokens) {
      if (!token) continue;
      key++;

      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={key} className="font-semibold text-stone-900">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={key} className="italic text-stone-800">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={key}
            className="px-1.5 py-0.5 text-xs font-mono bg-stone-100 text-amber-900 rounded border border-stone-200"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('~~') && token.endsWith('~~')) {
        parts.push(
          <del key={key} className="line-through text-stone-400">
            {token.slice(2, -2)}
          </del>
        );
      } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
        const match = token.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const [, linkText, linkUrl] = match;
          parts.push(
            <a
              key={key}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-800 underline decoration-amber-800/40 hover:decoration-amber-800 hover:text-amber-900 transition-colors"
            >
              {linkText}
              <ExternalLink className="w-3 h-3" />
            </a>
          );
        } else {
          parts.push(token);
        }
      } else {
        parts.push(token);
      }
    }

    return parts;
  };

  // Parse lines into block elements
  const renderBlocks = () => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    let codeBlockCount = 0;

    while (i < lines.length) {
      const line = lines[i];

      // 1. Code Block (```)
      if (line.trim().startsWith('```')) {
        const lang = line.trim().slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        const fullCode = codeLines.join('\n');
        const currentIndex = codeBlockCount++;
        elements.push(
          <div key={`code-${i}`} className="my-6 rounded-lg overflow-hidden border border-stone-300 bg-[#1E1E1E] text-stone-100">
            <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] text-xs font-mono text-stone-400">
              <span>{lang || 'code'}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(fullCode, currentIndex)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-stone-700/50 hover:bg-stone-700 text-stone-200 transition-colors"
              >
                {copiedCodeIndex === currentIndex ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs md:text-sm font-mono overflow-x-auto leading-relaxed">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        i++;
        continue;
      }

      // 2. Table (| Col | Col |)
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const headerCells = tableLines[0].split('|').slice(1, -1).map(c => c.trim());
          // Skip delimiter row (tableLines[1])
          const bodyRows = tableLines.slice(2).map(row => row.split('|').slice(1, -1).map(c => c.trim()));

          elements.push(
            <div key={`table-${i}`} className="my-6 overflow-x-auto rounded-lg border border-stone-200 bg-white">
              <table className="w-full text-left text-sm text-stone-800">
                <thead className="bg-stone-50 text-xs font-semibold text-stone-600 uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    {headerCells.map((h, hIdx) => (
                      <th key={hIdx} className="px-4 py-3">
                        {renderFormattedInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-stone-50/50 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-3 text-stone-700">
                          {renderFormattedInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // 3. Blockquote (> quote)
      if (line.trim().startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className="my-6 pl-5 border-l-2 border-amber-800/60 font-serif text-lg md:text-xl italic text-stone-800 leading-relaxed bg-amber-50/20 py-2 rounded-r"
          >
            {quoteLines.map((ql, qIdx) => (
              <p key={qIdx} className={qIdx > 0 ? 'mt-2' : ''}>
                {renderFormattedInline(ql)}
              </p>
            ))}
          </blockquote>
        );
        continue;
      }

      // 4. Headings
      if (line.startsWith('# ')) {
        const title = line.slice(2).trim();
        const id = title.toLowerCase().replace(/[^\w]+/g, '-');
        elements.push(
          <h1 key={`h1-${i}`} id={id} className="text-3xl md:text-4xl font-serif font-semibold text-stone-900 mt-10 mb-4 tracking-tight">
            {renderFormattedInline(title)}
          </h1>
        );
        i++;
        continue;
      }

      if (line.startsWith('## ')) {
        const title = line.slice(3).trim();
        const id = title.toLowerCase().replace(/[^\w]+/g, '-');
        elements.push(
          <h2 key={`h2-${i}`} id={id} className="text-2xl md:text-3xl font-serif font-medium text-stone-900 mt-8 mb-3 tracking-tight">
            {renderFormattedInline(title)}
          </h2>
        );
        i++;
        continue;
      }

      if (line.startsWith('### ')) {
        const title = line.slice(4).trim();
        const id = title.toLowerCase().replace(/[^\w]+/g, '-');
        elements.push(
          <h3 key={`h3-${i}`} id={id} className="text-xl md:text-2xl font-serif font-medium text-stone-800 mt-6 mb-2">
            {renderFormattedInline(title)}
          </h3>
        );
        i++;
        continue;
      }

      // 5. Horizontal Divider (--- or ***)
      if (line.trim() === '---' || line.trim() === '***') {
        elements.push(<hr key={`hr-${i}`} className="my-8 border-t border-stone-200" />);
        i++;
        continue;
      }

      // 6. Lists (Unordered - or * or Numbered 1.)
      if (/^(\-|\*|\d+\.)\s/.test(line.trim())) {
        const isNumbered = /^\d+\.\s/.test(line.trim());
        const listItems: string[] = [];
        while (i < lines.length && /^(\-|\*|\d+\.)\s/.test(lines[i].trim())) {
          listItems.push(lines[i].trim().replace(/^(\-|\*|\d+\.)\s+/, ''));
          i++;
        }

        if (isNumbered) {
          elements.push(
            <ol key={`ol-${i}`} className="my-4 pl-6 list-decimal space-y-2 text-stone-700 leading-relaxed">
              {listItems.map((item, idx) => (
                <li key={idx} className="pl-1">
                  {renderFormattedInline(item)}
                </li>
              ))}
            </ol>
          );
        } else {
          elements.push(
            <ul key={`ul-${i}`} className="my-4 pl-6 list-disc space-y-2 text-stone-700 leading-relaxed">
              {listItems.map((item, idx) => (
                <li key={idx} className="pl-1">
                  {renderFormattedInline(item)}
                </li>
              ))}
            </ul>
          );
        }
        continue;
      }

      // 7. Regular Paragraph
      if (line.trim() !== '') {
        elements.push(
          <p key={`p-${i}`} className="my-4 text-base md:text-lg text-stone-700 leading-relaxed">
            {renderFormattedInline(line)}
          </p>
        );
      }

      i++;
    }

    return elements;
  };

  return <div className={`prose-editorial max-w-none ${className}`}>{renderBlocks()}</div>;
};
