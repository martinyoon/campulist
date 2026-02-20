'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/Toast';

export default function AuthPage() {
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast(mode === 'login' ? '로그인 되었습니다' : '회원가입이 완료되었습니다');
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <Link href="/" className="mb-8 block text-center">
        <span className="text-2xl font-bold text-blue-500">캠푸리스트</span>
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
            <div>
              <label className="mb-1.5 block text-sm font-medium">닉네임</label>
              <Input
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium">이메일</label>
            <Input
              type="email"
              placeholder="학교 이메일 (example@snu.ac.kr)"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {mode === 'signup' && (
              <p className="mt-1 text-xs text-muted-foreground">
                .ac.kr 이메일로 가입하면 학교 인증이 자동 완료됩니다.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">비밀번호</label>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            {mode === 'login' ? '로그인' : '회원가입'}
          </Button>
        </form>

        <Separator className="my-6" />

        {/* 소셜 로그인 */}
        <div className="space-y-3">
          <p className="text-center text-xs text-muted-foreground">소셜 계정으로 시작하기</p>
          <Button variant="outline" className="w-full gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" fill="currentColor" /></svg>
            Facebook으로 계속
          </Button>
          <Button variant="outline" className="w-full gap-2 bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/90">
            카카오로 계속
          </Button>
          <Button variant="outline" className="w-full gap-2 bg-[#03C75A] text-white hover:bg-[#03C75A]/90">
            네이버로 계속
          </Button>
        </div>
      </div>
    </div>
  );
}
