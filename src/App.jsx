import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { useChat } from './hooks/useChat';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { dark, toggle } = useTheme();
  const {
    conversations,
    activeConversation,
    activeConversationId,
    loading,
    setActiveConversationId,
    createNewChat,
    deleteConversation,
    sendMessage,
  } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`flex h-screen overflow-hidden ${dark ? 'dark' : ''}`}>
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewChat={createNewChat}
        onDeleteConversation={deleteConversation}
        dark={dark}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <ChatArea
        conversation={activeConversation}
        loading={loading}
        onSendMessage={sendMessage}
        dark={dark}
        onToggleTheme={toggle}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={createNewChat}
      />
    </div>
  );
}
