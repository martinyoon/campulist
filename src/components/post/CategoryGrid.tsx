'use client';

import { useState } from 'react';
import { majorCategories } from '@/data/categories';
import CategoryDirectory from './CategoryDirectory';

interface CategoryGridProps {
  universitySlug?: string;
}

export default function CategoryGrid({ universitySlug }: CategoryGridProps) {
  const [open, setOpen] = useState(false);
  const [activeMajorId, setActiveMajorId] = useState<number | null>(null);

  const handleClick = (majorId: number) => {
    setActiveMajorId(majorId);
    setOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-3 px-4 py-4 sm:grid-cols-7">
        {majorCategories.map(cat => (
          <button
            key={cat.slug}
            onClick={() => handleClick(cat.id)}
            className="flex flex-col items-center gap-1.5 rounded-xl py-3.5 transition-colors hover:bg-muted"
          >
            <span className="cat-icon text-3xl">{cat.icon}</span>
            <span className="text-[15px] font-semibold text-foreground">{cat.name}</span>
          </button>
        ))}
      </div>

      <CategoryDirectory
        open={open}
        onOpenChange={setOpen}
        activeMajorId={activeMajorId}
        universitySlug={universitySlug}
      />
    </>
  );
}
