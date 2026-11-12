import React, { useState } from 'react';
import { Send, X, Phone, ShieldCheck } from 'lucide-react';
import { useRide } from '../../context/RideContext';

export const DriverChatModal: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatMessages, sendChatMessage, currentBooking, startSimulatedCall } = useRide();
  const [inputText, setInputText] = useState('');

  if (!isChatOpen || !currentBooking?.driver) return null;

  const driver = currentBooking.driver;

  const quickChips = [
    "I'm at the main entrance",
    'Which color is the car?',
    'Take your time, waiting here',
    'Hazards are blinking?',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sendChatMessage(text);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md h-[80vh] sm:h-[620px] bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={driver.photoUrl}
                alt={driver.name}
                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-amber-400"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-black text-slate-900">{driver.name}</h4>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xs text-slate-500">
                {driver.vehicleModel} • <span className="font-mono text-slate-900 font-bold">{driver.plateNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => startSimulatedCall(driver)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
              title="Call Driver"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              onClick={() => setIsChatOpen(false)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
          <div className="text-center my-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200/60 font-semibold shadow-xs">
              Trip Chat Encrypted • Pixel Ride
            </span>
          </div>

          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs font-medium'
                      : 'bg-white text-slate-800 rounded-tl-xs border border-slate-100 font-medium'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="shrink-0 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1 rounded-full border border-slate-200 transition active:scale-95"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message your chauffeur..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:opacity-40 disabled:hover:bg-amber-400 text-slate-900 flex items-center justify-center transition shadow-xs active:scale-95"
          >
            <Send className="w-4 h-4 text-slate-900" />
          </button>
        </form>
      </div>
    </div>
  );
};
