import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  createConversation,
  getConversation,
  getConversations,
  getMessageRecipients,
  replyConversation
} from '../../api/messagesApi.js';

const initialNewMessage = {
  destinatarioUsuarioId: '',
  asunto: '',
  contenido: ''
};

export default function MessagesPanel({
  usuarioId
}) {
  const [
    recipients,
    setRecipients
  ] = useState([]);

  const [
    conversations,
    setConversations
  ] = useState([]);

  const [
    selectedConversationId,
    setSelectedConversationId
  ] = useState(null);

  const [
    selectedConversation,
    setSelectedConversation
  ] = useState(null);

  const [
    messages,
    setMessages
  ] = useState([]);

  const [
    newMessage,
    setNewMessage
  ] = useState(initialNewMessage);

  const [reply, setReply] =
    useState('');

  const [showNew, setShowNew] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');

  const loadMainData = async () => {
    if (!usuarioId) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [
        recipientsData,
        conversationsData
      ] = await Promise.all([
        getMessageRecipients(usuarioId),
        getConversations(usuarioId)
      ]);

      setRecipients(recipientsData);
      setConversations(
        conversationsData
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMainData();
  }, [usuarioId]);

  const openConversation = async (
    conversationId
  ) => {
    setError('');
    setMessage('');

    setSelectedConversationId(
      conversationId
    );

    try {
      const data =
        await getConversation(
          conversationId,
          usuarioId
        );

      setSelectedConversation(
        data.conversacion
      );

      setMessages(
        data.mensajes || []
      );

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id ===
          conversationId
            ? {
                ...conversation,
                noLeidos: 0
              }
            : conversation
        )
      );
    } catch (e) {
      setError(e.message);
    }
  };

  const sendNewConversation = async (
    event
  ) => {
    event.preventDefault();

    setError('');
    setMessage('');

    if (
      !newMessage.destinatarioUsuarioId
    ) {
      setError(
        'Seleccione un destinatario.'
      );

      return;
    }

    if (!newMessage.asunto.trim()) {
      setError(
        'Ingrese el asunto.'
      );

      return;
    }

    if (!newMessage.contenido.trim()) {
      setError(
        'Ingrese el mensaje.'
      );

      return;
    }

    setSending(true);

    try {
      const response =
        await createConversation({
          remitenteUsuarioId:
            Number(usuarioId),

          destinatarioUsuarioId:
            Number(
              newMessage
                .destinatarioUsuarioId
            ),

          asunto:
            newMessage.asunto.trim(),

          contenido:
            newMessage.contenido.trim()
        });

      setNewMessage(
        initialNewMessage
      );

      setShowNew(false);

      await loadMainData();

      await openConversation(
        response.conversacionId
      );

      setMessage(
        'Mensaje enviado correctamente.'
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const sendReply = async (
    event
  ) => {
    event.preventDefault();

    setError('');
    setMessage('');

    if (!reply.trim()) {
      setError(
        'Ingrese una respuesta.'
      );

      return;
    }

    setSending(true);

    try {
      await replyConversation(
        selectedConversationId,
        {
          remitenteUsuarioId:
            Number(usuarioId),

          contenido: reply.trim()
        }
      );

      setReply('');

      await openConversation(
        selectedConversationId
      );

      await loadMainData();
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const groupedRecipients =
    useMemo(() => {
      return recipients.reduce(
        (result, recipient) => {
          const role =
            recipient.rol ||
            'usuario';

          if (!result[role]) {
            result[role] = [];
          }

          result[role].push(
            recipient
          );

          return result;
        },
        {}
      );
    }, [recipients]);

  const formatDate = (value) => {
    if (!value) {
      return '';
    }

    return new Date(
      value
    ).toLocaleString('es-CL');
  };

  if (loading) {
    return (
      <div className="role-card">
        <p>Cargando mensajes...</p>
      </div>
    );
  }

  return (
    <div className="messages-system">
      <div className="messages-toolbar">
        <div>
          <h3>Mensajería</h3>

          <p className="text-muted">
            Conversaciones académicas.
          </p>
        </div>

        <button
          type="button"
          className="btn-base btn-primary"
          onClick={() => {
            setShowNew(
              (current) => !current
            );

            setError('');
            setMessage('');
          }}
        >
          {showNew
            ? 'Cancelar'
            : 'Nuevo mensaje'}
        </button>
      </div>

      {message && (
        <div className="form-success">
          {message}
        </div>
      )}

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {showNew && (
        <form
          className="role-card message-new-form"
          onSubmit={
            sendNewConversation
          }
        >
          <h4>Nueva conversación</h4>

          <div className="row g-3">
            <div className="col-md-6">
              <select
                className="form-control"
                value={
                  newMessage
                    .destinatarioUsuarioId
                }
                onChange={(event) =>
                  setNewMessage(
                    (prev) => ({
                      ...prev,
                      destinatarioUsuarioId:
                        event.target.value
                    })
                  )
                }
                required
              >
                <option value="">
                  Seleccione destinatario
                </option>

                {Object.entries(
                  groupedRecipients
                ).map(
                  ([
                    role,
                    roleRecipients
                  ]) => (
                    <optgroup
                      key={role}
                      label={
                        role
                          .charAt(0)
                          .toUpperCase() +
                        role.slice(1)
                      }
                    >
                      {roleRecipients.map(
                        (recipient) => (
                          <option
                            key={
                              recipient.usuarioId
                            }
                            value={
                              recipient.usuarioId
                            }
                          >
                            {recipient.nombre}
                            {recipient
                              .cursoNombre
                              ? ` - ${recipient.cursoNombre}`
                              : ''}
                          </option>
                        )
                      )}
                    </optgroup>
                  )
                )}
              </select>
            </div>

            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Asunto"
                maxLength={150}
                value={
                  newMessage.asunto
                }
                onChange={(event) =>
                  setNewMessage(
                    (prev) => ({
                      ...prev,
                      asunto:
                        event.target.value
                    })
                  )
                }
                required
              />
            </div>

            <div className="col-12">
              <textarea
                className="form-control"
                rows="4"
                maxLength={5000}
                placeholder="Escriba el mensaje"
                value={
                  newMessage.contenido
                }
                onChange={(event) =>
                  setNewMessage(
                    (prev) => ({
                      ...prev,
                      contenido:
                        event.target.value
                    })
                  )
                }
                required
              />
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn-base btn-primary"
                disabled={sending}
              >
                {sending
                  ? 'Enviando...'
                  : 'Enviar mensaje'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="messages-layout">
        <aside className="conversations-panel">
          <div className="conversations-title">
            <h4>Conversaciones</h4>

            <span>
              {conversations.length}
            </span>
          </div>

          {conversations.length ===
          0 ? (
            <div className="empty-messages">
              No tiene conversaciones.
            </div>
          ) : (
            conversations.map(
              (conversation) => (
                <button
                  type="button"
                  key={conversation.id}
                  className={
                    `conversation-item ${
                      selectedConversationId ===
                      conversation.id
                        ? 'active'
                        : ''
                    }`
                  }
                  onClick={() =>
                    openConversation(
                      conversation.id
                    )
                  }
                >
                  <div className="conversation-name">
                    <strong>
                      {
                        conversation
                          .otroUsuarioNombre
                      }
                    </strong>

                    {Number(
                      conversation.noLeidos
                    ) > 0 && (
                      <span className="unread-badge">
                        {
                          conversation
                            .noLeidos
                        }
                      </span>
                    )}
                  </div>

                  <span className="conversation-subject">
                    {conversation.asunto}
                  </span>

                  <small>
                    {conversation
                      .ultimoMensaje ||
                      'Sin mensajes'}
                  </small>

                  <time>
                    {formatDate(
                      conversation
                        .actualizadoEn
                    )}
                  </time>
                </button>
              )
            )
          )}
        </aside>

        <section className="conversation-panel">
          {!selectedConversation ? (
            <div className="empty-conversation">
              <h4>
                Seleccione una conversación
              </h4>

              <p>
                Aquí podrá leer y responder
                mensajes.
              </p>
            </div>
          ) : (
            <>
              <header className="conversation-header">
                <h4>
                  {
                    selectedConversation
                      .asunto
                  }
                </h4>
              </header>

              <div className="message-thread">
                {messages.map(
                  (item) => {
                    const own =
                      Number(
                        item.remitenteUsuarioId
                      ) ===
                      Number(usuarioId);

                    return (
                      <article
                        key={item.id}
                        className={
                          `message-bubble ${
                            own
                              ? 'own'
                              : 'received'
                          }`
                        }
                      >
                        <strong>
                          {own
                            ? 'Tú'
                            : item.remitenteNombre}
                        </strong>

                        <p>
                          {item.contenido}
                        </p>

                        <time>
                          {formatDate(
                            item.enviadoEn
                          )}
                        </time>
                      </article>
                    );
                  }
                )}
              </div>

              <form
                className="message-reply-form"
                onSubmit={sendReply}
              >
                <textarea
                  className="form-control"
                  rows="3"
                  maxLength={5000}
                  placeholder="Escriba una respuesta"
                  value={reply}
                  onChange={(event) =>
                    setReply(
                      event.target.value
                    )
                  }
                />

                <button
                  type="submit"
                  className="btn-base btn-primary"
                  disabled={
                    sending ||
                    !reply.trim()
                  }
                >
                  {sending
                    ? 'Enviando...'
                    : 'Responder'}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}