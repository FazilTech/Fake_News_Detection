import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import './chatbot.css';

export default function ChatbotWidget({ newsContext = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I'm your news assistant. Ask me anything about the shown articles." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendQuestion(question) {
    if (!question.trim()) return;

    setMessages(prev => [...prev, { from: "user", text: question }]);
    setLoading(true);

    try {
      const resp = await fetch("http://localhost:8080/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question, context: newsContext })
});


      const data = await resp.json();
      if (resp.ok) {
        setMessages(prev => [...prev, { from: "bot", text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { from: "bot", text: "Error: " + (data.error || "Unknown") }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { from: "bot", text: "Network error. Try again." }]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSend = () => {
    sendQuestion(input);
    setInput("");
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="chatbot-button">
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h2>News Chatbot</h2>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-message ${m.from}`}>
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={loading ? "Thinking..." : "Ask something about the news..."}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading}>{loading ? "..." : "Send"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
