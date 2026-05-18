import React, { useEffect, useRef, useState } from 'react'
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
      const { socket, activeChat, setActiveChat, joinChat, sendMessage } = useChat();

      const [conversation, setConversation] = useState([]);
      const [message, setMessage] = useState([]);
      const [newMessage, setNewMessage] = useState("");
      const [loading, setLoading] = useState(true);
      const messageEndRef = useRef(null);

      //to scroll to bottom
      const scrollTOBottom = () => {
            messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }

      //to fetch the conversation (btw buyer and seller)

      useEffect(() => {
            const fetchConversations = async () => {
                  try {
                        const res = await axios.get(`${API_URL}/api/chat/user`, {
                              headers: { Authorization: `Bearer ${token}` },
                        });
                        const fetchedConversations = res.data;
                        setConversation(fetchedConversations);
                        if (location.state?.chat) {
                              const existingChat = fetchedConversations.find(
                                    (c) => c._id === location.state.chat._id,
                              );
                              if (existingChat) {
                                    setActiveChat(location.state.chat);
                              }
                        }
                        setLoading(false);
                  } catch (error) {
                        console.error("Error fetching conversations:", error);
                        setLoading(false);
                  }
            };
            fetchConversations();
      }, [user, location.state])

      //to fetch messages
      useEffect(() => {
            if (activeChat) {
                  const fetchMessage = async () => {
                        try {
                              const res = await axios.get(`${API_URL}/api/chat/${activeChat._id}`, {
                                    headers: { Authorization: `Bearer ${token}` },
                              });
                              setMessage(res.data.messages || []);
                              joinChat(activeChat._id);
                              scrollTOBottom();
                        } catch (error) {
                              console.error("Error fetching messages:", error);
                        }
                  };
                  fetchMessage();
            }
      }, [activeChat]);

      //updating the chat when new message is receive

      useEffect(() => {
            if (socket) {
                  socket.on("receiveMessage", (data) => {
                        if (activeChat && data.chatId === activeChat._id) {
                              setMessages((prev) => [...prev, data]);
                        }
                  })
            }
            return () => socket?.off("receiveMessage");
      }, [socket, activeChat]);

      useEffect(() => {
            scrollTOBottom();
      }, [message]);

      useEffect(() => {
            if (activeChat) {
                  const timer = setTimeout(() => scrollTOBottom(), 100);
                  return () => clearTimeout(timer);
            }
      }, [activeChat]);

      // to send a message
      const handleSendMessage = async (e) => {
            e.preventDefault();
      if (!newMessage.trim() || !activeChat) return;

      const textToSend = newMessage;
      setNewMessage("");

      try {
            const response = await axios.post(
                  `${API_URL}/api/chat/send`, {
                        ChatId: activeChat,
                        text: textToSend
            }, { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.newMessage) {
                  setMessage(
                        activeChat._id,
                        textToSend,
                        res.data.newMessage._id,
                        res.data.newMessage.createdAt
                  )
            }
            scrollTOBottom();

      } catch (error) {
            console.error("Error sending message:", error);
      }
      };
      
      // to delete a chat
      const handleDeleteChat = async (e, chatId) => {
            e.stopPropgation();
            if (!window.confirm("Are you sure you want to delete this coversation?"))
                  return;

      try {
            await axios.delete(
                  `${API_URL}/api/chat/${chatId}`,
                  {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  }
            );
            setConversations((prev) => prev.filter((c) => c._id !== chatId));
            if (activeChat?._id === chatId) setActiveChat(null);

      } catch (error) {
            console.error("Error deleting chat:", error);
      }
};

      //to delete a particular a message form chat
      const handleDeleteMessages = async (chatId, messageId) => {
            if (!window.confirm("Delete this message")) return;

            try {
                  const res = await axios.delete(
                        `${API_URL}/api/chat/${chatId}/message/${messageId}`,
                        { headers: { Authorization: `Bearer ${token}` } },
                  );
                  setMessage(res.data.chat.messages);
            } catch (error) {
                  console.error("Error deleting message:", error);
            }
      }

      //to get the party
      const getChatPartner = (chat) => {
            return user._id === chat.buyer._id ? chat.seller : chat.buyer;
      };

      if (loading)
            return (
                  <div className={s.laderFullPage}>
                        <div className={s.loader}></div>
                  </div>
      )

  return (
        <div className={`${chatContainer} ${
              user?.role === "seller" ? s.chatContainerSeller : s.chatContainerNonSeller
       }`}>
         {user?.role !== "seller"  && <Navbar/>}     
       </div>
  )
}

export default ChatMessages