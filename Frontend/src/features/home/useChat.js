import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../auth/AuthContext';
import { sendMessage, getChats, getMessages, deleteChat } from '../services/chat.api';

/**
 * useChat — encapsulates all state and side-effects for the Home chat page.
 *
 * Returns:
 *  - user          : logged-in user from AuthContext
 *  - socket        : active socket.io instance (null until connected)
 *  - chats         : list of sidebar chats
 *  - activeChatId  : currently selected chat ID (null = new chat)
 *  - messages      : messages for the active chat
 *  - input         : current textarea value
 *  - isLoading     : true while waiting for AI response
 *  - isSidebarLoading : true while fetching chat list
 *  - messagesEndRef : ref to auto-scroll anchor
 *  - textareaRef   : ref to auto-resize textarea
 *  - setActiveChatId : switch to an existing chat
 *  - handleInputChange : keeps input + textarea height in sync
 *  - handleSubmit  : sends message and handles optimistic update
 *  - handleKeyDown : submits on Enter (not Shift+Enter)
 *  - handleNewChat : resets to a blank new chat
 *  - handleDeleteChat : deletes a chat and cleans up state
 */
const useChat = () => {
  const { user, logout } = useAuth();

  // Socket
  const [socket, setSocket] = useState(null);

  // Chat & message state
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  // UI state
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarLoading, setIsSidebarLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // --- Initialize socket (only while Home is mounted) ---
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || 'https://orvyn-wzs8.onrender.com', {
      withCredentials: true,
      reconnectionAttempts: 5,      // stop retrying after 5 failed attempts
      reconnectionDelay: 2000,      // wait 2s between retries
    });
    setSocket(newSocket);
    newSocket.on('connect', () => console.log('Socket connected:', newSocket.id));
    newSocket.on('connect_error', (err) => console.warn('Socket connection failed:', err.message));
    return () => newSocket.disconnect();
  }, []);

  // --- Load sidebar chats on mount ---
  useEffect(() => {
    const loadChats = async () => {
      setIsSidebarLoading(true);
      try {
        const data = await getChats();
        setChats([...(data.chats || [])].reverse());
      } catch (err) {
        console.error('Failed to load chats:', err);
      } finally {
        setIsSidebarLoading(false);
      }
    };
    loadChats();
  }, []);

  // --- Load messages when active chat changes ---
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }
    const loadMessages = async () => {
      try {
        const data = await getMessages(activeChatId);
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };
    loadMessages();
  }, [activeChatId]);

  // --- Auto-scroll to latest message ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Auto-resize textarea as user types ---
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    }
  };

  // --- Send message with optimistic update ---
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Optimistically render the user message immediately
    const optimisticUserMsg = { _id: Date.now(), role: 'user', content: trimmed };
    setMessages((prev) => [...prev, optimisticUserMsg]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    try {
      const data = await sendMessage({ message: trimmed, chatId: activeChatId });

      // New chat was created — add it to the sidebar and set it active
      if (!activeChatId && data.chat) {
        setChats((prev) => [data.chat, ...prev]);
        setActiveChatId(data.chat._id);
      }

      // Swap the optimistic message for the real one and append AI response
      setMessages((prev) => [
        ...prev.filter((m) => m._id !== optimisticUserMsg._id),
        data.userMessage,
        data.AIMessage,
      ]);
    } catch (err) {
      console.error('Failed to send message:', err);
      // Roll back the optimistic message on error
      setMessages((prev) => prev.filter((m) => m._id !== optimisticUserMsg._id));
    } finally {
      setIsLoading(false);
    }
  };

  // --- Submit on Enter, newline on Shift+Enter ---
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // --- Start a new blank chat ---
  const handleNewChat = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setActiveChatId(null);
    setMessages([]);
    setInput('');
  };

  // --- Delete a chat and clean up state ---
  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  return {
    user,
    socket,
    chats,
    activeChatId,
    setActiveChatId,
    messages,
    input,
    isLoading,
    isSidebarLoading,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    messagesEndRef,
    textareaRef,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
    handleNewChat,
    handleDeleteChat,
    logout,
  };
};

export default useChat;
