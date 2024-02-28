import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GenAIComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText) return;

    setMessages([...messages, { text: inputText, type: 'user' }]);
    setInputText('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(inputText);
      const response = await result.response;
      const generatedText = response.text().trim();
      setMessages([...messages, { text: generatedText, type: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className="relative bg-black min-h-screen">
      <div className="max-w-lg mx-auto p-4 ">
        <div className="bg-white p-4 rounded-lg shadow-md ">
        <h1 className="text-2xl font-bold mb-4 text-center">Chat with GenAI</h1>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${message.type === 'user' ? 'bg-blue-200 text-blue-900 self-end' : 'bg-gray-200 text-gray-900 self-start'}`}
            >
              {message.text}
            </div>
          ))}
          {loading && <div className="flex justify-center items-center"><div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-gray-900"></div>Loading...</div>}
          <div ref={messageEndRef}></div>
          <div className="bg-white mt-4 rounded-lg shadow-md absolute bottom-0 left-0 right-0 max-w-lg mx-auto p-4">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="w-[80%] p-2 border border-gray-500 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={sendMessage}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Send
          </button>
          <footer className="text-center text-gray-600 text-sm p-4 ">&copy; {new Date().getFullYear()}SPRHackz |All Rights Reserved.</footer>
        </div>
        </div>
        

      </div>
      
    </div>
  );
};

export default GenAIComponent;
