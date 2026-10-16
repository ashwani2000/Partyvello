import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Bot, MessageCircle, Send, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const suggestions = ['Find balloons', 'Under ₹500', 'Contact details'];

function getAssistantReply(message, products) {
  const query = message.toLowerCase();

  if (/contact|address|phone|call|location/.test(query)) {
    return 'You can reach Party Vello at +91-89208-85246. We are in Akabarpur, Behrampur, Ghaziabad, 201009.';
  }

  const budgetMatch = query.match(/(?:under|below|less than|within|up to)\s*₹?\s*(\d{2,})/);
  const budget = budgetMatch ? Number(budgetMatch[1]) : null;
  const categoryRules = [
    [/balloon/, 'Balloons'],
    [/decor|backdrop|banner/, 'Decorations'],
    [/cake|topper|candle/, 'Cake Toppers'],
    [/tableware|plate|cup|napkin|cutlery/, 'Tableware'],
    [/return gift|gift|favor|favour|treat bag/, 'Return Gifts'],
    [/accessor|crown|photo booth|prop|badge|confetti/, 'Accessories'],
  ];
  const categories = categoryRules
    .filter(([pattern]) => pattern.test(query))
    .map(([, category]) => category);

  let matches = products.filter((product) => product.stock > 0);
  if (categories.length) {
    matches = matches.filter((product) => categories.includes(product.category));
  } else if (!budget && !/recommend|popular|best|birthday|party|product/.test(query)) {
    const terms = query
      .split(/[^a-z0-9]+/)
      .filter((term) => term.length > 3 && !['please', 'show', 'find', 'some', 'what', 'with', 'have', 'want'].includes(term));
    const relevant = matches.filter((product) => {
      const searchable = `${product.name} ${product.category} ${product.description}`.toLowerCase();
      return terms.some((term) => searchable.includes(term));
    });
    if (relevant.length) matches = relevant;
  }

  if (budget) {
    matches = matches.filter((product) => product.price <= budget);
  }

  matches.sort((a, b) => b.rating - a.rating);
  if (matches.length) {
    const picks = matches.slice(0, 3).map((product) =>
      `${product.name} — ₹${product.price.toLocaleString('en-IN')} (${product.stock} in stock)`,
    );
    return `Here are a few picks:\n${picks.join('\n')}`;
  }

  if (budget) {
    return `I couldn't find an in-stock product under ₹${budget.toLocaleString('en-IN')}. Try another budget or browse all products.`;
  }

  return 'Tell me what you are shopping for, and I can find matching products, prices, and stock. Try balloons, cake toppers, gifts, or a budget like “under ₹500”.';
}

export default function HelpWidgets() {
  const { products } = useApp();
  const [chatOpen, setChatOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'assistant', text: 'Hi! I can help you find party products by category, price, or stock.' },
  ]);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const updateScrollState = () => setShowTop(window.scrollY > 280);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    if (chatOpen) endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatOpen, messages]);

  const sendMessage = (value = input) => {
    const text = value.trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      { from: 'user', text },
      { from: 'assistant', text: getAssistantReply(text, products) },
    ]);
    setInput('');
  };

  return (
    <>
      {showTop && (
        <button
          type="button"
          className="back-to-top"
          aria-label="Back to top"
          title="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={20} />
        </button>
      )}

      {chatOpen && (
        <section className="assistant-panel" aria-label="Party Vello shopping assistant">
          <header className="assistant-header">
            <span className="assistant-avatar"><Bot size={19} /></span>
            <div>
              <strong>Party Vello Assistant</strong>
              <small>Product and shopping help</small>
            </div>
            <button type="button" className="assistant-close" aria-label="Close assistant" onClick={() => setChatOpen(false)}>
              <X size={18} />
            </button>
          </header>

          <div className="assistant-messages" aria-live="polite">
            {messages.map((message, index) => (
              <p key={`${message.from}-${index}`} className={`assistant-message ${message.from}`}>
                {message.text}
              </p>
            ))}
            <div ref={endOfMessagesRef} />
          </div>

          {messages.length === 1 && (
            <div className="assistant-suggestions">
              {suggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form
            className="assistant-input-row"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about products..."
              aria-label="Message the shopping assistant"
            />
            <button type="submit" aria-label="Send message" disabled={!input.trim()}>
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={`assistant-launcher ${chatOpen ? 'is-open' : ''}`}
        aria-label={chatOpen ? 'Close shopping assistant' : 'Open shopping assistant'}
        title="Shopping assistant"
        onClick={() => setChatOpen((open) => !open)}
      >
        {chatOpen ? <X size={21} /> : <MessageCircle size={21} />}
      </button>
    </>
  );
}