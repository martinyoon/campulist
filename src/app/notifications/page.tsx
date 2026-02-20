'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { formatRelativeTime } from '@/lib/format';
import { STORAGE_KEYS } from '@/lib/constants';
import type { Notification } from '@/lib/types';

const mockNotifications: Notification[] = [
  { id: 'n1', type: 'chat', title: '서연이님이 메시지를 보냈습니다', body: '맥북 프로 아직 판매 중인가요?', link: '/chat', isRead: false, createdAt: '2026-02-20T10:30:00Z' },
  { id: 'n2', type: 'like', title: '맥북 프로 M2 14인치 팝니다', body: '게시글에 좋아요가 눌렸습니다', link: '/post/p1', isRead: false, createdAt: '2026-02-20T09:15:00Z' },
  { id: 'n3', type: 'keyword', title: '키워드 알림: "아이패드"', body: '새 게시글이 등록되었습니다: 아이패드 에어 5세대 + 애플펜슬', link: '/post/p4', isRead: true, createdAt: '2026-02-19T16:00:00Z' },
  { id: 'n4', type: 'system', title: '캠푸리스트에 오신 것을 환영합니다!', body: '대학 인증을 완료하면 더 많은 기능을 이용할 수 있습니다.', link: '/my/settings', isRead: true, createdAt: '2026-02-18T10:00:00Z' },
  { id: 'n5', type: 'review', title: '거래 후기가 도착했습니다', body: '민수짱님이 후기를 남겼습니다: "빠른 거래 감사합니다!"', link: '/my/reviews', isRead: true, createdAt: '2026-02-17T14:00:00Z' },
];

const typeIcons: Record<string, string> = {
  chat: '💬',
  like: '❤️',
  keyword: '🔔',
  review: '⭐',
  system: '📢',
};

function getReadIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATION_READ) || '[]');
  } catch { return []; }
}

function saveReadIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_READ, JSON.stringify(ids));
  } catch { /* ignore */ }
}

export default function NotificationsPage() {
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    setReadIds(getReadIds());
  }, []);

  const isRead = (notif: Notification) => notif.isRead || readIds.includes(notif.id);
  const unreadCount = mockNotifications.filter(n => !isRead(n)).length;

  const markAsRead = (id: string) => {
    if (readIds.includes(id)) return;
    const next = [...readIds, id];
    setReadIds(next);
    saveReadIds(next);
  };

  const markAllAsRead = () => {
    const allIds = mockNotifications.map(n => n.id);
    setReadIds(allIds);
    saveReadIds(allIds);
  };

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold">알림</h1>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <>
              <span className="text-sm text-blue-500">{unreadCount}개 읽지 않음</span>
              <button
                onClick={markAllAsRead}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                전체 읽음
              </button>
            </>
          )}
        </div>
      </div>

      <Separator />

      {mockNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          <p className="mt-3 text-sm">알림이 없습니다</p>
        </div>
      ) : (
        <div>
          {mockNotifications.map(notif => {
            const read = isRead(notif);
            return (
              <Link
                key={notif.id}
                href={notif.link || '#'}
                onClick={() => markAsRead(notif.id)}
                className={`flex gap-3 px-4 py-3.5 transition-colors hover:bg-muted ${
                  !read ? 'bg-blue-500/5' : ''
                }`}
              >
                <span className="mt-0.5 text-lg">{typeIcons[notif.type] || '📌'}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!read ? 'font-semibold' : 'font-medium'}`}>
                      {notif.title}
                    </p>
                    {!read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  {notif.body && (
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{notif.body}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(notif.createdAt)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
