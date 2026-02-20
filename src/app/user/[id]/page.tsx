import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUserById, getUserPosts } from '@/lib/api';
import { universities } from '@/data/universities';
import { formatRelativeTime } from '@/lib/format';
import PostCard from '@/components/post/PostCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import EmptyState from '@/components/ui/EmptyState';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) return { title: '사용자를 찾을 수 없습니다 | 캠푸리스트' };
  return {
    title: `${user.nickname}님의 프로필 | 캠푸리스트`,
    description: `${user.nickname}님의 판매 게시글 - 캠푸리스트`,
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const [user, posts] = await Promise.all([
    getUserById(id),
    getUserPosts(id),
  ]);
  if (!user) notFound();

  const university = universities.find(u => u.id === user.universityId);
  const activePosts = posts.filter(p => p.status === 'active');
  const completedPosts = posts.filter(p => p.status === 'completed');

  return (
    <div>
      {/* 프로필 헤더 */}
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
              {user.role === 'business' && (
                <Badge variant="outline" className="text-[10px] text-orange-500 border-orange-500/30">
                  비즈니스
                </Badge>
              )}
            </div>
            {university && (
              <p className="text-sm text-muted-foreground">
                {university.name}{user.department ? ` · ${user.department}` : ''}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              가입일 {formatRelativeTime(user.createdAt)}
            </p>
          </div>
        </div>

        {/* 매너온도 + 거래 통계 */}
        <div className="mt-4 flex gap-4 rounded-lg bg-muted px-4 py-3">
          <div className="flex-1 text-center">
            <p className={`text-2xl font-bold ${user.mannerTemp >= 38 ? 'text-blue-500' : user.mannerTemp >= 36.5 ? 'text-foreground' : 'text-orange-500'}`}>
              {user.mannerTemp}°
            </p>
            <p className="text-xs text-muted-foreground">매너온도</p>
          </div>
          <Separator orientation="vertical" className="h-auto" />
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold">{user.tradeCount}</p>
            <p className="text-xs text-muted-foreground">거래 횟수</p>
          </div>
          <Separator orientation="vertical" className="h-auto" />
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold">{posts.length}</p>
            <p className="text-xs text-muted-foreground">게시글</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* 판매 게시글 */}
      <section className="py-2">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-bold">판매 게시글</h2>
          <span className="text-sm text-muted-foreground">
            판매중 {activePosts.length} · 거래완료 {completedPosts.length}
          </span>
        </div>

        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <EmptyState message="등록된 게시글이 없습니다." />
        )}
      </section>
    </div>
  );
}
