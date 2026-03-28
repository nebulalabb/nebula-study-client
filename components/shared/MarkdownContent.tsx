'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

interface MarkdownContentProps {
  children: string;
  className?: string;
}

/**
 * A central markdown renderer that handles:
 * 1. LaTeX (via remark-math and rehype-katex)
 * 2. Syntax highlighting (via react-syntax-highlighter)
 * 3. Common control character fixes (e.g., \f form-feed interpreted as LaTeX \f)
 * 4. Custom NebulaStudy styling (Orange accents, black font weights)
 */
export function MarkdownContent({ children, className = '' }: MarkdownContentProps) {
  // Fix common control character issues and auto-wrap raw LaTeX if needed
  const fixedContent = React.useMemo(() => {
    let text = children.replace(/\f/g, '\\f').replace(/\n/g, '  \n');
    
    // If the text looks like raw LaTeX (starts with \ and has no math delimiters), wrap it
    if (text.trim().startsWith('\\') && !text.includes('$')) {
       return `$$\n${text.trim()}\n$$`;
    }
    return text;
  }, [children]);

  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter 
                style={oneDark} 
                language={match[1]!} 
                PreTag="div" 
                className="rounded-2xl text-sm my-4 shadow-lg overflow-hidden" 
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="px-2 py-1 bg-orange-50 text-orange-600 rounded-lg text-sm font-black border border-orange-100" {...props}>
                {children}
              </code>
            );
          },
          p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-4">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-4">{children}</ol>,
          strong: ({ children }) => <strong className="font-black text-gray-900 border-b-2 border-orange-200">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
          // Custom handling for blocks that might contain math to ensure they look good
          div: ({ children }) => <div className="my-2">{children}</div>,
        }}
      >
        {fixedContent}
      </ReactMarkdown>
    </div>
  );
}
