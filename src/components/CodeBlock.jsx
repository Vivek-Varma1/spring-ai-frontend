import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ language, code, dark }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const displayLang = language || 'code';

  return (
    <div className={`my-3 rounded-xl overflow-hidden border ${dark ? 'border-gray-700 bg-[#1a1b26]' : 'border-gray-200 bg-[#fafbfc]'}`}>
      {/* Header bar */}
      <div className={`flex items-center justify-between px-4 py-2 text-xs font-mono ${dark ? 'bg-[#1e1f2e] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${dark ? 'bg-gray-600' : 'bg-red-400'}`}></span>
            <span className={`w-2.5 h-2.5 rounded-full ${dark ? 'bg-gray-600' : 'bg-yellow-400'}`}></span>
            <span className={`w-2.5 h-2.5 rounded-full ${dark ? 'bg-gray-600' : 'bg-green-400'}`}></span>
          </div>
          <span className="uppercase tracking-wider font-semibold text-[10px] ml-2">{displayLang}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
            copied
              ? dark
                ? 'bg-green-900/50 text-green-400'
                : 'bg-green-100 text-green-700'
              : dark
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-200 text-gray-500 hover:text-gray-800'
          }`}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          )}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {/* Code area */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language || 'text'}
          style={dark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: '1rem 1.25rem',
            fontSize: '0.82rem',
            lineHeight: '1.7',
            background: 'transparent',
          }}
          codeTagProps={{
            style: { fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
