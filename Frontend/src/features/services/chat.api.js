import axios from "axios";

const api = axios.create({
  baseURL: "/",
  withCredentials: true,
});

/**
 * Send a message to the AI and get a response.
 * If no chatId is provided, a new chat is created.
 * @param {string} message - The user's message
 * @param {string|null} chatId - The existing chat ID (optional)
 */
export async function sendMessage({ message, chatId = null }) {
  try {
    const response = await api.post("/api/chats/message", {
      message,
      chat: chatId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch all chats for the currently authenticated user.
 */
export async function getChats() {
  try {
    const response = await api.get("/api/chats/");
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch all messages for a specific chat.
 * @param {string} chatId - The chat ID
 */
export async function getMessages(chatId) {
  try {
    const response = await api.get(`/api/chats/${chatId}/messages`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a chat and all its messages.
 * @param {string} chatId - The chat ID to delete
 */
export async function deleteChat(chatId) {
  try {
    const response = await api.delete(`/api/chats/delete/${chatId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
