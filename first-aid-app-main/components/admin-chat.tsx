'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, ShieldCheck } from 'lucide-react';

export default function AdminChatBox() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'admin', content: 'Chào bạn, đây là kênh hỗ trợ trực tuyến. Đội ngũ admin sẽ phản hồi bạn sớm nhất có thể.' }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    // Giả lập Admin trả lời sau 1.5 giây
    setTimeout(() => {
      const adminMsg = { 
        id: Date.now() + 1, 
        role: 'admin', 
        content: 'Cảm ơn bạn đã nhắn tin. Hiện các admin đang bận xử lý ca cấp cứu, vui lòng gọi 115 nếu quá khẩn cấp.' 
      };
      setMessages(prev => [...prev, adminMsg]);
      setIsSending(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-xl shadow-sm bg-white overflow-hidden font-sans">
      {/* Header màu Xanh Dương */}
      <div className="bg-blue-700 p-4 text-white flex items-center gap-3 shadow-md">
        <div className="bg-white/20 p-2 rounded-full">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Chat với Admin</h3>
          <p className="text-xs opacity-90 text-blue-100">Kết nối trực tiếp với nhân viên</p>
        </div>
      </div>

      {/* Khu vực tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm
              ${m.role === 'user' ? 'bg-gray-200' : 'bg-blue-100 border-blue-200'}`}>
              {m.role === 'user' ? <User size={16} className="text-gray-600" /> : <ShieldCheck size={16} className="text-blue-700" />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm
              ${m.role === 'user' ? 'bg-gray-700 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isSending && <div className="text-xs text-gray-400 italic ml-12">Admin đang nhập...</div>}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
        <input
          className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhắn tin cho quản trị viên..."
        />
        <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full shadow-md">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}