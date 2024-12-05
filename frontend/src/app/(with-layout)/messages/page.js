"use client"
import { useEffect, useState, useRef } from 'react';
import Sidebar from '@/components/sidebar/sidebar';
import RebelHubNavBar from '@/components/navbar/RebelHubNavBar';
import ProtectedRoute from '@/components/Accounts/ProtectedRoutes';
import NewConversationForm from '@/components/Private_Messaging/NewConversationForm';

import api from '@/utils/api';
import { getPMListURL, getCurrentUserUrl, getPMSendURL, getConverstationMessagesURL, getOtherProfileUrl } from '@/utils/url-segments';
import './page.css';

import margins from "@/utils/Margins.module.css";

export default function PMessages(){
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [User, setUser] = useState([]);
  const [convoimage, setConvoImage] = useState(null);
  const [prefName, setprefName] = useState(null);

  const msgEndRef = useRef(null);

  useEffect(()=>{
    const fetchUser = async() =>{
      try{
        const response = await api.get(getCurrentUserUrl());
        if(response.status == 200){
          setUser(response.data);
        }
      }
      catch(error){
        console.log(error);
      }
      
    };
    fetchUser();
  }, [])
    


  const fetchConvos = async () => { 
      try{
        const response = await api.get(getPMListURL());
        if(response.status == 200){
          setConversations(response.data);
        }
      }
      catch(error){
        console.error("Error fetching conversations:", error);
      }
  }
  
  useEffect(() => {
    
    fetchConvos();
  }, []);


  const fetchConvoMsg = async () => {
    if (selectedConversation) {
      try{
        const response = await api.get(getConverstationMessagesURL(selectedConversation.conversation_id));
        if(response.status == 200){
          setMessages(response.data);
          const otherUser = selectedConversation.participants[0] !== User.username ? selectedConversation.participants[0] : selectedConversation.participants[1];
          try{
            const res2 = await api.get(getOtherProfileUrl(otherUser));
            if(res2.status == 200){
              setConvoImage(`http://localhost:8000/${res2.data.pfp}`);
              setprefName(res2.data.name);
            }
          } catch(error){
            console.error("Error fetching messages:", error);
          }
        }
      }
      catch(error){
        console.error("Error fetching messages:", error);
      }
    }
    }

  useEffect(() => {
    fetchConvoMsg();
  }, [selectedConversation]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await api.post(getPMSendURL(selectedConversation.conversation_id), { message_content: newMessage})
      setNewMessage('');
      await fetchConvos();
      await fetchConvoMsg();
    }
    catch(error){

    }
  };

  useEffect(() => {
    if (msgEndRef.current) {
      msgEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <ProtectedRoute>
      <div>
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
                    {conversation.participants.filter(user => user !== User.username).map((user) => user).join(', ')}
                  </li>
                ))}
              </ul>
            </div>

            <div className={'messagesContainer'}>
              {selectedConversation ? (
                <>
                  <h2 className='UserInfo'>
                    <img src = {convoimage} className='convopfp'/>
                    {`${prefName} (${selectedConversation.participants.filter(user => user !== User.username).map(user => user).join(', ')})`}
                  </h2>
                  <div className={'messageList'}>
                    {messages.map((message) => (
                      <div key={message.MessageID} className={`message ${message.UserName === User.username ? 'self' : ''}`}>
                        <strong>{message.UserName === User.username ? '' : prefName}{message.UserName === User.username ? '' : ':'}</strong> {message.MessageContent}
                        <div className={'timestamp'}>
                          {new Date(message.MessageTimestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                    <div ref={msgEndRef}/>
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
    </ProtectedRoute>
  );
};
