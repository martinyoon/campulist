import Link from 'next/link';
import { getPosts } from '@/lib/api';
import UniversityTabs from '@/components/post/UniversityTabs';
import CategoryGrid from '@/components/post/CategoryGrid';
import PostCard from '@/components/post/PostCard';
import PopularPostsSection from '@/components/post/PopularPostsSection';
import PostFeedWithLocal from '@/components/post/PostFeedWithLocal';
import { Separator } from '@/components/ui/separator';
import { mockPosts } from '@/data/posts';
import { categories } from '@/data/categories';
import { universities } from '@/data/universities';

export default async function HomePage() {
  const [latestPosts, popularPosts] = await Promise.all([
    getPosts({ sortBy: 'latest', limit: 20 }),
    getPosts({ sortBy: 'popular', limit: 5 }),
  ]);

  // 캠퍼스라이프 게시글 (카테고리 6: 캠퍼스라이프)
  const bizPosts = mockPosts.filter(p => p.categoryMajorId === 6 && p.status === 'active').slice(0, 3);
  const firstBizUni = bizPosts[0] ? universities.find(u => u.id === bizPosts[0].universityId) : null;
  const bizMoreHref = `/${firstBizUni?.slug || 'snu'}/campus-life`;

  return (
    <div>
      {/* 대학 선택 탭 */}
      <UniversityTabs />

      {/* 모든 대학 정보 배너 */}
      <div className="bg-blue-950/30 px-4 py-4 dark:bg-blue-950/40">
        <h1 className="text-xl font-bold text-blue-400 dark:text-blue-300">모든 대학</h1>
        <p className="mt-0.5 text-sm text-blue-500 dark:text-blue-400">전체 캠퍼스 통합 · All Universities</p>
      </div>

      {/* 카테고리 바로가기 */}
      <CategoryGrid />

      <Separator />

      {/* 실시간 인기글 (접기/펴기) */}
      <PopularPostsSection posts={popularPosts} />

      <Separator />

      {/* 캠퍼스라이프 */}
      {bizPosts.length > 0 && (
        <>
          <section>
            <div className="flex items-center justify-between px-4 py-4">
              <h2 className="text-xl font-bold">🏪 캠퍼스라이프</h2>
              <Link href={bizMoreHref} className="text-sm text-blue-500 hover:text-blue-600">더보기</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-4">
              {bizPosts.map(bp => {
                const minor = categories.find(c => c.id === bp.categoryMinorId);
                return (
                  <Link
                    key={bp.id}
                    href={`/post/${bp.id}`}
                    className="w-60 shrink-0 rounded-xl border border-border p-3.5 transition-colors hover:bg-muted"
                  >
                    <span className="text-sm text-blue-500">{minor?.name || '캠퍼스라이프'}</span>
                    <h3 className="mt-1 truncate text-[15px] font-medium">{bp.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{bp.body}</p>
                    <div className="mt-2 flex items-center gap-1 text-[13px] text-muted-foreground">
                      <span>❤️ {bp.likeCount}</span>
                      <span>· 조회 {bp.viewCount}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <Separator />
        </>
      )}

      {/* 최신 게시글 */}
      <section>
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="text-xl font-bold">최신 게시글</h2>
          <span className="text-sm text-muted-foreground">총 {latestPosts.length}건</span>
        </div>

        <PostFeedWithLocal serverPosts={latestPosts} />
      </section>
    </div>
  );
}
