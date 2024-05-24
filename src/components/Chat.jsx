import { useState, useEffect, useRef } from 'react';
import '../App.css';
import useCryptoData from '../hooks/useCryptoData.js';

const apiKey = import.meta.env.VITE_API_KEY;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
const  ChatBot = () => {
    const getCurrentTime = () => {
        return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi! Ask me about any cryptocurrency (e.g. ETH, BTC) ...", timestamp: getCurrentTime() }
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const chatBoxRef = useRef(null);
    const botTextRef = useRef("");
    const [listening, setListening] = useState(false);
    const { coinMap, news} = useCryptoData(apiKey);

    useEffect(() => {
        if (!recognition) return;
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setListening(false);
        };
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { sender: "user", text: input, timestamp: getCurrentTime() };
        setMessages(prev => [...prev, userMessage]);
        setTyping(true);
        await new Promise(r => setTimeout(r, 500));
        const reply = await fetchMock(input);
        const emptyBotMessage = {
            sender: "bot",
            text: "",
            timestamp: getCurrentTime()
        };
        setMessages(prev => [...prev, emptyBotMessage]);
        botTextRef.current = "";
        setTyping(false);
        if (!reply) {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    text: "I couldn't find information on that coin. Please try asking about one of the top 50 coins."
                };
                return updated;
            });
            return;
        }
        const words = reply.split(" ");
        botTextRef.current = "";
        for (let i = 0; i < words.length; i++) {
            await new Promise(r => setTimeout(r, words[i].match(/[.,!?]$/) ? 320 : 100));
            botTextRef.current += (i === 0 ? "" : " ") + words[i];
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    text: botTextRef.current
                };
                return updated;
            });
        }
        setInput("");
    }

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMock = async (query) => {
        const lowered = query.toLowerCase();

        // extract mentioned coins from query
        const mentionedCoins = Object.values(coinMap).filter(c => {
            const name = c.CoinName?.toLowerCase() || "";
            const full = c.FullName?.toLowerCase() || "";
            const symbol = c.Symbol?.toLowerCase() || "";
            return lowered.includes(symbol) || lowered.includes(name) || lowered.includes(full);
        });

        // no valid coin match
        if (mentionedCoins.length === 0) {
            return "I couldn't find information on that coin. Please try asking about one of the top 50 coins.";
        }

        // Handle comparison requests
        if (mentionedCoins.length > 1 && /difference|compare|versus|vs/.test(lowered)) {
            return `You're asking to compare ${mentionedCoins.map(c => c.FullName).join(" and ")}, but I don't support direct comparisons yet. Try asking about one coin at a time!`;
        }

        const coin = mentionedCoins[0];
        if (!coin.Description) {
            return `I found ${coin.FullName}, but no detailed description is available.`;
        }

        let desc = coin.Description.replace(/&#39;/g, "'");
        desc = desc.replace(/(What|What's|Who|How|Why)\s+is\s+[A-Z][a-zA-Z]+\??\.?\s*/gi, '');
        desc = desc.replace(/([a-z0-9])([.?!])([A-Z])/g, "$1$2 $3");

        // truncate if overly long (after 750 characters or at 'Blockchain data provided by')
        const cutoffIdx = desc.indexOf("Blockchain data provided by:");
        if (cutoffIdx !== -1) {
            desc = desc.slice(0, cutoffIdx);
        }
        if (desc.length > 750) {
            desc = desc.slice(0, 750).split(".").slice(0, -1).join(".") + ".";
        }

        // Determine if the user is asking about news
        const wantsNewsOnly = /latest news|recent news|any news|what's new|update/.test(lowered);

        const relatedNews = news.filter(n =>
            n.body.toLowerCase().includes(coin.Symbol.toLowerCase()) ||
            n.title.toLowerCase().includes(coin.Symbol.toLowerCase()))
            .slice(0, 2);

        const newsBlock = relatedNews.length
            ? `<br /><br /><strong>Recent news:</strong><ul>${relatedNews.map(n =>
                `<li><a href="${n.url}" target="_blank" rel="noopener noreferrer">${n.title}</a></li>`).join("")}</ul>`
            : "";

        return wantsNewsOnly ? newsBlock : `${desc.trim()}${newsBlock}`;
    };
    return (
        <div className="chat-container">
            <div className="chat-box" ref={chatBoxRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message-row ${msg.sender}`}>
                        <div className="m-bubble">
                            <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                            <div className="timestamp">{msg.timestamp}</div>
                        </div>
                    </div>
                ))}
                {typing && (
                    <div className="message-row bot">
                        <div className="m-bubble typing-icon">
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="inputRow">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me about a coin..."
                    className="input"
                />
                <button className="send-button" onClick={handleSend}>Send</button>
                <button
                    className={`send-button mic-button ${listening ? "listening" : ""}`}
                    onClick={() => {
                        recognition && recognition.start()
                        console.log("Mic button clicked");
                        if (recognition) {
                        console.log("Recognition available, starting...");
                        } else {
                        console.log("SpeechRecognition not supported.");
                        }
                    }}
                    disabled={listening}
                    title="Speak"
                >
                    {/* SVG icon for microphone */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                        <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5z"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default ChatBot;