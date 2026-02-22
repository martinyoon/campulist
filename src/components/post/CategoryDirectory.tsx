'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCategoryGroups } from '@/data/categories';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeMajorId: number | null;
  universitySlug?: string;
}

export default function CategoryDirectory({
  open,
  onOpenChange,
  activeMajorId,
  universitySlug,
}: Props) {
  const router = useRouter();
  const groups = getCategoryGroups();
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && activeRef.current) {
      setTimeout(() => {
        activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [open, activeMajorId]);

  const baseUrl = universitySlug ? `/${universitySlug}` : '/all';

  const handleMajorClick = (majorSlug: string) => {
    router.push(`${baseUrl}/${majorSlug}`);
    onOpenChange(false);
  };

  const handleMinorClick = (majorSlug: string, minorSlug: string) => {
    router.push(`${baseUrl}/${majorSlug}?minor=${minorSlug}`);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-hidden rounded-t-2xl">
        <SheetHeader className="pb-0">
          <SheetTitle className="text-lg">카테고리 전체보기</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto px-4 pb-6 sm:columns-2 sm:gap-4">
          {groups.map(({ major, minors }) => {
            const isActive = major.id === activeMajorId;
            return (
              <div
                key={major.id}
                ref={isActive ? activeRef : undefined}
                className={`mb-4 break-inside-avoid rounded-xl border p-3.5 ${
                  isActive
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-border'
                }`}
              >
                {/* 대분류 헤더 */}
                <button
                  onClick={() => handleMajorClick(major.slug)}
                  className="flex w-full items-center gap-2 text-left transition-colors hover:text-blue-500"
                >
                  <span className="cat-icon text-xl">{major.icon}</span>
                  <span className="text-[15px] font-bold">{major.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">전체보기 ›</span>
                </button>

                {/* 소분류 목록 */}
                <div className="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-1">
                  {minors.map(minor => (
                    <button
                      key={minor.id}
                      onClick={() => handleMinorClick(major.slug, minor.slug)}
                      className="rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <span className="cat-icon">{minor.icon} </span>{minor.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
