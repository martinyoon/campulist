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
import { getPostImages } from '@/data/posts';
import { LIMITS } from '@/lib/constants';
import type { PostStatus, MemberType } from '@/lib/types';
import CategorySummary from '@/components/write/CategorySummary';
import { categoryExamples } from '@/data/categoryExamples';
import { getCategoryBySlug, getCategoryGroups } from '@/data/categories';
import type { User } from '@/lib/types';

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

function fillTemplate(template: string, user: User, targetUniversityId: number): string {
  const targetUni = universities.find(u => u.id === targetUniversityId);
  const targetShort = targetUni?.name.replace('대학교', '대') || '대학';
  const userUni = universities.find(u => u.id === user.universityId);
  const userShort = userUni?.name.replace('대학교', '대') || '대학';
  const typeLabel = MEMBER_TYPE_SHORT[user.memberType] || '';
  const dept = user.department || '본인학과';

  return template
    .replace(/\{\{prefix\}\}/g, `[${userShort}][${typeLabel}]`)
    .replace(/\{\{university\}\}/g, targetShort)
    .replace(/\{\{department\}\}/g, dept)
    .replace(/\{\{memberType\}\}/g, typeLabel);
}

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
  const [images, setImages] = useState<string[]>([]);
  const [contactPhone, setContactPhone] = useState('');
  const [contactPhoneCall, setContactPhoneCall] = useState(true);
  const [contactPhoneSms, setContactPhoneSms] = useState(true);
  const [contactKakao, setContactKakao] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const initialized = useRef(false);
  const uniFromUrl = useRef(false);

  async function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let w = img.width;
        let h = img.height;
        if (w > MAX_DIM || h > MAX_DIM) {
          if (w > h) { h = (h / w) * MAX_DIM; w = MAX_DIM; }
          else { w = (w / h) * MAX_DIM; h = MAX_DIM; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => { URL.revokeObjectURL(img.src); reject(new Error('이미지 로드 실패')); };
      img.src = URL.createObjectURL(file);
    });
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = LIMITS.MAX_IMAGES - images.length;
    const selected = Array.from(files).slice(0, remaining);
    try {
      const compressed = await Promise.all(selected.map(compressImage));
      setImages(prev => [...prev, ...compressed]);
    } catch {
      toast('일부 이미지를 처리할 수 없습니다.');
    }
    e.target.value = '';
  };

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
        setImages(getPostImages(editParam));
        if (post.contactMethods) {
          if (post.contactMethods.phone) {
            setContactPhone(post.contactMethods.phone);
            setContactPhoneCall(post.contactMethods.phoneCall ?? true);
            setContactPhoneSms(post.contactMethods.phoneSms ?? true);
          }
          if (post.contactMethods.kakaoLink) setContactKakao(post.contactMethods.kakaoLink);
          if (post.contactMethods.email) setContactEmail(post.contactMethods.email);
        }
        setStep('form');
        return;
      }
    }

    // URL에서 대학교 파라미터 확인 (브레드크럼 기반 자동 선택)
    const uniParam = params.get('uni');
    if (uniParam) {
      const uni = universities.find(u => u.slug === uniParam);
      if (uni) {
        setUniversityId(uni.id);
        uniFromUrl.current = true;
      }
    }

    // URL에서 major/minor 카테고리 파라미터 확인 (카테고리 페이지에서 진입 시)
    const majorParam = params.get('major');
    if (majorParam) {
      const majorCat = getCategoryBySlug(majorParam);
      if (majorCat && majorCat.parentId === null) {
        initialized.current = true;
        setMajorId(majorCat.id);
        const minorParam = params.get('minor');
        if (minorParam) {
          const minorCat = getCategoryBySlug(minorParam);
          if (minorCat && minorCat.parentId === majorCat.id) {
            setMinorId(minorCat.id);
            setStep('form');
          } else {
            setStep('minor');
          }
        } else {
          setStep('minor');
        }
        return;
      }
    }

    // uni 파라미터만 있는 경우 (대학교 페이지에서 진입)
    if (uniFromUrl.current && !majorParam) {
      initialized.current = true;
      return;
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
      if (!uniFromUrl.current) {
        setUniversityId(user.universityId);
      }
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

  const handleChangeCategory = () => {
    setStep('major');
  };

  const handleReset = () => {
    clearDraft();
    setTitle(''); setBody(''); setPrice(''); setPriceNegotiable(false);
    setUniversityId(1); setMajorId(null); setMinorId(null);
    setTags([]); setLocation(''); setImages([]); setDraftLoaded(false);
    setStep('major');
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && tags.length < 5 && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  // 예시 채우기 기능
  const hasExample = !isEditMode && minorId && categoryExamples[minorId];

  const fillTitleExample = () => {
    if (!minorId || !user || !categoryExamples[minorId]) return;
    const ex = categoryExamples[minorId];
    if (title.trim() && title.trim() !== `[${universities.find(u => u.id === universityId)?.name.replace('대학교', '대')}][${MEMBER_TYPE_SHORT[user.memberType]}] `) {
      if (!window.confirm('기존 제목을 예시로 대체할까요?')) return;
    }
    setTitle(fillTemplate(ex.title, user, universityId));
  };

  const fillPriceExample = () => {
    if (!minorId || !user || !categoryExamples[minorId]) return;
    const ex = categoryExamples[minorId];
    if (price && !window.confirm('기존 가격을 예시로 대체할까요?')) return;
    setPrice(ex.price);
    setPriceNegotiable(ex.negotiable);
  };

  const fillBodyExample = () => {
    if (!minorId || !user || !categoryExamples[minorId]) return;
    const ex = categoryExamples[minorId];
    if (body.trim() && !window.confirm('기존 내용을 예시로 대체할까요?')) return;
    setBody(fillTemplate(ex.body, user, universityId));
  };

  const fillAllExamples = () => {
    if (!minorId || !user || !categoryExamples[minorId]) return;
    const hasContent = title.trim() || body.trim() || price;
    if (hasContent && !window.confirm('모든 필드를 예시로 대체할까요?')) return;
    const ex = categoryExamples[minorId];
    setTitle(fillTemplate(ex.title, user, universityId));
    setPrice(ex.price);
    setPriceNegotiable(ex.negotiable);
    setBody(fillTemplate(ex.body, user, universityId));
    if (ex.tags.length > 0) {
      setTags(ex.tags.slice(0, 5).map(t => fillTemplate(t, user, universityId)));
    }
    if (ex.location) {
      setLocation(fillTemplate(ex.location, user, universityId));
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

    const contactMethods = {
      chat: true,
      ...(contactPhone.trim() && { phone: contactPhone.trim(), phoneCall: contactPhoneCall, phoneSms: contactPhoneSms }),
      ...(contactKakao.trim() && { kakaoLink: contactKakao.trim() }),
      ...(contactEmail.trim() && { email: contactEmail.trim() }),
    };

    const postData = {
      title: title.trim(),
      body: body.trim(),
      universityId,
      categoryMajorId: majorId!,
      categoryMinorId: minorId!,
      price: price ? Number(price) : null,
      priceNegotiable,
      locationDetail: location.trim() || null,
      contactMethods,
    };

    if (isEditMode && editId) {
      updatePost(editId, { ...postData, tags, images, status: postStatus });
      toast('게시글이 수정되었습니다!');
      router.push(`/post/${editId}`);
    } else {
      const post = createPost({ ...postData, authorId: user!.id, tags, images });
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

      {/* 대학 선택 (모든 Step에서 표시) */}
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium">대학교</label>
        <div className="flex flex-wrap gap-2">
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
        {/* 카테고리 통합 선택 (한 화면) */}
        {step !== 'form' && (
          <div>
            <h2 className="text-lg font-bold">카테고리 선택</h2>
            <p className="mt-1 text-sm text-muted-foreground">소분류를 클릭하면 바로 글쓰기로 이동합니다</p>
            <div className="mt-3 columns-2 gap-4">
              {getCategoryGroups().map(({ major, minors }) => (
                <div key={major.id} className="mb-3 break-inside-avoid">
                  <div className="flex items-center gap-1.5 py-1.5">
                    <span className="cat-icon text-lg">{major.icon}</span>
                    <span className="text-lg font-bold">{major.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pb-1">
                    {minors.map(minor => (
                      <button
                        key={minor.id}
                        onClick={() => { setMajorId(major.id); setMinorId(minor.id); setStep('form'); }}
                        className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-blue-500/10 hover:text-blue-500"
                      >
                        {minor.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 글쓰기 폼 */}
        {step === 'form' && (
          <div className="space-y-5">
            {/* 선택된 카테고리 요약 */}
            {majorId && minorId && (
              <CategorySummary
                universityId={universityId}
                majorId={majorId}
                minorId={minorId}
                onChangeCategory={handleChangeCategory}
              />
            )}

            {/* 전체 예시 채우기 */}
            {hasExample && (
              <button
                type="button"
                onClick={fillAllExamples}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/5 py-2.5 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-500/10"
              >
                <span>💡</span> 전체 예시 채우기
              </button>
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
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium">제목 <span className="text-red-500">*</span></label>
                {hasExample && (
                  <button type="button" onClick={fillTitleExample} className="text-xs text-blue-500 hover:underline">💡 예시</button>
                )}
              </div>
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
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium">가격</label>
                {hasExample && (
                  <button type="button" onClick={fillPriceExample} className="text-xs text-blue-500 hover:underline">💡 예시</button>
                )}
              </div>
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
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium">내용 <span className="text-red-500">*</span></label>
                {hasExample && (
                  <button type="button" onClick={fillBodyExample} className="text-xs text-blue-500 hover:underline">💡 예시</button>
                )}
              </div>
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

            {/* 이미지 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">사진 (최대 {LIMITS.MAX_IMAGES}장)</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((src, i) => (
                  <div key={i} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, j) => j !== i))}
                      className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] text-white hover:bg-black/80"
                    >
                      &times;
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-blue-600/80 py-0.5 text-center text-[9px] font-medium text-white">대표</span>
                    )}
                  </div>
                ))}
                {images.length < LIMITS.MAX_IMAGES && (
                  <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-blue-500 hover:text-blue-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                    <span className="mt-1 text-[10px]">{images.length}/{LIMITS.MAX_IMAGES}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
                )}
              </div>
              {images.length === 0 && (
                <p className="mt-1 text-xs text-muted-foreground">사진을 추가하면 관심을 더 많이 받을 수 있어요.</p>
              )}
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

            {/* 연락 방법 */}
            <div>
              <label className="mb-2 block text-sm font-medium">연락 방법</label>
              <div className="space-y-3 rounded-xl border border-border p-4">
                {/* 캠퍼스리스트 캠톡 (항상 활성) */}
                <label className="flex items-center gap-2.5 text-sm">
                  <input type="checkbox" checked disabled className="rounded" />
                  <span className="font-medium text-foreground">캠퍼스리스트 캠톡</span>
                  <span className="text-xs text-muted-foreground">(기본)</span>
                </label>

                {/* 전화번호 */}
                <div>
                  <label className="flex items-center gap-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={!!contactPhone}
                      onChange={e => { if (!e.target.checked) { setContactPhone(''); setContactPhoneCall(true); setContactPhoneSms(true); } else { setContactPhone(' '); } }}
                      className="rounded"
                    />
                    <span className="text-foreground">전화번호 공개</span>
                  </label>
                  {!!contactPhone && (
                    <div className="mt-2 ml-7 space-y-2">
                      <Input
                        type="tel"
                        placeholder="010-0000-0000"
                        value={contactPhone.trim()}
                        onChange={e => setContactPhone(e.target.value)}
                        className="max-w-xs"
                      />
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <input type="checkbox" checked={contactPhoneCall} onChange={e => setContactPhoneCall(e.target.checked)} className="rounded" />
                          전화 OK
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <input type="checkbox" checked={contactPhoneSms} onChange={e => setContactPhoneSms(e.target.checked)} className="rounded" />
                          문자 OK
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* 카카오 오픈채팅 */}
                <div>
                  <label className="flex items-center gap-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={!!contactKakao}
                      onChange={e => { if (!e.target.checked) setContactKakao(''); else setContactKakao(' '); }}
                      className="rounded"
                    />
                    <span className="text-foreground">카카오 오픈채팅</span>
                  </label>
                  {!!contactKakao && (
                    <div className="mt-2 ml-7">
                      <Input
                        type="url"
                        placeholder="https://open.kakao.com/o/..."
                        value={contactKakao.trim()}
                        onChange={e => setContactKakao(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                  )}
                </div>

                {/* 이메일 */}
                <div>
                  <label className="flex items-center gap-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={!!contactEmail}
                      onChange={e => { if (!e.target.checked) setContactEmail(''); else setContactEmail(user?.email || ' '); }}
                      className="rounded"
                    />
                    <span className="text-foreground">이메일 공개</span>
                  </label>
                  {!!contactEmail && (
                    <div className="mt-2 ml-7">
                      <Input
                        type="email"
                        placeholder="example@university.ac.kr"
                        value={contactEmail.trim()}
                        onChange={e => setContactEmail(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
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
