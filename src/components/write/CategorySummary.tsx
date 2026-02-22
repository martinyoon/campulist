'use client';

import { majorCategories, getMinorCategories } from '@/data/categories';

interface Props {
  majorId: number;
  minorId: number;
  onChangeCategory: () => void;
}

export default function CategorySummary({ majorId, minorId, onChangeCategory }: Props) {
  const major = majorCategories.find(c => c.id === majorId);
  const minor = getMinorCategories(majorId).find(c => c.id === minorId);

  return (
    <div id="field-category" className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">카테고리</span>
        <span className="text-sm font-medium">
          <span className="cat-icon">{major?.icon} </span>{major?.name} &rsaquo; <span className="cat-icon">{minor?.icon} </span>{minor?.name}
        </span>
      </div>
      <button
        onClick={onChangeCategory}
        className="text-xs text-blue-500 hover:underline"
      >
        변경
      </button>
    </div>
  );
}
