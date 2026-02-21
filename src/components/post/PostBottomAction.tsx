'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import { bumpPost, findChatRoomByPost, createChatRoom } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { UserSummary } from '@/lib/types';

interface PostBottomActionProps {
  postId: string;
  postTitle: string;
  postPrice: number | null;
  postThumbnail: string | null;
  author: UserSummary;
}

export default function PostBottomAction({ postId, postTitle, postPrice, postThumbnail, author }: PostBottomActionProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setIsOwner(!!user && author.id === user.id);
  }, [author.id, user]);

  // 본인 게시글: 끌어올리기 버튼
  if (isOwner) {
    const handleBump = () => {
      bumpPost(postId);
      toast('게시글이 끌어올려졌습니다');
    };

    return (
      <Button onClick={handleBump} variant="outline" className="px-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
          <path d="m18 15-6-6-6 6" />
        </svg>
        끌어올리기
      </Button>
    );
  }

  // 타인 게시글: 채팅하기 버튼
  const handleChat = () => {
    const existing = findChatRoomByPost(postId);
    if (existing) {
      router.push(`/chat/${existing.id}`);
      return;
    }

    const room = createChatRoom({
      postId,
      postTitle,
      postPrice,
      postThumbnail,
      otherUser: author,
    });
    router.push(`/chat/${room.id}`);
  };

  return (
    <Button onClick={handleChat} className="bg-blue-600 px-8 text-white hover:bg-blue-700">
      채팅하기
    </Button>
  );
}
