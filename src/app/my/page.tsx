'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import EmptyState from '@/components/ui/EmptyState';
import { getMyPosts, getPostsByIds, getRecentViewedPosts } from '@/lib/api';
import { formatPrice, formatRelativeTime } from '@/lib/format';
import type { PostListItem, MemberType } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { universities } from '@/data/universities';

type Tab = 'selling' | 'likes' | 'recent' | 'reviews';

const MEMBER_TYPE_LABELS: Record<MemberType, string> = {
  undergraduate: '🎓 학부생',
  graduate: '📚 대학원생',
  professor: '👨‍🏫 교수',
  staff: '🏢 교직원',
  alumni: '🎒 졸업생',
  merchant: '🏪 인근상인',
  general: '👤 일반인',
};

function getLikedPostIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKED_POSTS) || '[]');
  } catch {
    return [];
  }
}

function MyPageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('selling');
  const [myPosts, setMyPosts] = useState<PostListItem[]>([]);
  const [likedPosts, setLikedPosts] = useState<PostListItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<PostListItem[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    document.title = '마이페이지 | 캠퍼스리스트';
    if (user) {
      setMyPosts(getMyPosts(user.id));
    }
    const ids = getLikedPostIds();
    if (ids.length > 0) {
      setLikedPosts(getPostsByIds(ids));
    }
    setRecentPosts(getRecentViewedPosts());
  }, [user]);

  if (!user) return null;

  const university = universities.find(u => u.id === user.universityId);

  // Mock 후기 데이터
  const mockReviews = [
    { id: 'r1', reviewer: '민수짱', rating: 5, content: '거래 매우 깔끔하고 물건 상태 좋았습니다!', createdAt: '2026-02-18T10:00:00Z' },
    { id: 'r2', reviewer: '하나둘셋', rating: 4, content: '친절하게 거래해주셨어요. 감사합니다.', createdAt: '2026-02-15T14:00:00Z' },
    { id: 'r3', reviewer: '태현이네', rating: 5, content: '시간 약속 잘 지켜주셔서 좋았어요!', createdAt: '2026-02-10T09:00:00Z' },
  ];

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'selling', label: '내 게시글', count: myPosts.length },
    { key: 'likes', label: '찜한 목록', count: likedPosts.length },
    { key: 'recent', label: '최근 본', count: recentPosts.length },
    { key: 'reviews', label: '받은 후기', count: mockReviews.length },
  ];

  return (
    <div>
      {/* 프로필 카드 */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-2xl font-bold text-blue-500">
            {user.nickname.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{user.nickname}</h1>
              {user.isVerified && (
                <Badge variant="secondary" className="gap-0.5 text-[10px] text-blue-500">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                  인증됨
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {university?.name ?? ''} · {MEMBER_TYPE_LABELS[user.memberType]}{user.department ? ` · ${user.department}` : ''}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              로그아웃
            </button>
            <Link href={`/user/${user.id}`}>
              <Button variant="outline" size="sm">프로필</Button>
            </Link>
          </div>
        </div>

        {/* 매너온도 + 거래 통계 */}
        <div className="mt-4 flex gap-4 rounded-lg bg-muted px-4 py-3">
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-blue-500">{user.mannerTemp}°</p>
            <p className="text-xs text-muted-foreground">매너온도</p>
          </div>
          <Separator orientation="vertical" className="h-auto" />
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold">{user.tradeCount}</p>
            <p className="text-xs text-muted-foreground">거래 횟수</p>
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="border-b border-border py-1">
        {[
          { icon: '🔔', label: '캠알림', href: '/camnotif' },
          { icon: 'ℹ️', label: '서비스 소개', href: '/about' },
        ].map(item => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="m9 18 6-6-6-6" /></svg>
          </Link>
        ))}
        <button
          onClick={() => { setDeleteOpen(true); setConfirmText(''); }}
          className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-destructive/5"
        >
          <span className="text-lg">⚠️</span>
          <span className="flex-1 text-left text-sm font-medium text-destructive">회원탈퇴</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>

      {/* 탭 바 */}
      <div className="flex border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label} <span className="ml-1 text-xs">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div>
        {/* 내 게시글 */}
        {activeTab === 'selling' && (
          myPosts.length > 0 ? (
            myPosts.map(post => (
              <Link key={post.id} href={`/post/${post.id}`} className="flex gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/50">
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted text-2xl text-muted-foreground">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {post.status !== 'active' && (
                      <Badge variant="outline" className={`text-[10px] ${post.status === 'reserved' ? 'text-orange-500 border-orange-500/30' : 'text-green-500 border-green-500/30'}`}>
                        {post.status === 'reserved' ? '예약중' : '거래완료'}
                      </Badge>
                    )}
                    <p className="truncate text-sm font-medium">{post.title}</p>
                  </div>
                  <p className="mt-0.5 text-sm font-bold">
                    {post.price !== null ? formatPrice(post.price) : '가격 미정'}
                  </p>
                  <div className="mt-0.5 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(post.createdAt)} · 조회 {post.viewCount} · 찜 {post.likeCount}
                    </p>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/write?edit=${post.id}`); }}
                      className="flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-500/20"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      수정
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState message="등록한 게시글이 없습니다." actionLabel="첫 게시글 작성하기" actionHref="/write" />
          )
        )}

        {/* 찜한 목록 */}
        {activeTab === 'likes' && (
          likedPosts.length > 0 ? (
            likedPosts.map(post => (
              <Link key={post.id} href={`/post/${post.id}`} className="flex gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/50">
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{post.title}</p>
                  <p className="mt-0.5 text-sm font-bold">
                    {post.price !== null ? formatPrice(post.price) : '가격 미정'}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {post.university.name} · {formatRelativeTime(post.createdAt)}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState message="찜한 게시글이 없습니다." sub="게시글의 하트 버튼을 눌러 찜해보세요." />
          )
        )}

        {/* 최근 본 게시글 */}
        {activeTab === 'recent' && (
          recentPosts.length > 0 ? (
            recentPosts.map(post => (
              <Link key={post.id} href={`/post/${post.id}`} className="flex gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/50">
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{post.title}</p>
                  <p className="mt-0.5 text-sm font-bold">
                    {post.price !== null ? formatPrice(post.price) : '가격 미정'}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {post.university.name} · {formatRelativeTime(post.createdAt)}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState message="최근 본 게시글이 없습니다." sub="게시글을 둘러보면 여기에 표시됩니다." />
          )
        )}

        {/* 받은 후기 */}
        {activeTab === 'reviews' && (
          mockReviews.length > 0 ? (
            mockReviews.map(review => (
              <div key={review.id} className="border-b border-border px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {review.reviewer.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{review.reviewer}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < review.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={i < review.rating ? 'text-yellow-400' : 'text-muted-foreground/30'}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-foreground/90">{review.content}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(review.createdAt)}</p>
              </div>
            ))
          ) : (
            <EmptyState message="받은 후기가 없습니다." />
          )
        )}
      </div>

      {/* 회원탈퇴 확인 Sheet */}
      <Sheet open={deleteOpen} onOpenChange={setDeleteOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl" showCloseButton={false}>
          <SheetHeader className="pb-2">
            <SheetTitle className="text-lg text-destructive">회원탈퇴</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 px-4 pb-6">
            <p className="text-sm text-muted-foreground">
              탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 작성한 게시글 및 캠톡 내역</li>
              <li>• 찜한 목록 및 검색 기록</li>
              <li>• 알림 및 임시저장 데이터</li>
            </ul>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                확인을 위해 <span className="font-bold text-destructive">탈퇴합니다</span>를 입력하세요
              </label>
              <Input
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="탈퇴합니다"
              />
            </div>
            <Button
              onClick={() => {
                deleteAccount();
                toast('회원탈퇴가 완료되었습니다');
              }}
              disabled={confirmText !== '탈퇴합니다'}
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              회원탈퇴
            </Button>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}

export default function MyPage() {
  return (
    <AuthGuard>
      <MyPageContent />
    </AuthGuard>
  );
}
