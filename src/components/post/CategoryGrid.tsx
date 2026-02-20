import Link from 'next/link';
import { majorCategories } from '@/data/categories';
import { universities } from '@/data/universities';

interface CategoryGridProps {
  universitySlug?: string;
}

export default function CategoryGrid({ universitySlug }: CategoryGridProps) {
  const defaultSlug = universities[0]?.slug || 'snu';
  const baseUrl = `/${universitySlug || defaultSlug}`;

  return (
    <div className="grid grid-cols-3 gap-2 px-4 py-3 sm:grid-cols-6">
      {majorCategories.map(cat => (
        <Link
          key={cat.slug}
          href={`${baseUrl}/${cat.slug}`}
          className="flex flex-col items-center gap-1.5 rounded-xl py-3 transition-colors hover:bg-muted"
        >
          <span className="text-2xl">{cat.icon}</span>
          <span className="text-xs font-medium text-foreground/80">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
