import { useState, useEffect } from 'react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
};


export const useMessageProcessor = (executor: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);





  const handleSend = async (input: string) => {
    if (!input.trim() || isLoading || !executor) return;

    setIsLoading(true);

    // Add user message to memory
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      // Pass the input text directly to the executor
      const result = await executor.call({ input });

      // Add bot response to memory
      const botMessage: Message = {
        id: Date.now().toString(),
        text: result.output,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
    } catch (error) {
      console.error('Error processing with LangChain:', error);

      // Add error message to memory
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error processing your request.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    handleSend,
  };
};
