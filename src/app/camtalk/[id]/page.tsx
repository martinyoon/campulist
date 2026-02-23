'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getRoom, getMessages, sendMessage, markRead } from '@/lib/camtalk';
import { getUserSummary } from '@/data/users';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import type { CamTalkMessage } from '@/lib/camtalk';

/** 메시지 내 /post/xxx 경로를 클릭 가능한 링크로 변환 */
function renderContent(content: string) {
  const parts = content.split(/(\/post\/[\w-]+)/g);
  if (parts.length === 1) return content;
  return parts.map((part, i) =>
    /^\/post\/[\w-]+$/.test(part)
      ? <Link key={i} href={part} className="underline break-all">게시글 보기</Link>
      : part
  );
}

export default function CamTalkDetailPage() {
  return (
    <AuthGuard>
      <CamTalkDetailContent />
    </AuthGuard>
  );
}

function CamTalkDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const myId = user?.id ?? '';
  const roomId = params.id as string;

  const [messages, setMessages] = useState<CamTalkMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 방 정보 + 상대방 계산
  const room = getRoom(roomId);
  const partner = room?.participants.find(p => p.id !== myId) ?? null;
  const partnerProfile = partner ? getUserSummary(partner.id) : null;
  const partnerNickname = partnerProfile?.nickname ?? partner?.nickname ?? '';
  const myNickname = user?.nickname ?? '';

  // 메시지 로드 + 읽음 처리 (roomId와 myId만 의존)
  useEffect(() => {
    if (partnerNickname) document.title = `${partnerNickname} 캠톡 | 캠퍼스리스트`;
    markRead(roomId, myId);
    setMessages(getMessages(roomId));
  }, [roomId, myId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 스크롤 하단
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!room || !partner) {
    return (
      <div className="px-4 py-16 text-center text-muted-foreground">
        <p className="text-lg font-medium">캠톡을 찾을 수 없습니다</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/camtalk')}>
          캠톡 목록으로
        </Button>
      </div>
    );
  }

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg = sendMessage(roomId, myId, text);
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="flex h-[calc(100dvh-64px)] flex-col md:h-[calc(100dvh-80px)]">
      {/* 상단 헤더 */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground" aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <Link href={`/user/${partner.id}`} className="min-w-0 flex-1 transition-opacity hover:opacity-70">
            <div className="flex items-center gap-2">
              <span className="font-medium">{partnerNickname}</span>
              {partnerProfile?.isVerified && (
                <Badge variant="secondary" className="h-4 px-1 text-[10px]">인증</Badge>
              )}
              {partnerProfile && (
                <span className="text-xs text-muted-foreground">{partnerProfile.mannerTemp}°C</span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-1">
          {messages.map((msg, i) => {
            const isMine = msg.senderId === myId;
            const showDate = i === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[i - 1].createdAt).toDateString();
            const prevMsg = i > 0 ? messages[i - 1] : null;
            const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId || showDate;

            return (
              <div key={msg.id} className={isFirstInGroup && i > 0 ? 'mt-3' : ''}>
                {showDate && (
                  <div className="my-4 text-center text-xs text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                  </div>
                )}

                {/* 닉네임 라벨 — 그룹 첫 메시지만 */}
                {isFirstInGroup && (
                  <div className={`mb-1 ${isMine ? 'text-right' : 'pl-9'}`}>
                    {isMine ? (
                      <span className="text-xs font-medium text-muted-foreground">{myNickname}</span>
                    ) : (
                      <Link href={`/user/${partner.id}`} className="text-xs font-medium text-foreground/70 hover:text-foreground">
                        {partnerNickname}
                      </Link>
                    )}
                  </div>
                )}

                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[75%] items-end gap-1.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* 상대방 아바타: 그룹 첫 메시지만, 나머지는 빈 공간 */}
                    {!isMine && (
                      isFirstInGroup ? (
                        <Link href={`/user/${partner.id}`} className="shrink-0 self-start transition-opacity hover:opacity-70">
                          <Avatar size="sm">
                            <AvatarFallback>{partnerNickname.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </Link>
                      ) : (
                        <span className="w-7 shrink-0" />
                      )
                    )}
                    <div
                      className={`whitespace-pre-line rounded-2xl px-3.5 py-2 text-sm ${
                        isMine
                          ? 'bg-blue-600 text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {renderContent(msg.content)}
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
