"use client"
import { useEffect, useState } from 'react';
import ConversationList from '../../components/Private_Messaging/conversationList';
import MessageList from '../../components/Private_Messaging/MessageList';
import SendMessage from '../../components/Private_Messaging/SendMessage';
import Modal from '../../components/Private_Messaging/Modal';
import Sidebar from '../../components/sidebar/sidebar';
import RebelHubNavBar from '../../components/navbar/RebelHubNavBar';
import ProtectedRoute from '../../components/Accounts/ProtectedRoutes';
import NewConversationForm from '../../components/Private_Messaging/NewConversationForm';

import api from '@/utils/api';
import { getPMListURL, getNewPMURL, getPMSendURL, getConverstationMessagesURL } from '@/utils/url-segments';
import './page.css';

export default function PMessages(){
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    const fetchPMs = async () => { 
      try{
      const response = await api.get(getPMListURL());
      console.log(response.status)
      if(response.status == 200){
        console.log(response.data);
        setConversations(response.data);
      }
    }
    catch(error){
      console.error("Error fetching conversations:", error);
    }
    }
    fetchPMs();
  }, []);

  useEffect(() => {
    const fetchConverstations = async () => {
    console.log(selectedConversation);
    if (selectedConversation) {
      try{
        const response = await api.get(getConverstationMessagesURL(selectedConversation.conversation_id));
        if(response.status == 200){
          console.log(response.data);
          setMessages(response.data);
        }
      }
      catch{
        console.error("Error fetching messages:", error);
      }
    }
    }
    fetchConverstations();
  }, [selectedConversation]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await api.post(getPMSendURL(selectedConversation.conversation_id), { message_content: newMessage})
      setNewMessage('');
      // Refetch messages
      const response = api.get(getConverstationMessagesURL(selectedConversation.conversation_id));
        if(response.status == 200){
          console.log(response.data);
          setMessages(response.data);
        }
      } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
    <RebelHubNavBar/>
    <Sidebar></Sidebar>
    <div className={'container'}>
      <h1 className={'header'}>Direct Messages</h1>

      

      <div className={'content'}>     
        <div className={'dmsidebar'}>
          <NewConversationForm setConversations={setConversations} />
          <h2>Conversations</h2>
          <ul className={'conversationList'}>
            {conversations.map((conversation) => (
              <li
                key={conversation.conversation_id}
                className={`${'conversationItem'} ${selectedConversation?.conversation_id === conversation.conversation_id ? 'selected' : ''}`}
                onClick={() => setSelectedConversation(conversation)}
              >
                {conversation.participants.map((user) => user).join(', ')}
              </li>
            ))}
          </ul>
        </div>

        <div className={'messagesContainer'}>
          {selectedConversation ? (
            <>
              <h2>
                Conversation with {selectedConversation.participants.map((user) => user).join(', ')}
              </h2>
              <div className={'messageList'}>
                {messages.map((message) => (
                  <div key={message.message_id} className={'message'}>
                    {console.log(message)}
                    <strong>{message.UserName}:</strong> {message.MessageContent}
                    <div className={'timestamp'}>
                      {new Date(message.MessageTimestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className={'messageInput'}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  className={'input'}
                />
                <button
                  onClick={sendMessage}
                  className={'sendButton'}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <p>Select a conversation to view messages.</p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};
