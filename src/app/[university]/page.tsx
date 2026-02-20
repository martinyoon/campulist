import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts, getUniversityBySlug } from '@/lib/api';
import UniversityTabs from '@/components/post/UniversityTabs';
import CategoryGrid from '@/components/post/CategoryGrid';
import PostCard from '@/components/post/PostCard';
import { Separator } from '@/components/ui/separator';

interface Props {
  params: Promise<{ university: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { university: slug } = await params;
  const university = await getUniversityBySlug(slug);
  if (!university) return { title: '캠푸리스트' };
  return {
    title: `${university.name} | 캠푸리스트`,
    description: `${university.name} 캠퍼스 중고거래, 주거, 일자리, 커뮤니티 - 캠푸리스트`,
  };
}

export default async function UniversityPage({ params }: Props) {
  const { university: slug } = await params;
  const university = await getUniversityBySlug(slug);
  if (!university) notFound();

  const posts = await getPosts({ universitySlug: slug, sortBy: 'latest', limit: 20 });

  return (
    <div>
      <UniversityTabs />

      {/* 대학 정보 배너 */}
      <div className="bg-blue-950/30 px-4 py-4 dark:bg-blue-950/40">
        <h1 className="text-xl font-bold text-blue-400 dark:text-blue-300">{university.name}</h1>
        <p className="mt-0.5 text-sm text-blue-500 dark:text-blue-400">{university.region} · {university.nameEn}</p>
      </div>

      <CategoryGrid universitySlug={slug} />

      <Separator />

      <section>
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-bold">{university.name} 최신글</h2>
          <span className="text-sm text-muted-foreground">{posts.length}건</span>
        </div>

        <div>
          {posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="px-4 py-16 text-center text-muted-foreground">
              아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
