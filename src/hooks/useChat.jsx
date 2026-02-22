import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = import.meta.env.VITE_API_URL;

function loadConversations() {
  try {
    const saved = localStorage.getItem('chat-conversations');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map(c => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
        messages: c.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })),
      }));
    }
  } catch (e) {
    // ignore
  }
  return [];
}

export function useChat() {
  const [conversations, setConversations] = useState(loadConversations);
  const [activeConversationId, setActiveConversationId] = useState(() => {
    return localStorage.getItem('chat-active-id') || null;
  });
  const [loading, setLoading] = useState(false);

  const saveConversations = useCallback((convs) => {
    setConversations(convs);
    localStorage.setItem('chat-conversations', JSON.stringify(convs));
  }, []);

  const saveActiveId = useCallback((id) => {
    setActiveConversationId(id);
    if (id) localStorage.setItem('chat-active-id', id);
    else localStorage.removeItem('chat-active-id');
  }, []);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  const createNewChat = useCallback(() => {
    const newConv = {
      id: uuidv4(),
      contextId: '',
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = [newConv, ...conversations];
    saveConversations(updated);
    saveActiveId(newConv.id);
    return newConv.id;
  }, [conversations, saveConversations, saveActiveId]);

  const deleteConversation = useCallback((id) => {
    const updated = conversations.filter(c => c.id !== id);
    saveConversations(updated);
    if (activeConversationId === id) {
      saveActiveId(updated.length > 0 ? updated[0].id : null);
    }
  }, [conversations, activeConversationId, saveConversations, saveActiveId]);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;

    let convId = activeConversationId;
    let convs = [...conversations];

    // If no active conversation, create one
    if (!convId) {
      const newConv = {
        id: uuidv4(),
        contextId: '',
        title: message.slice(0, 40) + (message.length > 40 ? '...' : ''),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      convId = newConv.id;
      convs = [newConv, ...convs];
      saveActiveId(convId);
    }

    // Add user message
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    convs = convs.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          messages: [...c.messages, userMessage],
          updatedAt: new Date(),
          title: c.messages.length === 0
            ? message.slice(0, 40) + (message.length > 40 ? '...' : '')
            : c.title,
        };
      }
      return c;
    });
    saveConversations(convs);
    setLoading(true);

    try {
      const conv = convs.find(c => c.id === convId);
      const contextId = conv.contextId;

      const params = new URLSearchParams();
      params.set('message', message);

      if (contextId) {
        params.set('contextId', contextId);
      } else {
        params.set('contextId', '');
      }

      const url = `${API_BASE}/chat?${params.toString()}`;
      const response = await fetch(url);
      const data = await response.json();

      const botReply = data.reply || data.Generated || 'No response received.';
      const newContextId = data.contextId || contextId;

      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: botReply,
        timestamp: new Date(),
      };

      const finalConvs = convs.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            contextId: newContextId,
            messages: [...c.messages, assistantMessage],
            updatedAt: new Date(),
          };
        }
        return c;
      });
      saveConversations(finalConvs);
    } catch (err) {
      const errorMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: '⚠️ Could not connect to the backend server. Please try again later.',
        timestamp: new Date(),
      };

      const finalConvs = convs.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            messages: [...c.messages, errorMessage],
            updatedAt: new Date(),
          };
        }
        return c;
      });
      saveConversations(finalConvs);
    } finally {
      setLoading(false);
    }
  }, [activeConversationId, conversations, saveConversations, saveActiveId]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    loading,
    setActiveConversationId: saveActiveId,
    createNewChat,
    deleteConversation,
    sendMessage,
  };
}
