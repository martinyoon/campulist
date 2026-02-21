// ============================================================
// 캠퍼스리스트 — 상수 정의
// localStorage 키, 기본값 등 매직 스트링 중앙 관리
// ============================================================

export const STORAGE_KEYS = {
  LIKED_POSTS: 'campulist_liked_posts',
  WRITE_DRAFT: 'campulist_write_draft',
  RECENT_SEARCHES: 'campulist_recent_searches',
  CHAT_MESSAGES: 'campulist_chat_messages',
  USER_POSTS: 'campulist_user_posts',
  POST_OVERRIDES: 'campulist_post_overrides',
  CHAT_ROOMS: 'campulist_chat_rooms',
  RECENT_VIEWED: 'campulist_recent_viewed',
  NOTIFICATION_READ: 'campulist_notification_read',
  REPORTS: 'campulist_reports',
  POST_TAGS: 'campulist_post_tags',
  CURRENT_USER: 'campulist_current_user',
  REGISTERED_USERS: 'campulist_registered_users',
  CHAT_OVERRIDES: 'campulist_chat_overrides',
} as const;

export const LIMITS = {
  MAX_TAGS: 5,
  MAX_IMAGES: 10,
  TITLE_MAX_LENGTH: 100,
  BODY_MAX_LENGTH: 5000,
  DRAFT_SAVE_DELAY: 1000,
} as const;
