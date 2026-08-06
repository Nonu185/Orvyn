import React from 'react';
import { Link } from 'react-router-dom';
import useChat from './useChat';

// --- Icons ---
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
  </svg>
);

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M16.5 7.5h-9v9h9v-9z" />
    <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z" clipRule="evenodd" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Markdown-like renderer for AI responses ---
const renderContent = (text) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    line = line.replace(/`([^`]+)`/g, '<code class="bg-black/30 px-1 py-0.5 rounded text-[#31b8c6] text-sm font-mono">$1</code>');
    if (line.match(/^[\*\-•]\s/)) {
      return <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: line.replace(/^[\*\-•]\s/, '') }} />;
    }
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} dangerouslySetInnerHTML={{ __html: line }} />;
  });
};

// --- Home page (UI only) ---
const Home = () => {
  const {
    user,
    chats,
    activeChatId,
    setActiveChatId,
    messages,
    input,
    isSidebarLoading,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    messagesEndRef,
    textareaRef,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
    handleNewChat,
    handleDeleteChat,
    logout,
  } = useChat();

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-100 overflow-hidden font-sans">

      {/* ── Mobile Overlay ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-76 flex-shrink-0 flex flex-col bg-[#111111] border-r border-white/5 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-start gap-3 pt-5 pb-5 pl-6">
          <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#31b8c6]/10 border border-[#31b8c6]/20 flex items-center justify-center text-[#31b8c6]">
            <BotIcon />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#218d99] drop-shadow-[0_0_8px_rgba(33,141,153,0.3)] select-none">
            Orvyn
          </h1>
        </div>

        {/* New Chat Button */}
        <div className="px-3 pb-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150 border border-white/10"
          >
            <PlusIcon />
            New Chat
          </button>
        </div>

        {/* Chat History */}
        <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
          {isSidebarLoading ? (
            <div className="px-3 py-2 text-xs text-gray-600 animate-pulse">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-600">No chats yet</div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => {
                  setActiveChatId(chat._id);
                  setIsMobileMenuOpen(false);
                }}
                className={`group w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-all duration-150 ${
                  activeChatId === chat._id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="truncate flex-1">{chat.title}</span>
                <span
                  onClick={(e) => handleDeleteChat(e, chat._id)}
                  className="ml-1 p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <TrashIcon />
                </span>
              </button>
            ))
          )}
        </nav>

        {/* User info or Login */}
        <div className="p-3 border-t border-white/5 flex items-center justify-between">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg flex-1">
                <div className="w-8 h-8 rounded-full bg-[#31b8c6] flex items-center justify-center text-xs font-bold text-black">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-gray-400 truncate">{user.username}</span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <LogoutIcon />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="w-full px-4 py-2 text-sm text-center font-semibold text-black bg-[#31b8c6] rounded-lg hover:bg-[#28929e] transition-colors shadow-[0_0_8px_rgba(49,184,198,0.4)]"
            >
              Log In to Chat
            </Link>
          )}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col overflow-hidden relative">

        {/* Mobile Header Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden absolute top-4 left-4 z-30 p-2 rounded-lg bg-[#161616] border border-white/10 text-gray-400 hover:text-white shadow-lg"
        >
          <MenuIcon />
        </button>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Welcome screen */
            <div className="h-full flex flex-col items-center justify-center text-center px-6 select-none">
              <div className="w-12 h-12 rounded-2xl bg-[#31b8c6]/10 border border-[#31b8c6]/20 flex items-center justify-center mb-4 text-[#31b8c6]">
                <BotIcon />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                What can I help with?
              </h2>
              <p className="text-sm text-gray-500 max-w-sm">
                Ask me anything. I'll search, reason, and provide detailed answers.
              </p>
            </div>
          ) : (
            /* Message list */
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'AI' && (
                    <div className="w-7 h-7 flex-shrink-0 rounded-lg bg-[#31b8c6]/10 border border-[#31b8c6]/20 flex items-center justify-center text-[#31b8c6] mt-0.5">
                      <BotIcon />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-white/10 text-white rounded-br-sm'
                        : 'bg-[#1a2a2e] border border-[#31b8c6]/10 text-gray-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.role === 'AI' ? (
                      <div className="space-y-1">{renderContent(msg.content)}</div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 flex-shrink-0 rounded-lg bg-[#31b8c6]/10 border border-[#31b8c6]/20 flex items-center justify-center text-[#31b8c6]">
                    <BotIcon />
                  </div>
                  <div className="bg-[#1a2a2e] border border-[#31b8c6]/10 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#31b8c6] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#31b8c6] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#31b8c6] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Input bar ── */}
        <div className="flex-shrink-0 px-4 pb-8 pt-2">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
            <div
              className="flex items-center gap-3 bg-[#161616] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#31b8c6]/40 transition-colors duration-200 shadow-lg shadow-black/20 cursor-text"
              onClick={() => textareaRef.current?.focus()}
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="flex-3 bg-transparent resize-none outline-none text-sm text-white placeholder-gray-600 max-h-70 leading-relaxed"
                style={{ scrollbarWidth: 'none' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  input.trim() && !isLoading
                    ? 'bg-[#31b8c6] text-black hover:bg-[#28a0ac] shadow-md shadow-[#31b8c6]/20'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                <SendIcon />
              </button>
            </div>
            <p className="text-center text-xs text-gray-700 mt-2">
              AI can make mistakes. Consider checking important information.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
