'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getAllChatRooms } from '@/lib/api';
import { formatRelativeTime } from '@/lib/format';
import type { ChatRoom } from '@/lib/types';

export default function ChatPage() {
  const [chats, setChats] = useState<ChatRoom[]>([]);

  useEffect(() => {
    document.title = '채팅 | 캠푸리스트';
    const rooms = getAllChatRooms();
    // 최신 메시지 순 정렬
    rooms.sort((a, b) => {
      const aTime = a.lastMessageAt || a.createdAt;
      const bTime = b.lastMessageAt || b.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
    setChats(rooms);
  }, []);

  return (
    <div>
      {/* 헤더 */}
      <div className="border-b border-border px-4 py-4">
        <h1 className="text-xl font-bold">채팅</h1>
      </div>

      {/* 채팅 목록 */}
      {chats.length > 0 ? (
        <div>
          {chats.map(chat => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className="flex items-center gap-3 border-b border-border px-4 py-3.5 transition-colors hover:bg-muted"
            >
              {/* 상대방 아바타 */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-medium">
                {chat.otherUser.nickname.charAt(0)}
              </div>

              {/* 채팅 내용 */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{chat.otherUser.nickname}</span>
                  <span className="text-xs text-muted-foreground">
                    {chat.lastMessageAt ? formatRelativeTime(chat.lastMessageAt) : ''}
                  </span>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {chat.lastMessage || '채팅을 시작해보세요'}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground/70">{chat.postTitle}</p>
              </div>

              {/* 상품 썸네일 + 읽지 않은 수 */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                {chat.postThumbnail && (
                  <img
                    src={chat.postThumbnail}
                    alt={chat.postTitle}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                )}
                {chat.unreadCount > 0 && (
                  <Badge className="h-5 min-w-5 justify-center bg-blue-600 px-1.5 text-[10px] text-white">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="px-4 py-16 text-center text-muted-foreground">
          <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <p className="text-lg font-medium">채팅이 없습니다</p>
          <p className="mt-2 text-sm">관심 있는 게시글에서 채팅을 시작해보세요.</p>
          <Link href="/" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            게시글 둘러보기
          </Link>
        </div>
      )}
    </div>
  );
}
