import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostDetail, getRelatedPosts } from '@/lib/api';
import { formatPrice, formatRelativeTime } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ImageGallery from '@/components/post/ImageGallery';
import PostCard from '@/components/post/PostCard';
import ReportButton from '@/components/post/ReportButton';
import LikeButton from '@/components/post/LikeButton';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const [post, relatedPosts] = await Promise.all([
    getPostDetail(id),
    getRelatedPosts(id, 4),
  ]);
  if (!post) notFound();

  return (
    <div className="pb-24">
      {/* 이미지 갤러리 */}
      <ImageGallery images={post.images} title={post.title} />

      {/* 작성자 정보 */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg font-medium">
          {post.author.nickname.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{post.author.nickname}</span>
            {post.author.isVerified && (
              <Badge variant="secondary" className="h-5 gap-0.5 px-1.5 text-[10px] text-blue-500">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                {post.university.name} 인증
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            매너온도 {post.author.mannerTemp}° · 거래 {post.author.tradeCount}회
          </p>
        </div>
      </div>

      {/* 게시글 내용 */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/${post.university.slug}/${post.categoryMajor.slug}`} className="hover:text-blue-500">
            {post.categoryMajor.icon} {post.categoryMajor.name}
          </Link>
          <span>›</span>
          <span>{post.categoryMinor.name}</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          {post.status !== 'active' && (
            <Badge variant={post.status === 'reserved' ? 'secondary' : 'outline'} className={post.status === 'reserved' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}>
              {post.status === 'reserved' ? '예약중' : post.status === 'completed' ? '거래완료' : post.status}
            </Badge>
          )}
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {formatRelativeTime(post.createdAt)} · 조회 {post.viewCount} · 찜 {post.likeCount}
          </p>
          <ReportButton postId={post.id} />
        </div>

        <Separator className="my-4" />

        <div className="whitespace-pre-line text-base leading-relaxed text-foreground/90">
          {post.body}
        </div>

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 거래 장소 */}
        {post.locationDetail && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {post.locationDetail}
          </div>
        )}
      </div>

      {/* 관련 게시글 */}
      {relatedPosts.length > 0 && (
        <>
          <Separator />
          <section className="px-4 py-4">
            <h2 className="mb-3 text-lg font-bold">관련 게시글</h2>
            <div>
              {relatedPosts.map(rp => (
                <PostCard key={rp.id} post={rp} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background px-4 py-3 md:static md:mt-4 md:border-t-0">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <LikeButton postId={post.id} initialLiked={post.isLiked} />
          <div className="flex-1">
            <p className="text-lg font-bold">{formatPrice(post.price)}</p>
            {post.priceNegotiable && <p className="text-xs text-muted-foreground">가격 협의 가능</p>}
          </div>
          <Button className="bg-blue-600 px-8 text-white hover:bg-blue-700">
            채팅하기
          </Button>
        </div>
      </div>
    </div>
  );
}
