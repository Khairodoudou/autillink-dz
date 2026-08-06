"use client";
// app/specialist/messages/page.tsx
import { useState } from "react";
import { MessageSquare, Send, Search } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { mockConversations } from "@/lib/mock-data";
import type { Conversation } from "@/lib/mock-data";

export default function SpecialistMessagesPage() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConv, setActiveConv] = useState<Conversation>(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const updated = conversations.map((c) => {
      if (c.id !== activeConv.id) return c;
      const msg = {
        id: `msg-spec-${Date.now()}`,
        senderId: "specialist-001",
        senderName: "د. سارة كمال",
        senderRole: "specialist" as const,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" }),
        read: true,
      };
      return {
        ...c,
        messages: [...c.messages, msg],
        lastMessage: newMessage,
        lastMessageTime: "الآن",
        unreadCount: 0,
      };
    });
    setConversations(updated);
    setActiveConv(updated.find((c) => c.id === activeConv.id)!);
    setNewMessage("");
  };

  return (
    <div>
      <PageHeader
        title="الرسائل"
        subtitle="تواصل مع أولياء الأمور والإدارة"
        icon={MessageSquare}
        iconColor="#1D5B79"
        iconBg="#1D5B7915"
      />

      <div className="bg-white rounded-2xl border border-[#D6E8F0] shadow-sm overflow-hidden flex h-[calc(100vh-220px)] min-h-[480px]">
        {/* Conversation List */}
        <div className="w-72 border-l border-[#D6E8F0] flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-[#D6E8F0]">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="بحث..."
                className="w-full bg-[#EAF3F7] rounded-xl pr-9 pl-3 py-2 text-sm text-right outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={`w-full text-right p-4 flex items-start gap-3 hover:bg-[#EAF3F7] transition-colors ${
                  activeConv.id === conv.id ? "bg-[#EAF3F7]" : ""
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-[#1D5B79]/15 flex items-center justify-center text-[#1D5B79] font-800 text-sm flex-shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-700 text-[#1F2937] truncate">{conv.participantName}</p>
                    <span className="text-xs text-[#9CA3AF] flex-shrink-0">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-[#6B7280] truncate mt-0.5">{conv.lastMessage}</p>
                  {conv.unreadCount > 0 && (
                    <span className="inline-flex mt-1 w-5 h-5 rounded-full bg-[#1D5B79] text-white text-xs font-700 items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-[#D6E8F0] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D5B79]/15 flex items-center justify-center text-[#1D5B79] font-800 text-sm">
              {activeConv.avatar}
            </div>
            <div>
              <p className="text-sm font-800 text-[#1F2937]">{activeConv.participantName}</p>
              <p className="text-xs text-[#6B7280]">{activeConv.participantRole}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeConv.messages.map((msg) => {
              const isMe = msg.senderRole === "specialist";
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      isMe
                        ? "bg-[#EAF3F7] text-[#1F2937] rounded-tr-sm"
                        : "bg-[#1D5B79] text-white rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? "text-[#9CA3AF]" : "text-white/70"}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-[#D6E8F0]">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="اكتب رسالتك..."
                className="flex-1 input-rtl text-sm"
              />
              <button
                onClick={sendMessage}
                className="w-11 h-11 bg-[#1D5B79] text-white rounded-xl flex items-center justify-center hover:bg-[#174A62] transition-colors flex-shrink-0"
              >
                <Send className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
