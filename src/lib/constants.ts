// ============================================================
// 캠푸리스트 — 상수 정의
// localStorage 키, 기본값 등 매직 스트링 중앙 관리
// ============================================================

export const STORAGE_KEYS = {
  LIKED_POSTS: 'campulist_liked_posts',
  WRITE_DRAFT: 'campulist_write_draft',
  RECENT_SEARCHES: 'campulist_recent_searches',
} as const;

export const LIMITS = {
  MAX_TAGS: 5,
  MAX_IMAGES: 10,
  TITLE_MAX_LENGTH: 100,
  BODY_MAX_LENGTH: 5000,
  DRAFT_SAVE_DELAY: 1000,
} as const;
