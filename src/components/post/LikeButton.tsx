'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
}

const LIKES_KEY = 'campulist_liked_posts';

function getLikedPosts(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LIKES_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function LikeButton({ postId, initialLiked }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);

  useEffect(() => {
    const likedPosts = getLikedPosts();
    setLiked(likedPosts.includes(postId));
  }, [postId]);

  const toggle = () => {
    const likedPosts = getLikedPosts();
    let updated: string[];
    if (likedPosts.includes(postId)) {
      updated = likedPosts.filter(id => id !== postId);
    } else {
      updated = [...likedPosts, postId];
    }
    localStorage.setItem(LIKES_KEY, JSON.stringify(updated));
    setLiked(!liked);
  };

  return (
    <Button variant="outline" size="icon" className="shrink-0" onClick={toggle}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        className={liked ? 'text-red-500' : ''}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </Button>
  );
}
