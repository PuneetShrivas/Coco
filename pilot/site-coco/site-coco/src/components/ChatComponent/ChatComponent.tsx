"use client"
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import styles from './ChatComponent.module.css';

export interface MessageType {
  type: 'text' | 'recommendation';
  text: string;
  images?: string[];
  fromUser?: boolean; // Add a new field to identify user messages
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      return;
    }

    const message: MessageType = { type: 'text', text: newMessage, fromUser: true }; // Mark message as from user
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: newMessage,
          prev_messages: messages.length,
          new_chat: messages.length === 0,
          user_id: 'PIuAjdxrQvObMBHP2bxziz4nQLq2', // replace with actual user ID logic
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botResponse: MessageType = { type: 'text', text: data.response, fromUser: false }; // Mark message as from bot
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error gracefully, e.g., display error message in chat
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.inputField}
          disabled={isLoading}
        />
        <button
          className={styles.sendButton}
          onClick={handleSendMessage}
          disabled={newMessage.trim() === '' || isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
