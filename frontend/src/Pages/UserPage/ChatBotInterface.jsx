import { useEffect, useState, useRef } from 'react';
import './ChatBot.css'

const ChatBotInterface = () => {
    const [messages, setMessages] = useState([{from: 'Bot', message: 'Hello! How may I assist you?'}]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showBot, setShowBot] = useState('');
    const chatEndRef = useRef(null);

    const getBotResponse = async (message) => {
        const response = await fetch('/api/chat',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({prompt: message}),
        })
        
        const result = await response.json();
        const botMessage = result.message;
        setMessages(prev => [...prev, {from: 'Bot', message: botMessage}]);
    }

    const sendMessage = async (message) => {
        setLoading(true);
        setMessage('')
        setMessages(prev => [...prev, {from: 'You', message}])
        await getBotResponse(message)
        setLoading(false);
    }

    useEffect(() => {
        if(chatEndRef.current){
            chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
        }
    }, [messages])

    return (
        <div className='chat-bot-container'>
             <div className="chat-bot-button" onClick={() => setShowBot(prev => !prev)}>
                <img src="/icons/chatbot.png" alt="" />
            </div>
            {showBot && <div className='container'>
                    <div className='header'>
                        <h2>Chat with FlightBuddy</h2>
                    </div>
                    <div className='messages-container' ref={chatEndRef}>
                    {messages && messages.map(message => 
                    <div className={`message-box ${message.from}`}>
                    {message.from === 'Bot' && <img src='/icons/chatbot.png' />}
                    <li>{message.message}</li>
                    </div>
                    )}
                    </div>
                    {!loading && <div className='input-container'>
                        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
                        <button onClick={() => sendMessage(message)}>Send</button>
                    </div>}
                </div>}
        </div>
    )

}

export default ChatBotInterface;