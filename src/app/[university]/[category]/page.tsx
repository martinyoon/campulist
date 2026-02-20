import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPosts, getUniversityBySlug } from '@/lib/api';
import { getCategoryBySlug, getMinorCategories } from '@/data/categories';
import UniversityTabs from '@/components/post/UniversityTabs';
import PostCard from '@/components/post/PostCard';
import { Badge } from '@/components/ui/badge';

interface Props {
  params: Promise<{ university: string; category: string }>;
  searchParams: Promise<{ minor?: string; sort?: string }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { university: uniSlug, category: catSlug } = await params;
  const { minor: minorSlug, sort } = await searchParams;
  const sortBy = (sort as 'latest' | 'price_asc' | 'price_desc' | 'popular') || 'latest';

  const university = await getUniversityBySlug(uniSlug);
  const category = getCategoryBySlug(catSlug);
  if (!university || !category || category.parentId !== null) notFound();

  const minors = getMinorCategories(category.id);
  const posts = await getPosts({
    universitySlug: uniSlug,
    categoryMajorSlug: catSlug,
    categoryMinorSlug: minorSlug || undefined,
    sortBy,
    limit: 30,
  });

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'price_asc', label: '가격 낮은순' },
    { value: 'price_desc', label: '가격 높은순' },
    { value: 'popular', label: '인기순' },
  ];

  const buildUrl = (params: { minor?: string; sort?: string }) => {
    const base = `/${uniSlug}/${catSlug}`;
    const sp = new URLSearchParams();
    const m = params.minor ?? minorSlug;
    const s = params.sort ?? sort;
    if (m) sp.set('minor', m);
    if (s && s !== 'latest') sp.set('sort', s);
    const qs = sp.toString();
    return qs ? `${base}?${qs}` : base;
  };

  return (
    <div>
      <UniversityTabs />

      {/* 카테고리 헤더 */}
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-2">
          <Link href={`/${uniSlug}`} className="text-sm text-muted-foreground hover:text-foreground">
            {university.name}
          </Link>
          <span className="text-sm text-muted-foreground/50">/</span>
          <span className="text-sm font-medium">{category.icon} {category.name}</span>
        </div>
        <h1 className="mt-1 text-xl font-bold">{category.icon} {category.name}</h1>
      </div>

      {/* 소분류 필터 */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        <a href={buildUrl({ minor: '' })}>
          <Badge
            variant={!minorSlug ? 'default' : 'outline'}
            className={`shrink-0 cursor-pointer ${!minorSlug ? 'bg-blue-600 text-white' : 'hover:bg-muted'}`}
          >
            전체
          </Badge>
        </a>
        {minors.map(minor => (
          <a key={minor.slug} href={buildUrl({ minor: minor.slug })}>
            <Badge
              variant={minorSlug === minor.slug ? 'default' : 'outline'}
              className={`shrink-0 cursor-pointer ${minorSlug === minor.slug ? 'bg-blue-600 text-white' : 'hover:bg-muted'}`}
            >
              {minor.icon} {minor.name}
            </Badge>
          </a>
        ))}
      </div>

      {/* 정렬 옵션 */}
      <div className="flex items-center gap-2 border-b border-border px-4 pb-3">
        <span className="text-xs text-muted-foreground">정렬:</span>
        {sortOptions.map(opt => (
          <a key={opt.value} href={buildUrl({ sort: opt.value })}>
            <span className={`cursor-pointer text-xs ${sortBy === opt.value ? 'font-semibold text-blue-500' : 'text-muted-foreground hover:text-foreground'}`}>
              {opt.label}
            </span>
          </a>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{posts.length}건</span>
      </div>

      {/* 게시글 목록 */}
      <div>
        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="px-4 py-16 text-center text-muted-foreground">
            이 카테고리에 게시글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
