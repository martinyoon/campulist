'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/ui/EmptyState';
import { getChat2Rooms } from '@/lib/chat2';
import { getUserSummary } from '@/data/users';
import { formatRelativeTime } from '@/lib/format';
import type { ChatRoom, UserSummary } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';

function getChatPartner(chat: ChatRoom, myId: string): UserSummary {
  if (chat.buyerId === myId) return chat.otherUser;
  return getUserSummary(chat.buyerId);
}

function Chat2Content() {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatRoom[]>([]);

  useEffect(() => {
    document.title = '채팅 | 캠퍼스리스트';
    if (!user) return;
    setChats(getChat2Rooms(user.id));
  }, [user]);

  return (
    <div>
      <div className="border-b border-border px-4 py-4">
        <h1 className="text-xl font-bold">채팅</h1>
      </div>

      {chats.length === 0 ? (
        <EmptyState
          message="채팅이 없습니다"
          sub="관심 있는 게시글에서 채팅을 시작해보세요."
          actionLabel="게시글 둘러보기"
          actionHref="/"
        />
      ) : (
        <div>
          {chats.map(chat => {
            const partner = user ? getChatPartner(chat, user.id) : chat.otherUser;
            return (
              <Link
                key={chat.id}
                href={`/chat2/${chat.id}`}
                className="flex items-center gap-3 border-b border-border px-4 py-3.5 transition-colors hover:bg-muted"
              >
                <Avatar className="size-12">
                  <AvatarFallback className="text-lg">{partner.nickname.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{partner.nickname}</span>
                    <span className="text-xs text-muted-foreground">
                      {chat.lastMessageAt ? formatRelativeTime(chat.lastMessageAt) : ''}
                    </span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {chat.lastMessage || '채팅을 시작해보세요'}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground/70">{chat.postTitle}</p>
                </div>

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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Chat2Page() {
  return (
    <AuthGuard>
      <Chat2Content />
    </AuthGuard>
  );
}
