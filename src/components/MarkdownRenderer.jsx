import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

export default function MarkdownRenderer({ content, dark }) {
  const components = {
    code({ className, children, node, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');

      // Determine if this is a block-level code (fenced code block) or inline
      // Block code is wrapped in <pre><code>, inline is just <code>
      const isInline = !match && !codeString.includes('\n') && node?.position?.start?.line === node?.position?.end?.line;

      if (!isInline) {
        return (
          <CodeBlock
            language={match ? match[1] : ''}
            code={codeString}
            dark={dark}
          />
        );
      }

      return (
        <code
          className={`px-1.5 py-0.5 rounded text-[13px] font-mono font-medium ${
            dark
              ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
          }`}
          {...props}
        >
          {children}
        </code>
      );
    },

    p({ children }) {
      return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
    },

    h1({ children }) {
      return <h1 className={`text-2xl font-bold mb-3 mt-5 pb-2 border-b ${dark ? 'text-white border-gray-700' : 'text-gray-900 border-gray-200'}`}>{children}</h1>;
    },

    h2({ children }) {
      return <h2 className={`text-xl font-bold mb-2 mt-4 ${dark ? 'text-white' : 'text-gray-900'}`}>{children}</h2>;
    },

    h3({ children }) {
      return <h3 className={`text-lg font-semibold mb-2 mt-3 ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{children}</h3>;
    },

    h4({ children }) {
      return <h4 className={`text-base font-semibold mb-2 mt-3 ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{children}</h4>;
    },

    ul({ children }) {
      return <ul className="list-disc list-outside mb-3 space-y-1.5 ml-5">{children}</ul>;
    },

    ol({ children }) {
      return <ol className="list-decimal list-outside mb-3 space-y-1.5 ml-5">{children}</ol>;
    },

    li({ children }) {
      return <li className="leading-relaxed pl-1">{children}</li>;
    },

    blockquote({ children }) {
      return (
        <blockquote
          className={`border-l-4 pl-4 my-3 italic ${
            dark
              ? 'border-indigo-500 text-gray-400 bg-indigo-500/5'
              : 'border-indigo-400 text-gray-600 bg-indigo-50/50'
          } rounded-r-lg py-2 pr-3`}
        >
          {children}
        </blockquote>
      );
    },

    a({ href, children }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline decoration-1 underline-offset-2 font-medium ${
            dark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'
          }`}
        >
          {children}
        </a>
      );
    },

    strong({ children }) {
      return <strong className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{children}</strong>;
    },

    em({ children }) {
      return <em className="italic">{children}</em>;
    },

    del({ children }) {
      return <del className={`line-through ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{children}</del>;
    },

    hr() {
      return <hr className={`my-5 ${dark ? 'border-gray-700' : 'border-gray-200'}`} />;
    },

    table({ children }) {
      return (
        <div className="overflow-x-auto my-4 rounded-lg border ${dark ? 'border-gray-700' : 'border-gray-200'}">
          <table className={`min-w-full divide-y ${dark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {children}
          </table>
        </div>
      );
    },

    thead({ children }) {
      return <thead className={dark ? 'bg-gray-800' : 'bg-gray-50'}>{children}</thead>;
    },

    th({ children }) {
      return (
        <th className={`px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider ${
          dark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {children}
        </th>
      );
    },

    td({ children }) {
      return (
        <td className={`px-4 py-2.5 text-sm border-t ${
          dark ? 'border-gray-700 text-gray-300' : 'border-gray-100 text-gray-600'
        }`}>
          {children}
        </td>
      );
    },

    img({ src, alt }) {
      return (
        <img
          src={src}
          alt={alt || ''}
          className="max-w-full h-auto rounded-lg my-3"
          loading="lazy"
        />
      );
    },

    pre({ children }) {
      return <>{children}</>;
    },
  };

  return (
    <div className="markdown-content text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
