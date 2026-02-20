'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function MyPage() {
  // Phase A: Mock 사용자 (로그인 시스템 연동 전)
  const mockUser = {
    nickname: '김서울',
    email: 'seoul@snu.ac.kr',
    university: '서울대학교',
    isVerified: true,
    mannerTemp: 36.5,
    tradeCount: 12,
    avatar: '김',
  };

  const menuItems = [
    { icon: '📝', label: '내 게시글', href: '/my/posts', count: 5 },
    { icon: '❤️', label: '찜한 목록', href: '/my/likes', count: 3 },
    { icon: '🛒', label: '거래 내역', href: '/my/trades', count: 12 },
    { icon: '⭐', label: '받은 후기', href: '/my/reviews', count: 8 },
    { icon: '🔔', label: '알림 설정', href: '/my/notifications' },
    { icon: '⚙️', label: '계정 설정', href: '/my/settings' },
  ];

  return (
    <div>
      {/* 프로필 카드 */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-2xl font-bold text-blue-500">
            {mockUser.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{mockUser.nickname}</h1>
              {mockUser.isVerified && (
                <Badge variant="secondary" className="gap-0.5 text-[10px] text-blue-500">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                  인증됨
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{mockUser.university}</p>
            <p className="text-sm text-muted-foreground">{mockUser.email}</p>
          </div>
          <Link href="/my/settings">
            <Button variant="outline" size="sm">편집</Button>
          </Link>
        </div>

        {/* 매너 온도 + 거래 통계 */}
        <div className="mt-4 flex gap-4 rounded-lg bg-muted px-4 py-3">
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-blue-500">{mockUser.mannerTemp}°</p>
            <p className="text-xs text-muted-foreground">매너온도</p>
          </div>
          <Separator orientation="vertical" className="h-auto" />
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold">{mockUser.tradeCount}</p>
            <p className="text-xs text-muted-foreground">거래 횟수</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* 메뉴 목록 */}
      <div className="py-2">
        {menuItems.map(item => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            {item.count !== undefined && (
              <span className="text-sm text-muted-foreground">{item.count}</span>
            )}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="m9 18 6-6-6-6" /></svg>
          </Link>
        ))}
      </div>

      <Separator />

      {/* 로그아웃 */}
      <div className="px-4 py-4">
        <Button
          variant="ghost"
          className="w-full text-muted-foreground hover:text-destructive"
          onClick={() => alert('시제품 모드: 로그아웃 (Mock)')}
        >
          로그아웃
        </Button>
      </div>
    </div>
  );
}
