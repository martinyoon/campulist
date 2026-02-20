'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { findChatRoomByUser, createChatRoom } from '@/lib/api';
import { CURRENT_USER_ID } from '@/data/chats';
import type { UserSummary } from '@/lib/types';

interface UserChatButtonProps {
  user: UserSummary;
}

export default function UserChatButton({ user }: UserChatButtonProps) {
  const router = useRouter();

  // 본인이면 표시하지 않음
  if (user.id === CURRENT_USER_ID) return null;

  const handleChat = () => {
    const existing = findChatRoomByUser(user.id);
    if (existing) {
      router.push(`/chat/${existing.id}`);
      return;
    }

    const room = createChatRoom({
      postId: '',
      postTitle: `${user.nickname}님과의 대화`,
      postPrice: null,
      postThumbnail: null,
      otherUser: user,
    });
    router.push(`/chat/${room.id}`);
  };

  return (
    <Button onClick={handleChat} className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      채팅하기
    </Button>
  );
}
