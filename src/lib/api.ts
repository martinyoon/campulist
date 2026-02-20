// ============================================================
// 데이터 접근 레이어 — Phase A: Mock 데이터
// Phase B에서 이 파일만 Supabase 버전으로 교체하면 전환 완료
// ============================================================

import type { Post, PostListItem, PostDetail, PostFilters, User } from './types';
import { mockPosts, toPostListItem, getPostImages, getPostTags } from '@/data/posts';
import { universities } from '@/data/universities';
import { categories } from '@/data/categories';
import { getUserSummary, mockUsers } from '@/data/users';
import { STORAGE_KEYS } from './constants';

// localStorage에서 사용자 생성 게시글 가져오기
function getLocalPosts(): Post[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_POSTS);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

// 모든 게시글 (mock + localStorage)
function getAllPosts(): Post[] {
  return [...mockPosts, ...getLocalPosts()];
}

export async function getPosts(filters?: PostFilters): Promise<PostListItem[]> {
  let posts = getAllPosts().filter(p => p.status === 'active');

  if (filters?.universitySlug) {
    const uni = universities.find(u => u.slug === filters.universitySlug);
    if (uni) posts = posts.filter(p => p.universityId === uni.id);
  }

  if (filters?.categoryMajorSlug) {
    const cat = categories.find(c => c.slug === filters.categoryMajorSlug && c.parentId === null);
    if (cat) posts = posts.filter(p => p.categoryMajorId === cat.id);
  }

  if (filters?.categoryMinorSlug) {
    const cat = categories.find(c => c.slug === filters.categoryMinorSlug && c.parentId !== null);
    if (cat) posts = posts.filter(p => p.categoryMinorId === cat.id);
  }

  if (filters?.query) {
    const q = filters.query.toLowerCase();
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
    );
  }

  if (filters?.priceMin !== undefined) {
    const min = filters.priceMin;
    posts = posts.filter(p => p.price !== null && p.price >= min);
  }

  if (filters?.priceMax !== undefined) {
    const max = filters.priceMax;
    posts = posts.filter(p => p.price !== null && p.price <= max);
  }

  // 정렬
  const sortBy = filters?.sortBy || 'latest';
  switch (sortBy) {
    case 'latest':
      posts.sort((a, b) => new Date(b.bumpedAt).getTime() - new Date(a.bumpedAt).getTime());
      break;
    case 'price_asc':
      posts.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case 'price_desc':
      posts.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    case 'popular':
      posts.sort((a, b) => b.likeCount - a.likeCount);
      break;
  }

  // 페이지네이션
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const start = (page - 1) * limit;
  posts = posts.slice(start, start + limit);

  return posts.map(toPostListItem);
}

export async function getPostDetail(postId: string): Promise<PostDetail | null> {
  const post = getAllPosts().find(p => p.id === postId);
  if (!post) return null;

  const uni = universities.find(u => u.id === post.universityId);
  const major = categories.find(c => c.id === post.categoryMajorId);
  const minor = categories.find(c => c.id === post.categoryMinorId);
  if (!uni || !major || !minor) return null;

  return {
    ...post,
    author: getUserSummary(post.authorId),
    university: { id: uni.id, name: uni.name, slug: uni.slug },
    categoryMajor: { id: major.id, name: major.name, slug: major.slug, icon: major.icon },
    categoryMinor: { id: minor.id, name: minor.name, slug: minor.slug },
    images: getPostImages(post.id),
    tags: getPostTags(post.id),
    isLiked: false,
  };
}

export async function getRelatedPosts(postId: string, limit = 4): Promise<PostListItem[]> {
  const allPosts = getAllPosts();
  const post = allPosts.find(p => p.id === postId);
  if (!post) return [];

  // 같은 대학 + 같은 대분류 카테고리에서 추천
  const related = allPosts
    .filter(p => p.id !== postId && p.status === 'active' && p.universityId === post.universityId && p.categoryMajorId === post.categoryMajorId)
    .slice(0, limit);

  // 부족하면 같은 대학 다른 카테고리에서 보충
  if (related.length < limit) {
    const more = allPosts
      .filter(p => p.id !== postId && p.status === 'active' && p.universityId === post.universityId && !related.some(r => r.id === p.id))
      .slice(0, limit - related.length);
    related.push(...more);
  }

  return related.map(toPostListItem);
}

export async function getUniversityBySlug(slug: string) {
  return universities.find(u => u.slug === slug) || null;
}

export async function getAllUniversities() {
  return universities;
}

export async function getUserById(userId: string): Promise<User | null> {
  return mockUsers.find(u => u.id === userId) || null;
}

export async function getUserPosts(userId: string): Promise<PostListItem[]> {
  const posts = getAllPosts()
    .filter(p => p.authorId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return posts.map(toPostListItem);
}

// 게시글 생성 (localStorage에 저장)
export function createPost(input: {
  title: string;
  body: string;
  universityId: number;
  categoryMajorId: number;
  categoryMinorId: number;
  price: number | null;
  priceNegotiable: boolean;
  locationDetail: string | null;
  tags: string[];
}): Post {
  const now = new Date().toISOString();
  const post: Post = {
    id: `local-${Date.now()}`,
    title: input.title,
    body: input.body,
    authorId: 'u1', // Phase A: 하드코딩 사용자
    universityId: input.universityId,
    categoryMajorId: input.categoryMajorId,
    categoryMinorId: input.categoryMinorId,
    price: input.price,
    priceNegotiable: input.priceNegotiable,
    isPremium: false,
    status: 'active',
    locationDetail: input.locationDetail,
    viewCount: 0,
    likeCount: 0,
    bumpedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const saved = getLocalPosts();
    saved.push(post);
    localStorage.setItem(STORAGE_KEYS.USER_POSTS, JSON.stringify(saved));
  } catch { /* storage full */ }

  return post;
}
