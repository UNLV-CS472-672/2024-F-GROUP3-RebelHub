import { useState } from 'react';
import api from '@/utils/api';
import { getNewPMURL } from '@/utils/url-segments';

const NewConversationForm = ({ setConversations }) => {
  const [recipientId, setRecipientId] = useState('');

  const handleCreateConversation = async () => {
    if (!recipientId) return alert("Please enter a username");

    try {
      const response = await api.post(getNewPMURL(), { recipient_id: recipientId });
      setConversations((prevConversations) => [response.data, ...prevConversations]); // Prepend the new conversation
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to create conversation.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter username"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
      />
      <button onClick={handleCreateConversation}>Create Conversation</button>
    </div>
  );
};

export default NewConversationForm;