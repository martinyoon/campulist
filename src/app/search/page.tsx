import { getPosts } from '@/lib/api';
import PostCard from '@/components/post/PostCard';
import { Badge } from '@/components/ui/badge';

interface Props {
  searchParams: Promise<{ q?: string; sort?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, sort } = await searchParams;
  const query = q?.trim() || '';
  const sortBy = (sort as 'latest' | 'price_asc' | 'price_desc' | 'popular') || 'latest';

  const posts = query
    ? await getPosts({ query, sortBy, limit: 50 })
    : [];

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'price_asc', label: '가격 낮은순' },
    { value: 'price_desc', label: '가격 높은순' },
    { value: 'popular', label: '인기순' },
  ];

  return (
    <div>
      {/* 검색 결과 헤더 */}
      <div className="border-b border-border px-4 py-4">
        {query ? (
          <>
            <h1 className="text-xl font-bold">
              &ldquo;{query}&rdquo; 검색 결과
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {posts.length}건의 결과
            </p>
          </>
        ) : (
          <h1 className="text-xl font-bold">검색</h1>
        )}
      </div>

      {/* 정렬 옵션 */}
      {query && posts.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {sortOptions.map(opt => (
            <a key={opt.value} href={`/search?q=${encodeURIComponent(query)}&sort=${opt.value}`}>
              <Badge
                variant={sortBy === opt.value ? 'default' : 'outline'}
                className={`shrink-0 cursor-pointer ${
                  sortBy === opt.value ? 'bg-blue-600 text-white' : 'hover:bg-muted'
                }`}
              >
                {opt.label}
              </Badge>
            </a>
          ))}
        </div>
      )}

      {/* 검색 결과 목록 */}
      <div>
        {query ? (
          posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="px-4 py-16 text-center text-muted-foreground">
              <p className="text-lg font-medium">&ldquo;{query}&rdquo;에 대한 검색 결과가 없습니다.</p>
              <p className="mt-2 text-sm">다른 검색어로 시도해보세요.</p>
            </div>
          )
        ) : (
          <div className="px-4 py-16 text-center text-muted-foreground">
            <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <p className="text-lg font-medium">검색어를 입력하세요</p>
            <p className="mt-2 text-sm">물품, 카테고리, 태그 등으로 검색할 수 있습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
