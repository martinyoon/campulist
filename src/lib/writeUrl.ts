import { majorCategories } from '@/data/categories';

const majorSlugs = new Set(majorCategories.map(c => c.slug));

/**
 * 현재 pathname + searchParams 기반으로 글쓰기 URL 생성.
 * 카테고리 페이지에 있으면 ?major=&minor= 파라미터를 자동 추가.
 */
export function getWriteUrl(pathname: string, searchParams?: string): string {
  const segments = pathname.split('/').filter(Boolean);
  // /all/[category] 또는 /[university]/[category]
  if (segments.length >= 2) {
    const catSlug = segments[1];
    if (majorSlugs.has(catSlug)) {
      const params = new URLSearchParams(searchParams || '');
      const minor = params.get('minor');
      const writeParams = new URLSearchParams();
      writeParams.set('major', catSlug);
      if (minor) writeParams.set('minor', minor);
      return `/write?${writeParams.toString()}`;
    }
  }
  return '/write';
}
