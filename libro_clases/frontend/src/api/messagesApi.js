import {
  apiRequest
} from './apiClient.js';

export const getMessageRecipients = (
  usuarioId
) =>
  apiRequest(
    `/messages/users/${usuarioId}/recipients`
  );

export const getConversations = (
  usuarioId
) =>
  apiRequest(
    `/messages/users/${usuarioId}/conversations`
  );

export const getConversation = (
  conversacionId,
  usuarioId
) =>
  apiRequest(
    `/messages/conversations/${conversacionId}?usuarioId=${usuarioId}`
  );

export const createConversation = (
  payload
) =>
  apiRequest(
    '/messages/conversations',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  );

export const replyConversation = (
  conversacionId,
  payload
) =>
  apiRequest(
    `/messages/conversations/${conversacionId}/messages`,
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  );

export const markConversationRead = (
  conversacionId,
  usuarioId
) =>
  apiRequest(
    `/messages/conversations/${conversacionId}/read?usuarioId=${usuarioId}`,
    {
      method: 'PATCH'
    }
  );

export const getUnreadMessageCount = (
  usuarioId
) =>
  apiRequest(
    `/messages/users/${usuarioId}/unread-count`
  );