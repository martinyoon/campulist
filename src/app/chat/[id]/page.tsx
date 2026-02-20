'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getChatRoom, getChatMessages, CURRENT_USER_ID } from '@/data/chats';
import { formatPrice } from '@/lib/format';
import { formatRelativeTime } from '@/lib/format';
import { STORAGE_KEYS } from '@/lib/constants';
import type { ChatMessage } from '@/lib/types';

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const room = getChatRoom(roomId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지 로드 (mock + localStorage)
  useEffect(() => {
    const mockMessages = getChatMessages(roomId);
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      const allSaved: ChatMessage[] = saved ? JSON.parse(saved) : [];
      const roomSaved = allSaved.filter(m => m.roomId === roomId);
      setMessages([...mockMessages, ...roomSaved]);
    } catch {
      setMessages(mockMessages);
    }
  }, [roomId]);

  // 스크롤 하단으로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!room) {
    return (
      <div className="px-4 py-16 text-center text-muted-foreground">
        <p className="text-lg font-medium">채팅방을 찾을 수 없습니다</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/chat')}>
          채팅 목록으로
        </Button>
      </div>
    );
  }

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      roomId,
      senderId: CURRENT_USER_ID,
      content: text,
      imageUrl: null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // localStorage에 저장
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      const allSaved: ChatMessage[] = saved ? JSON.parse(saved) : [];
      allSaved.push(newMsg);
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(allSaved));
    } catch { /* storage full */ }
  };

  return (
    <div className="flex h-[calc(100dvh-64px)] flex-col md:h-[calc(100dvh-80px)]">
      {/* 상단 헤더 */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/chat')} className="text-muted-foreground hover:text-foreground" aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{room.otherUser.nickname}</span>
              {room.otherUser.isVerified && (
                <Badge variant="secondary" className="h-4 px-1 text-[10px]">인증</Badge>
              )}
              <span className="text-xs text-muted-foreground">{room.otherUser.mannerTemp}°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* 게시글 정보 카드 */}
      <Link
        href={`/post/${room.postId}`}
        className="flex items-center gap-3 border-b border-border bg-muted/30 px-4 py-2.5 transition-colors hover:bg-muted/60"
      >
        {room.postThumbnail && (
          <img src={room.postThumbnail} alt="" className="h-10 w-10 rounded-md object-cover" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{room.postTitle}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">{formatPrice(room.postPrice)}</p>
        </div>
      </Link>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {messages.map((msg, i) => {
            const isMine = msg.senderId === CURRENT_USER_ID;
            const showDate = i === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[i - 1].createdAt).toDateString();

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="my-4 text-center text-xs text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                  </div>
                )}
                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[75%] items-end gap-1.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isMine && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {room.otherUser.nickname.charAt(0)}
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-sm ${
                        isMine
                          ? 'bg-blue-600 text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 메시지 입력 */}
      <div className="border-t border-border px-4 py-3">
        <form
          onSubmit={e => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="flex-1"
            autoFocus
          />
          <Button
            type="submit"
            disabled={!input.trim()}
            className="bg-blue-600 px-4 hover:bg-blue-700"
          >
            전송
          </Button>
        </form>
      </div>
    </div>
  );
}
