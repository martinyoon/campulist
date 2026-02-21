'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { universities } from '@/data/universities';
import type { MemberType } from '@/lib/types';

const MEMBER_TYPES: { value: MemberType; label: string; icon: string }[] = [
  { value: 'undergraduate', label: '학부생', icon: '🎓' },
  { value: 'graduate', label: '대학원생', icon: '📚' },
  { value: 'professor', label: '교수', icon: '👨‍🏫' },
  { value: 'staff', label: '교직원', icon: '🏢' },
  { value: 'alumni', label: '졸업생', icon: '🎒' },
  { value: 'merchant', label: '인근상인', icon: '🏪' },
  { value: 'general', label: '일반인', icon: '👤' },
];

export default function AuthPage() {
  const router = useRouter();
  const { user, isLoading, login, signup } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [memberType, setMemberType] = useState<MemberType>('undergraduate');
  const [universityId, setUniversityId] = useState<number | null>(null);

  // 이메일 도메인으로 대학교 자동 감지
  const emailDomain = email.trim().toLowerCase().split('@')[1] || '';
  const autoMatchedUni = universities.find(u => emailDomain.endsWith(u.domain));
  const isAcKrEmail = emailDomain.endsWith('.ac.kr') && !!autoMatchedUni;
  const needsUniSelector = mode === 'signup' && !isAcKrEmail;

  useEffect(() => {
    document.title = mode === 'login' ? '로그인 | 캠퍼스리스트' : '회원가입 | 캠퍼스리스트';
  }, [mode]);

  // 이미 로그인 상태면 홈으로
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      const result = login(email, password);
      if (result.success) {
        toast('로그인 되었습니다');
        router.push('/');
      } else {
        toast(result.error || '로그인에 실패했습니다');
      }
    } else {
      if (needsUniSelector && !universityId) {
        toast('관련 대학교를 선택하세요');
        return;
      }
      const result = signup({
        nickname, email, password, memberType,
        universityId: isAcKrEmail ? autoMatchedUni!.id : (universityId ?? undefined),
      });
      if (result.success) {
        toast('회원가입이 완료되었습니다');
        router.push('/');
      } else {
        toast(result.error || '회원가입에 실패했습니다');
      }
    }
  };

  if (isLoading || user) return null;

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <Link href="/" className="mb-8 block text-center">
        <span className="block text-2xl font-bold text-blue-500">캠퍼스리스트</span>
        <span className="text-xs text-muted-foreground">Campu(s)+list+.com = Campulist.com</span>
      </Link>

      <div className="rounded-xl border border-border p-6">
        {/* 탭 */}
        <div className="mb-6 flex rounded-lg bg-muted p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'signup' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label htmlFor="auth-nickname" className="mb-1.5 block text-sm font-medium">닉네임</label>
                <Input
                  id="auth-nickname"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                />
              </div>

              {/* 회원 유형 */}
              <div>
                <label className="mb-2 block text-sm font-medium">회원 유형</label>
                <div className="grid grid-cols-4 gap-2">
                  {MEMBER_TYPES.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setMemberType(type.value)}
                      className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors ${
                        memberType === type.value
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600'
                          : 'border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="text-base">{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium">이메일</label>
            <Input
              id="auth-email"
              type="email"
              placeholder="학교 이메일을 입력하세요"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {mode === 'signup' && isAcKrEmail && (
              <p className="mt-1 text-xs text-green-600">
                {autoMatchedUni!.name} 자동 인증됩니다.
              </p>
            )}
            {mode === 'signup' && !isAcKrEmail && (
              <p className="mt-1 text-xs text-muted-foreground">
                .ac.kr 이메일로 가입하면 학교 인증이 자동 완료됩니다.
              </p>
            )}
          </div>

          {/* 대학교 선택 (비학교 이메일일 때만) */}
          {needsUniSelector && (
            <div>
              <label htmlFor="auth-university" className="mb-1.5 block text-sm font-medium">관련 대학교</label>
              <select
                id="auth-university"
                value={universityId ?? ''}
                onChange={e => setUniversityId(e.target.value ? Number(e.target.value) : null)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">대학교를 선택하세요</option>
                {universities.filter(u => u.isActive).map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                거래할 대학교 캠퍼스를 선택하세요.
              </p>
            </div>
          )}

          <div>
            <label htmlFor="auth-password" className="mb-1.5 block text-sm font-medium">비밀번호</label>
            <Input
              id="auth-password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {mode === 'login' && (
              <p className="mt-1 text-xs text-muted-foreground">
                기존 테스트 계정: 비밀번호 1234
              </p>
            )}
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            {mode === 'login' ? '로그인' : '회원가입'}
          </Button>
        </form>

        <Separator className="my-6" />

        {/* 소셜 로그인 */}
        <div className="space-y-3">
          <p className="text-center text-xs text-muted-foreground">소셜 계정으로 시작하기</p>
          <Button variant="outline" className="w-full gap-2 opacity-50" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" fill="currentColor" /></svg>
            Facebook (준비 중)
          </Button>
          <Button variant="outline" className="w-full gap-2 bg-[#FEE500]/50 text-[#191919]/50" disabled>
            카카오 (준비 중)
          </Button>
          <Button variant="outline" className="w-full gap-2 bg-[#03C75A]/50 text-white/50" disabled>
            네이버 (준비 중)
          </Button>
        </div>
      </div>
    </div>
  );
}
