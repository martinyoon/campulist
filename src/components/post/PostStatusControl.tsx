'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { updatePostStatus, deletePost } from '@/lib/api';
import { CURRENT_USER_ID } from '@/data/chats';
import { STORAGE_KEYS } from '@/lib/constants';
import type { PostStatus } from '@/lib/types';

interface PostStatusControlProps {
  postId: string;
  authorId: string;
  initialStatus: PostStatus;
}

const STATUS_OPTIONS: { value: PostStatus; label: string }[] = [
  { value: 'active', label: '판매중' },
  { value: 'reserved', label: '예약중' },
  { value: 'completed', label: '거래완료' },
];

export default function PostStatusControl({ postId, authorId, initialStatus }: PostStatusControlProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<PostStatus>(initialStatus);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setIsOwner(authorId === CURRENT_USER_ID);
    // localStorage에서 최신 오버라이드 읽기
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POST_OVERRIDES);
      const overrides = saved ? JSON.parse(saved) : {};
      if (overrides[postId]?.status) {
        setStatus(overrides[postId].status);
      }
    } catch { /* ignore */ }
  }, [authorId, postId]);

  if (!isOwner) return null;

  const handleStatusChange = (newStatus: PostStatus) => {
    if (newStatus === status) return;
    updatePostStatus(postId, newStatus);
    setStatus(newStatus);
    const label = STATUS_OPTIONS.find(s => s.value === newStatus)?.label;
    toast(`${label}(으)로 변경되었습니다`);
  };

  const handleEdit = () => {
    router.push(`/write?edit=${postId}`);
  };

  const handleDelete = () => {
    if (!window.confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    deletePost(postId);
    toast('게시글이 삭제되었습니다');
    router.push('/my');
  };

  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">거래 상태 변경</p>
        <div className="flex gap-3">
          <button onClick={handleEdit} className="text-sm text-muted-foreground hover:text-blue-500">
            수정
          </button>
          <button onClick={handleDelete} className="text-sm text-muted-foreground hover:text-red-500">
            삭제
          </button>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleStatusChange(opt.value)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              status === opt.value
                ? opt.value === 'active'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                  : opt.value === 'reserved'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                    : 'border-green-500 bg-green-500/10 text-green-500'
                : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
