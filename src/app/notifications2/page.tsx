'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import EmptyState from '@/components/ui/EmptyState';
import { formatRelativeTime } from '@/lib/format';
import { getNotif2All, getNotif2UnreadCount, markNotif2Read, markNotif2AllRead, isNotif2Read } from '@/lib/notification2';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import type { Notification } from '@/lib/types';

// 알림 타입별 SVG 아이콘
function NotificationIcon({ type }: { type: string }) {
  const cls = "h-5 w-5";
  switch (type) {
    case 'chat':
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
    case 'like':
      return <svg className={cls} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
    case 'keyword':
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
    case 'review':
      return <svg className={cls} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
    default:
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 11 18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>;
  }
}

const typeColors: Record<string, string> = {
  chat: 'text-blue-500',
  like: 'text-red-400',
  keyword: 'text-amber-500',
  review: 'text-yellow-500',
  system: 'text-muted-foreground',
};

export default function Notifications2Page() {
  return (
    <AuthGuard>
      <Notifications2Content />
    </AuthGuard>
  );
}

function Notifications2Content() {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    document.title = '알림 | 캠퍼스리스트';
    setNotifications(getNotif2All(userId));
    setUnreadCount(getNotif2UnreadCount(userId));
  }, [userId]);

  const handleRead = (id: string) => {
    markNotif2Read(id);
    setUnreadCount(getNotif2UnreadCount(userId));
  };

  const handleReadAll = () => {
    markNotif2AllRead(userId);
    setUnreadCount(0);
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
                onClick={handleReadAll}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                전체 읽음
              </button>
            </>
          )}
        </div>
      </div>

      <Separator />

      {notifications.length === 0 ? (
        <EmptyState message="알림이 없습니다" />
      ) : (
        <div>
          {notifications.map(notif => {
            const read = isNotif2Read(notif);
            return (
              <Link
                key={notif.id}
                href={notif.link || '#'}
                onClick={() => handleRead(notif.id)}
                className={`flex gap-3 px-4 py-3.5 transition-colors hover:bg-muted ${
                  !read ? 'bg-blue-500/5' : ''
                }`}
              >
                <span className={`mt-0.5 ${typeColors[notif.type] || 'text-muted-foreground'}`}>
                  <NotificationIcon type={notif.type} />
                </span>
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
