import Link from 'next/link';
import { majorCategories } from '@/data/categories';
import { universities } from '@/data/universities';

interface CategoryGridProps {
  universitySlug?: string;
}

export default function CategoryGrid({ universitySlug }: CategoryGridProps) {
  const baseUrl = universitySlug ? `/${universitySlug}` : '/all';

  return (
    <div className="grid grid-cols-3 gap-3 px-4 py-4 sm:grid-cols-7">
      {majorCategories.map(cat => (
        <Link
          key={cat.slug}
          href={`${baseUrl}/${cat.slug}`}
          className="flex flex-col items-center gap-1.5 rounded-xl py-3.5 transition-colors hover:bg-muted"
        >
          <span className="cat-icon text-3xl">{cat.icon}</span>
          <span className="text-[15px] font-semibold text-foreground">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
