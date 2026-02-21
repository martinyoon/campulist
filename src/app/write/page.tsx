'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { universities } from '@/data/universities';
import { STORAGE_KEYS } from '@/lib/constants';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { createPost, getPostForEdit, updatePost, deletePost } from '@/lib/api';
import type { PostStatus, MemberType } from '@/lib/types';
import CategoryStepMajor from '@/components/write/CategoryStepMajor';
import CategoryStepMinor from '@/components/write/CategoryStepMinor';
import CategorySummary from '@/components/write/CategorySummary';

interface WriteDraft {
  title: string;
  body: string;
  price: string;
  priceNegotiable: boolean;
  universityId: number;
  majorId: number | null;
  minorId: number | null;
  tags: string[];
  location: string;
  savedAt: string;
}

type WriteStep = 'major' | 'minor' | 'form';

const MEMBER_TYPE_SHORT: Record<MemberType, string> = {
  undergraduate: '학부생',
  graduate: '대학원생',
  professor: '교수',
  staff: '교직원',
  alumni: '졸업생',
  merchant: '인근상인',
  general: '일반인',
};

function WritePageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState<WriteStep>('major');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [universityId, setUniversityId] = useState(universities[0]?.id ?? 1);
  const [majorId, setMajorId] = useState<number | null>(null);
  const [minorId, setMinorId] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [postStatus, setPostStatus] = useState<PostStatus>('active');
  const [submitting, setSubmitting] = useState(false);
  const initialized = useRef(false);

  // 수정 모드 또는 임시저장 불러오기
  useEffect(() => {
    if (initialized.current) return;

    // URL에서 edit 파라미터 확인
    const params = new URLSearchParams(window.location.search);
    const editParam = params.get('edit');

    if (editParam) {
      // user 로드 전이면 대기
      if (!user) return;
      const post = getPostForEdit(editParam);
      if (post && post.authorId === user.id) {
        initialized.current = true;
        setEditId(editParam);
        setIsEditMode(true);
        setTitle(post.title);
        setBody(post.body);
        setPrice(post.price?.toString() || '');
        setPriceNegotiable(post.priceNegotiable);
        setUniversityId(post.universityId);
        setMajorId(post.categoryMajorId);
        setMinorId(post.categoryMinorId);
        setTags(post.tags);
        setLocation(post.locationDetail || '');
        setPostStatus(post.status);
        setStep('form');
        return;
      }
    }

    // 새 글쓰기: 임시저장 불러오기
    initialized.current = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WRITE_DRAFT);
      if (saved) {
        const draft: WriteDraft = JSON.parse(saved);
        setTitle(draft.title || '');
        setBody(draft.body || '');
        setPrice(draft.price || '');
        setPriceNegotiable(draft.priceNegotiable || false);
        setUniversityId(draft.universityId || 1);
        setMajorId(draft.majorId);
        setMinorId(draft.minorId);
        setTags(draft.tags || []);
        setLocation(draft.location || '');
        setLastSaved(draft.savedAt);
        setDraftLoaded(true);
        // 드래프트 카테고리 상태에 따라 step 결정
        if (draft.majorId && draft.minorId) {
          setStep('form');
        }
        // majorId만 있으면 대분류부터 시작 (선택값은 유지됨)
      }
    } catch { /* ignore parse errors */ }
  }, [user]);

  // 사용자 대학교를 기본값으로 설정 + 제목 접두어 자동 삽입
  useEffect(() => {
    if (user && !isEditMode && !draftLoaded) {
      setUniversityId(user.universityId);
      if (!title) {
        const uni = universities.find(u => u.id === user.universityId);
        const uniShort = uni ? uni.name.replace('대학교', '대') : '';
        const typeLabel = MEMBER_TYPE_SHORT[user.memberType] || '';
        setTitle(`[${uniShort}][${typeLabel}] `);
      }
    }
  }, [user, isEditMode, draftLoaded]);

  useEffect(() => {
    document.title = isEditMode ? '글 수정 | 캠퍼스리스트' : '글쓰기 | 캠퍼스리스트';
  }, [isEditMode]);

  // 자동 임시저장 (1초 디바운스, 수정 모드에서는 비활성)
  const saveDraft = useCallback(() => {
    if (isEditMode) return;
    const draft: WriteDraft = {
      title, body, price, priceNegotiable,
      universityId, majorId, minorId, tags, location,
      savedAt: new Date().toISOString(),
    };
    // 모든 필드가 비어있으면 저장하지 않음
    if (!title && !body && !price && !location && tags.length === 0 && !majorId) return;
    try {
      localStorage.setItem(STORAGE_KEYS.WRITE_DRAFT, JSON.stringify(draft));
      setLastSaved(draft.savedAt);
    } catch { /* storage full — ignore */ }
  }, [isEditMode, title, body, price, priceNegotiable, universityId, majorId, minorId, tags, location]);

  useEffect(() => {
    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [saveDraft]);

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEYS.WRITE_DRAFT);
    setLastSaved(null);
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 전환 핸들러
  const handleMajorSelect = (id: number) => {
    setMajorId(id);
    setMinorId(null);
  };

  const handleMajorContinue = () => {
    setStep('minor');
  };

  const handleMinorSelect = (id: number) => {
    setMinorId(id);
  };

  const handleMinorContinue = () => {
    setStep('form');
  };

  const handleBackToMajor = () => {
    setMinorId(null);
    setStep('major');
  };

  const handleChangeCategory = () => {
    setStep('major');
  };

  const handleReset = () => {
    clearDraft();
    setTitle(''); setBody(''); setPrice(''); setPriceNegotiable(false);
    setUniversityId(1); setMajorId(null); setMinorId(null);
    setTags([]); setLocation(''); setDraftLoaded(false);
    setStep('major');
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && tags.length < 5 && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = '제목을 입력해주세요';
    if (!body.trim()) errs.body = '내용을 입력해주세요';
    if (!minorId) errs.category = '카테고리를 선택해주세요';
    if (price && Number(price) < 0) errs.price = '올바른 가격을 입력해주세요';
    return errs;
  };

  const handleSubmit = () => {
    if (submitting) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // 첫 번째 에러 필드로 자동 스크롤
      const firstErrorKey = Object.keys(errs)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);

    const postData = {
      title: title.trim(),
      body: body.trim(),
      universityId,
      categoryMajorId: majorId!,
      categoryMinorId: minorId!,
      price: price ? Number(price) : null,
      priceNegotiable,
      locationDetail: location.trim() || null,
    };

    if (isEditMode && editId) {
      updatePost(editId, { ...postData, tags, status: postStatus });
      toast('게시글이 수정되었습니다!');
      router.push(`/post/${editId}`);
    } else {
      const post = createPost({ ...postData, authorId: user!.id, tags });
      clearDraft();
      toast('게시글이 등록되었습니다!');
      router.push(`/post/${post.id}`);
    }
  };

  const handleDelete = () => {
    if (!editId) return;
    if (!window.confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    deletePost(editId);
    toast('게시글이 삭제되었습니다');
    router.push('/my');
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">
          {isEditMode ? '글 수정' : step === 'form' ? '글쓰기' : '카테고리 선택'}
        </h1>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              임시저장됨
            </span>
          )}
          {draftLoaded && (
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {/* Step 인디케이터 */}
      {step !== 'form' && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className={step === 'major' ? 'font-bold text-foreground' : ''}>1. 대분류</span>
          <span>&rsaquo;</span>
          <span className={step === 'minor' ? 'font-bold text-foreground' : ''}>2. 소분류</span>
          <span>&rsaquo;</span>
          <span>3. 작성</span>
        </div>
      )}

      {/* 대학 선택 (모든 Step에서 표시) */}
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium">대학교</label>
        <div className="flex gap-2">
          {universities.map(uni => (
            <button
              key={uni.id}
              onClick={() => setUniversityId(uni.id)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                universityId === uni.id ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {uni.name.replace('대학교', '대')}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {/* Step 1: 대분류 선택 */}
        {step === 'major' && (
          <CategoryStepMajor
            selectedMajorId={majorId}
            onSelect={handleMajorSelect}
            onContinue={handleMajorContinue}
          />
        )}

        {/* Step 2: 소분류 선택 */}
        {step === 'minor' && majorId && (
          <CategoryStepMinor
            majorId={majorId}
            selectedMinorId={minorId}
            onSelect={handleMinorSelect}
            onContinue={handleMinorContinue}
            onBack={handleBackToMajor}
          />
        )}

        {/* Step 3: 글쓰기 폼 */}
        {step === 'form' && (
          <div className="space-y-5">
            {/* 선택된 카테고리 요약 */}
            {majorId && minorId && (
              <CategorySummary
                majorId={majorId}
                minorId={minorId}
                onChangeCategory={handleChangeCategory}
              />
            )}

            {/* 거래 상태 (수정 모드만) */}
            {isEditMode && (
              <div>
                <label className="mb-2 block text-sm font-medium">거래 상태</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPostStatus('active')}
                    className={`flex-1 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                      postStatus === 'active'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    판매중
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostStatus('reserved')}
                    className={`flex-1 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                      postStatus === 'reserved'
                        ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    예약중
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostStatus('completed')}
                    className={`flex-1 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                      postStatus === 'completed'
                        ? 'border-green-500 bg-green-500/10 text-green-500'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    거래완료
                  </button>
                </div>
              </div>
            )}

            {/* 제목 */}
            <div id="field-title">
              <label className="mb-1.5 block text-sm font-medium">제목 <span className="text-red-500">*</span></label>
              <Input
                placeholder="제목을 입력하세요"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={100}
              />
              <div className="mt-1 flex items-center justify-between">
                {errors.title ? <p className="text-xs text-red-500">{errors.title}</p> : <span />}
                <p className="text-xs text-muted-foreground">{title.length}/100</p>
              </div>
            </div>

            {/* 가격 */}
            <div id="field-price">
              <label className="mb-1.5 block text-sm font-medium">가격</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="가격 입력 (없으면 비워두세요)"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">원</span>
              </div>
              <label className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={priceNegotiable}
                  onChange={e => setPriceNegotiable(e.target.checked)}
                  className="rounded"
                />
                가격 협의 가능
              </label>
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            </div>

            {/* 본문 */}
            <div id="field-body">
              <label className="mb-1.5 block text-sm font-medium">내용 <span className="text-red-500">*</span></label>
              <textarea
                placeholder="내용을 입력하세요"
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={8}
                maxLength={5000}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">{body.length}/5,000</p>
              {errors.body && <p className="mt-1 text-xs text-red-500">{errors.body}</p>}
            </div>

            {/* 이미지 (Phase B: Supabase Storage 연동 후 활성화) */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">사진</label>
              <div className="flex items-center gap-3">
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground/50">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                  <span className="mt-1 text-[10px]">0/10</span>
                </div>
                <p className="text-xs text-muted-foreground">사진 업로드는 정식 버전에서 지원됩니다.</p>
              </div>
            </div>

            {/* 태그 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">태그 (최대 5개)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="태그 입력 후 추가"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1"
                />
                <Button variant="outline" onClick={addTag}>추가</Button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      #{tag}
                      <button onClick={() => setTags(tags.filter(t => t !== tag))} className="ml-0.5 text-muted-foreground hover:text-foreground">&times;</button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* 거래 장소 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">거래 희망 장소 (선택)</label>
              <Input
                placeholder="예: 서울대 정문 GS25 앞"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            {/* 등록 버튼 */}
            <div>
              <Button
                onClick={handleSubmit}
                disabled={!title || !minorId || submitting}
                className="w-full bg-blue-600 py-6 text-base hover:bg-blue-700"
              >
                {submitting ? '처리 중...' : isEditMode ? '수정하기' : '등록하기'}
              </Button>
              {(!title || !minorId) && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {!minorId && !title
                    ? '카테고리를 선택하고 제목을 입력해주세요'
                    : !minorId
                      ? '카테고리를 선택해주세요'
                      : '제목을 입력해주세요'}
                </p>
              )}
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="mt-3 w-full rounded-lg border border-red-500/30 bg-red-500/5 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/15"
                >
                  삭제하기
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <AuthGuard>
      <WritePageContent />
    </AuthGuard>
  );
}
