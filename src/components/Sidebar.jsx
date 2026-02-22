import { useState } from 'react';

function ChatIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function PlusIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TrashIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  );
}

function CloseIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function SearchIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  );
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  dark,
  open,
  onClose,
}) {
  const [search, setSearch] = useState('');

  const formatDate = (date) => {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return d.toLocaleDateString();
  };

  const filtered = conversations.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  // Group conversations by date
  const grouped = {};
  filtered.forEach(c => {
    const label = formatDate(c.updatedAt);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(c);
  });

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${
          dark
            ? 'bg-[#0d0e14] border-r border-gray-800/60'
            : 'bg-white border-r border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 ${dark ? '' : ''}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <ChatIcon size={17} />
              <style>{`.w-9 svg { color: white; }`}</style>
            </div>
            <div>
              <h1 className={`text-sm font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                AI Chat
              </h1>
              <p className={`text-[10px] font-medium ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Powered by Spring AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`lg:hidden p-1.5 rounded-lg transition-colors ${
              dark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <CloseIcon />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 pb-2">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] hover:brightness-110"
          >
            <PlusIcon size={16} />
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
            dark
              ? 'bg-gray-900/50 border-gray-800 focus-within:border-indigo-500/40'
              : 'bg-gray-50 border-gray-200 focus-within:border-indigo-300'
          }`}>
            <SearchIcon />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search chats..."
              className={`flex-1 bg-transparent text-xs outline-none placeholder:text-gray-500 ${
                dark ? 'text-gray-300' : 'text-gray-700'
              }`}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {Object.entries(grouped).map(([label, convs]) => (
            <div key={label} className="mb-2">
              <p className={`text-[10px] font-bold uppercase tracking-widest px-2 py-2 ${
                dark ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {label}
              </p>
              <div className="space-y-0.5">
                {convs.map(conv => (
                  <div
                    key={conv.id}
                    className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                      conv.id === activeConversationId
                        ? dark
                          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        : dark
                          ? 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    }`}
                    onClick={() => {
                      onSelectConversation(conv.id);
                      onClose();
                    }}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      conv.id === activeConversationId
                        ? dark
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'bg-indigo-100 text-indigo-600'
                        : dark
                          ? 'bg-gray-800 text-gray-500'
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      <ChatIcon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] truncate block font-medium">
                        {conv.title}
                      </span>
                      <span className={`text-[10px] ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                        {conv.messages.length} messages
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all duration-150 ${
                        dark
                          ? 'hover:bg-red-500/15 text-red-400 hover:text-red-300'
                          : 'hover:bg-red-50 text-red-300 hover:text-red-500'
                      }`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {conversations.length === 0 && (
            <div className={`text-center py-16 px-4 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                dark ? 'bg-gray-800/50' : 'bg-gray-100'
              }`}>
                <ChatIcon size={24} />
              </div>
              <p className="text-sm font-medium mb-1">No conversations yet</p>
              <p className="text-xs opacity-60">Start a new chat to begin!</p>
            </div>
          )}

          {filtered.length === 0 && conversations.length > 0 && search && (
            <div className={`text-center py-10 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              <p className="text-sm">No matching chats</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-4 py-3 border-t text-center ${dark ? 'border-gray-800/60' : 'border-gray-100'}`}>
          <p className={`text-[10px] font-medium ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            Built with Spring AI & React
          </p>
        </div>
      </aside>
    </>
  );
}
