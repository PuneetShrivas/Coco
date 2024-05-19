import React from 'react';
import { MessageType } from './ChatComponent';
import styles from './ChatComponent.module.css';

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`${styles.message} ${message.fromUser ? styles.userMessage : styles.botMessage}`}>
      {message.type === 'text' ? (
        <p>{message.text}</p>
      ) : (
        <div>
          <p>{message.text}</p>
          <div className={styles.recommendation}>
            {message.images?.map((image, index) => (
              <img key={index} src={image} alt={`Recommendation ${index}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
