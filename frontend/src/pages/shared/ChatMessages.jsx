import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeft, FaPaperPlane, FaTrash } from 'react-icons/fa'
import { chatMessagesStyles as s } from '../../assets/dummyStyles'
import { useAuth } from '../../context/authcontext'
import { useChat } from '../../context/ChatContext'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../../config'
import Navbar from '../../components/common/Navbar'

const ChatMessages = () => {
      const { user, token } = useAuth();
      const location = useLocation();
      const { socket, activeChat, setActiveChat, joinChat } = useChat();

      const [conversations, setConversations] = useState([]);
      const [messages, setMessages] = useState([]);
      const [newMessage, setNewMessage] = useState('');
      const [loading, setLoading] = useState(true);
      const [showSidebar, setShowSidebar] = useState(false);
      const messageEndRef = useRef(null);

      const scrollTOBottom = () => {
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

      const getChatPartner = (chat) => {
            if (!chat || !user) return null;
            const buyerId = chat.buyer?._id || chat.buyer;
            return String(user._id) === String(buyerId) ? chat.seller : chat.buyer;
      };

      useEffect(() => {
            const fetchConversations = async () => {
                  try {
                        const res = await axios.get(`${API_URL}/api/chat/my-chats`, {
                              headers: { Authorization: `Bearer ${token}` },
                        });

                        const fetchedConversations = res.data.chats || [];
                        setConversations(fetchedConversations);

                        if (location.state?.chat) {
                              const existingChat = fetchedConversations.find((chat) => chat._id === location.state.chat._id);
                              if (existingChat) {
                                    setActiveChat(existingChat);
                              }
                        }
                  } catch (error) {
                        console.error('Error fetching conversations:', error);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchConversations();
      }, [location.state, setActiveChat, token]);

      useEffect(() => {
            if (!activeChat) {
                  setMessages([]);
                  return;
            }

            const fetchMessages = async () => {
                  try {
                        const res = await axios.get(`${API_URL}/api/chat/${activeChat._id}`, {
                              headers: { Authorization: `Bearer ${token}` },
                        });

                        setMessages(res.data.chat?.message || []);
                        joinChat(activeChat._id);
                  } catch (error) {
                        console.error('Error fetching messages:', error);
                  }
            };

            fetchMessages();
      }, [activeChat, joinChat, token]);

      useEffect(() => {
            if (!socket) return undefined;

            const handleReceiveMessage = (data) => {
                  if (activeChat && String(data.chatId) === String(activeChat._id)) {
                        setMessages((prev) => [...prev, data]);
                  }
            };

            socket.on('receiveMessage', handleReceiveMessage);
            return () => socket.off('receiveMessage', handleReceiveMessage);
      }, [socket, activeChat]);

      useEffect(() => {
            scrollTOBottom();
      }, [messages]);

      const handleSendMessage = async (e) => {
            e.preventDefault();

            if (!newMessage.trim() || !activeChat) return;

            const textToSend = newMessage.trim();
            setNewMessage('');

            try {
                  const response = await axios.post(
                        `${API_URL}/api/chat/send/${activeChat._id}`,
                        {
                              chatId: activeChat._id,
                              text: textToSend,
                        },
                        { headers: { Authorization: `Bearer ${token}` } },
                  );

                  if (response.data?.newMessage) {
                        setMessages((prev) => [...prev, response.data.newMessage]);
                  } else if (response.data?.chat?.message) {
                        setMessages(response.data.chat.message);
                  }

                  scrollTOBottom();
            } catch (error) {
                  console.error('Error sending message:', error);
            }
      };

      const handleDeleteChat = async (e, chatId) => {
            e.stopPropagation();

            if (!window.confirm('Are you sure you want to delete this conversation?')) return;

            try {
                  await axios.delete(`${API_URL}/api/chat/delete-chat/${chatId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                  });

                  setConversations((prev) => prev.filter((chat) => chat._id !== chatId));
                  if (activeChat?._id === chatId) {
                        setActiveChat(null);
                        setMessages([]);
                  }
            } catch (error) {
                  console.error('Error deleting chat:', error);
            }
      };

      const handleDeleteMessage = async (chatId, messageId) => {
            if (!window.confirm('Delete this message?')) return;

            try {
                  const res = await axios.delete(
                        `${API_URL}/api/chat/delete-message/${chatId}/${messageId}`,
                        { headers: { Authorization: `Bearer ${token}` } },
                  );

                  setMessages(res.data.chat?.message || []);
            } catch (error) {
                  console.error('Error deleting message:', error);
            }
      };

      if (loading) {
            return (
                  <div className={s.loaderFullPage}>
                        <div className={s.loader}></div>
                  </div>
            );
      }

      return (
            <div className={`${s.chatContainer} ${user?.role === 'seller' ? s.chatContainerSeller : s.chatContainerNonSeller}`}>
                  {user?.role !== 'seller' && <Navbar />}

                  <div className={s.chatWrapper}>
                        <aside className={`${s.sidebar} ${activeChat && !showSidebar ? s.sidebarHidden : ''}`}>
                              <div className={s.sidebarHeader}>
                                    <h2 className={s.sidebarTitle}>Messages</h2>
                              </div>

                              <div className={s.sidebarContent}>
                                    {conversations.length === 0 ? (
                                          <div className={s.emptyConversations}>
                                                <p>No conversations yet.</p>
                                          </div>
                                    ) : (
                                          conversations.map((chat) => {
                                                const partner = getChatPartner(chat);
                                                const isActive = activeChat?._id === chat._id;

                                                return (
                                                      <div
                                                            key={chat._id}
                                                            className={`${s.conversationItem} ${isActive ? s.conversationItemActive : ''}`}
                                                            onClick={() => {
                                                                  setActiveChat(chat);
                                                                  setShowSidebar(false);
                                                            }}
                                                      >
                                                            <div className={s.avatar}>
                                                                  {partner?.profilePic ? (
                                                                        <img src={partner.profilePic} alt={partner?.name || 'Chat user'} className={s.avatarImg} />
                                                                  ) : (
                                                                        <span>{partner?.name?.charAt(0)?.toUpperCase() || '?'}</span>
                                                                  )}
                                                            </div>

                                                            <div className={s.conversationInfo}>
                                                                  <div className={s.conversationName}>{partner?.name || 'Unknown user'}</div>
                                                                  <div className={s.conversationPreview}>{chat.property?.title || 'Property chat'}</div>
                                                            </div>

                                                            <button className={s.deleteChatButton} onClick={(e) => handleDeleteChat(e, chat._id)}>
                                                                  <FaTrash />
                                                            </button>
                                                      </div>
                                                );
                                          })
                                    )}
                              </div>
                        </aside>

                        <section className={s.chatArea}>
                              <div className={s.chatHeader}>
                                    <div className={s.chatHeaderLeft}>
                                          <button className={s.backButton} onClick={() => setShowSidebar(true)}>
                                                <FaArrowLeft />
                                          </button>
                                          <div className={s.chatPartnerName}>
                                                {activeChat ? getChatPartner(activeChat)?.name || 'Chat' : 'Select a conversation'}
                                          </div>
                                    </div>
                              </div>

                              {!activeChat ? (
                                    <div className={s.noChatSelected}>
                                          <p className={s.noChatTitle}>No chat selected</p>
                                          <p>Choose a conversation from the sidebar to start messaging.</p>
                                    </div>
                              ) : (
                                    <>
                                          <div className={s.messagesArea}>
                                                {messages.map((msg) => {
                                                      const isOwnMessage = String(msg.sender?._id || msg.sender) === String(user?._id);

                                                      return (
                                                            <div key={msg._id || `${msg.createdAt}-${msg.text}`} className={`${s.messageBubble} ${isOwnMessage ? s.messageOwn : s.messageOther}`}>
                                                                  <div className={s.messageContent}>
                                                                        <div className="flex-1">
                                                                              {msg.image && (
                                                                                    <div className={s.messageImageWrapper}>
                                                                                          <img src={msg.image} alt="Message attachment" className={s.messageImage} />
                                                                                    </div>
                                                                              )}

                                                                              {msg.text && <p className={s.messageText}>{msg.text}</p>}
                                                                              <span className={s.messageTime}>
                                                                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                                              </span>
                                                                        </div>

                                                                        {isOwnMessage && (
                                                                              <button className={s.deleteMessageButton} onClick={() => handleDeleteMessage(activeChat._id, msg._id)}>
                                                                                    <FaTrash />
                                                                              </button>
                                                                        )}
                                                                  </div>
                                                            </div>
                                                      );
                                                })}
                                                <div ref={messageEndRef} />
                                          </div>

                                          <form className={s.messageForm} onSubmit={handleSendMessage}>
                                                <input
                                                      className={s.messageInput}
                                                      value={newMessage}
                                                      onChange={(e) => setNewMessage(e.target.value)}
                                                      placeholder="Type a message..."
                                                />
                                                <button type="submit" className={s.sendButton}>
                                                      <FaPaperPlane className={s.sendIcon} />
                                                </button>
                                          </form>
                                    </>
                              )}
                        </section>
                  </div>
            </div>
      );
};

export default ChatMessages