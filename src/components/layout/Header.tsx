'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from '@/components/ThemeToggle';
import { universities } from '@/data/universities';
import { majorCategories } from '@/data/categories';
import { getUnreadNotificationCount } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnreadNotif, setHasUnreadNotif] = useState(false);

  useEffect(() => {
    setHasUnreadNotif(getUnreadNotificationCount() > 0);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        {/* 모바일 메뉴 */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="mt-8 flex flex-col gap-4">
              <p className="text-sm font-semibold text-muted-foreground">대학교</p>
              {universities.map(uni => (
                <Link key={uni.slug} href={`/${uni.slug}`} className="text-base hover:text-blue-500">
                  {uni.name}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              <p className="text-sm font-semibold text-muted-foreground">카테고리</p>
              {majorCategories.map(cat => {
                const uniSlug = universities.find(u => pathname.startsWith(`/${u.slug}`))?.slug || universities[0]?.slug || 'snu';
                return (
                  <Link key={cat.slug} href={`/${uniSlug}/${cat.slug}`} className="text-base hover:text-blue-500">
                    {cat.icon} {cat.name}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* 로고 */}
        <Link href="/" className="flex shrink-0 flex-col leading-tight">
          <span className="text-xl font-bold text-blue-500">캠퍼스리스트</span>
          <span className="text-[10px] text-muted-foreground">Campu(s)+list+.com = Campulist.com</span>
        </Link>

        {/* 검색 (데스크톱) */}
        <form onSubmit={handleSearch} className="hidden flex-1 md:block">
          <Input
            type="search"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </form>

        {/* 우측 버튼 */}
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/write">
                <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  글쓰기
                </Button>
              </Link>
              <Link href="/notifications" className="relative">
                <Button variant="ghost" size="icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                </Button>
                {hasUnreadNotif && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Link>
              <Link href="/my">
                <Button variant="ghost" size="icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /></svg>
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/auth">
              <Button size="sm" variant="outline">
                로그인
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 모바일 검색 */}
      <form onSubmit={handleSearch} className="border-t border-border px-4 py-2 md:hidden">
        <Input
          type="search"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </form>
    </header>
  );
}
